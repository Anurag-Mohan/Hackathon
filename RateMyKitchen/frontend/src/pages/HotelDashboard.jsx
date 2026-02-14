import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Badge, Card, Alert } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import axios from 'axios';

const HotelDashboard = () => {
    const [hotel, setHotel] = useState({});
    const [violations, setViolations] = useState([]);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Filter State
    const [filter, setFilter] = useState('all'); // 'all', 'today', 'week', 'month'

    // Sound Effect (Pleasant Chime)
    const playNotificationSound = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const primary = audioContext.createOscillator();
        const secondary = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        // Bell-like tones
        primary.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        primary.type = 'triangle';
        secondary.frequency.setValueAtTime(1046.50, audioContext.currentTime); // C6
        secondary.type = 'sine';

        // Mix
        primary.connect(gainNode);
        secondary.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Envelope
        primary.start();
        secondary.start();

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05); // Attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5); // Decay (Long)

        primary.stop(audioContext.currentTime + 1.5);
        secondary.stop(audioContext.currentTime + 1.5);
    };

    const prevViolationsRef = React.useRef([]);

    useEffect(() => {
        fetchProfile();
        fetchViolations();

        // Polling every 3 seconds for real-time updates
        const interval = setInterval(() => {
            fetchViolations(true);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/hotel/profile', config);
            setHotel(res.data);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile: ' + (err.response?.data?.message || err.message));
        }
    };

    const fetchViolations = async (isPolling = false) => {
        try {
            const res = await axios.get('http://localhost:5001/api/hotel/violations', config);
            const newViolations = res.data;

            // Check for new violations
            if (isPolling && newViolations.length > prevViolationsRef.current.length) {
                playNotificationSound();
                // Optional: Show toast or visual cue
            }

            setViolations(newViolations);
            prevViolationsRef.current = newViolations;

        } catch (err) {
            console.error('Error fetching violations:', err);
            // Don't set error on polling to avoid flickering UI if one request fails momentarily
            if (!isPolling) setError('Failed to load violations: ' + (err.response?.data?.message || err.message));
        }
    };

    // Filter Logic
    const getFilteredViolations = () => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return violations.filter(v => {
            const date = new Date(v.detected_at);
            if (filter === 'today') {
                return date >= startOfToday;
            }
            if (filter === 'week') {
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return date >= oneWeekAgo;
            }
            if (filter === 'month') {
                const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return date >= oneMonthAgo;
            }
            return true;
        });
    };

    const filteredViolations = getFilteredViolations();

    const getAIScore = () => {
        const score = Math.max(0, 100 - (hotel.violation_count || 0) * 10);
        return score;
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'var(--success)';
        if (score >= 60) return 'var(--warning)';
        return 'var(--danger)';
    };

    const getGradeLetter = (score) => {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    };

    return (
        <>
            <Navbar />
            <Container style={{
                marginTop: '100px',
                paddingTop: '40px',
                paddingBottom: '60px',
                minHeight: '100vh'
            }}>
                {error && (
                    <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-4">
                        <Alert.Heading>Error Loading Dashboard</Alert.Heading>
                        <p>{error}</p>
                    </Alert>
                )}

                {/* Header */}
                <div className="animate-fadeInUp mb-4">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h2 className="mb-2 display-5 fw-bold" style={{ color: 'var(--gray-900)' }}>
                                {hotel.hotel_name}
                            </h2>
                            <p style={{ color: 'var(--gray-600)' }}>
                                <i className="fas fa-envelope me-2"></i>{hotel.email} <span className="mx-2">|</span>
                                <i className="fas fa-map-marker-alt me-2"></i>{hotel.address} |
                                <i className="fas fa-phone ms-3 me-2"></i>{hotel.contact}
                            </p>
                        </div>
                        {hotel.last_inspection_date && (
                            <div className="text-end">
                                <small style={{ color: 'var(--gray-600)' }}>Last Inspection</small>
                                <p className="mb-0 fw-bold" style={{ color: 'var(--primary-600)' }}>
                                    <i className="fas fa-calendar-check me-2"></i>
                                    {new Date(hotel.last_inspection_date).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                        <div className="ms-3">
                            <a
                                href="http://localhost:5001/api/hotel/report"
                                className="btn btn-outline-primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const token = localStorage.getItem('token');
                                    fetch('http://localhost:5001/api/hotel/report', {
                                        headers: { Authorization: `Bearer ${token}` }
                                    })
                                        .then(response => response.blob())
                                        .then(blob => {
                                            const url = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `Compliance_Report_${new Date().toISOString().split('T')[0]}.pdf`;
                                            a.click();
                                        })
                                        .catch(err => console.error("Report download failed:", err));
                                }}
                            >
                                <i className="fas fa-file-pdf me-2"></i>Download Report
                            </a>
                        </div>
                    </div>
                </div>

                {/* Stats Cards Row */}
                <Row className="g-4 mb-4">
                    {/* Official Hygiene Score */}
                    <Col md={3} className="animate-fadeInUp">
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            border: '2px solid rgba(59, 130, 246, 0.2)',
                            height: '100%',
                            textAlign: 'center'
                        }}>
                            <div className="mb-2 d-flex justify-content-center">
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: (hotel.hygiene_score !== null && hotel.hygiene_score !== undefined)
                                        ? `conic-gradient(${getScoreColor(hotel.hygiene_score)} ${hotel.hygiene_score}%, var(--gray-200) 0)`
                                        : 'var(--gray-200)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        background: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column'
                                    }}>
                                        {(hotel.hygiene_score !== null && hotel.hygiene_score !== undefined) ? (
                                            <>
                                                <h2 className="mb-0 fw-bold" style={{ color: getScoreColor(hotel.hygiene_score), fontSize: '2rem' }}>
                                                    {getGradeLetter(hotel.hygiene_score)}
                                                </h2>
                                                <small style={{ color: 'var(--gray-600)', fontSize: '0.75rem' }}>{hotel.hygiene_score}</small>
                                            </>
                                        ) : (
                                            <span style={{ color: 'var(--gray-400)' }}>N/A</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <h6 className="mb-1" style={{ color: 'var(--gray-900)' }}>Official Score</h6>
                            <Badge bg={hotel.hygiene_status === 'Clean' ? 'success' : hotel.hygiene_status === 'Moderately Clean' ? 'warning' : hotel.hygiene_status === 'Dirty' ? 'danger' : 'secondary'}>
                                {hotel.hygiene_status || 'Pending'}
                            </Badge>
                        </div>
                    </Col>

                    {/* AI-Calculated Score */}
                    <Col md={3} className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(13, 148, 136, 0.1) 100%)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            border: '2px solid rgba(20, 184, 166, 0.2)',
                            height: '100%',
                            textAlign: 'center'
                        }}>
                            <div className="mb-2">
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    margin: '0 auto',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, var(--accent-600), var(--accent-700))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 10px 25px rgba(20, 184, 166, 0.3)'
                                }}>
                                    <i className="fas fa-robot fa-2x" style={{ color: 'white' }}></i>
                                </div>
                            </div>
                            <h2 className="mb-1 fw-bold" style={{ color: getScoreColor(getAIScore()) }}>
                                {getAIScore()}
                            </h2>
                            <h6 className="mb-0" style={{ color: 'var(--gray-900)' }}>AI Score</h6>
                            <small style={{ color: 'var(--gray-600)', fontSize: '0.75rem' }}>Real-time monitoring</small>
                        </div>
                    </Col>

                    {/* Total Fines */}
                    <Col md={3} className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            border: '2px solid rgba(239, 68, 68, 0.2)',
                            height: '100%',
                            textAlign: 'center'
                        }}>
                            <div className="mb-2">
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    margin: '0 auto',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)'
                                }}>
                                    <i className="fas fa-rupee-sign fa-2x" style={{ color: 'white' }}></i>
                                </div>
                            </div>
                            <h2 className="mb-1 fw-bold" style={{ color: '#ef4444' }}>
                                ₹{parseFloat(hotel.fine_amount || 0).toFixed(2)}
                            </h2>
                            <h6 className="mb-0" style={{ color: 'var(--gray-900)' }}>Total Fines</h6>
                            <small style={{ color: 'var(--gray-600)', fontSize: '0.75rem' }}>Imposed by admin</small>
                        </div>
                    </Col>

                    {/* Violations Count */}
                    <Col md={3} className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            border: '2px solid rgba(245, 158, 11, 0.2)',
                            height: '100%',
                            textAlign: 'center'
                        }}>
                            <div className="mb-2">
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    margin: '0 auto',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
                                }}>
                                    <i className="fas fa-exclamation-triangle fa-2x" style={{ color: 'white' }}></i>
                                </div>
                            </div>
                            <h2 className="mb-1 fw-bold" style={{ color: '#f59e0b' }}>
                                {hotel.violation_count || 0}
                            </h2>
                            <h6 className="mb-0" style={{ color: 'var(--gray-900)' }}>Violations</h6>
                            <small style={{ color: 'var(--gray-600)', fontSize: '0.75rem' }}>AI detected</small>
                        </div>
                    </Col>
                </Row>

                {/* Admin Memo Section */}
                {hotel.memo && (
                    <Row className="mb-4">
                        <Col md={12} className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                            <Alert variant="info" style={{
                                borderRadius: '16px',
                                border: '2px solid rgba(59, 130, 246, 0.2)',
                                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%)'
                            }}>
                                <div className="d-flex align-items-start gap-3">
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <i className="fas fa-sticky-note fa-lg" style={{ color: 'white' }}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="mb-2" style={{ color: 'var(--gray-900)' }}>
                                            <i className="fas fa-user-shield me-2"></i>Admin Memo
                                        </h5>
                                        <p className="mb-0" style={{ color: 'var(--gray-700)', whiteSpace: 'pre-wrap' }}>
                                            {hotel.memo}
                                        </p>
                                    </div>
                                </div>
                            </Alert>
                        </Col>
                    </Row>
                )}

                {/* Recent Violations */}
                <Row>
                    <Col md={12}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 style={{ color: 'var(--gray-900)', margin: 0 }}>
                                <i className="fas fa-history me-2" style={{ color: 'var(--primary-600)' }}></i>
                                Recent Violations
                            </h4>
                            <div className="btn-group">
                                {['all', 'today', 'week', 'month'].map((f) => (
                                    <button
                                        key={f}
                                        className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setFilter(f)}
                                        style={{ textTransform: 'capitalize' }}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <GlassCard>
                            {violations.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-check-circle fa-4x mb-3" style={{ color: 'var(--success)' }}></i>
                                    <h5 style={{ color: 'var(--gray-900)' }}>No violations detected!</h5>
                                    <p style={{ color: 'var(--gray-600)' }}>Keep up the excellent hygiene standards.</p>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {filteredViolations.map((v, index) => (
                                        <div key={v.id} className="col-md-6 animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                                            <div className="p-3" style={{
                                                background: (index === 0 && filter === 'all') ? 'linear-gradient(135deg, #fff, #fff0f0)' : 'white', // Highlight first item only in 'all' view
                                                borderRadius: '12px',
                                                border: index === 0 ? '2px solid #ef4444' : '1px solid var(--gray-200)',
                                                boxShadow: index === 0 ? '0 10px 25px rgba(239, 68, 68, 0.15)' : 'var(--shadow-sm)',
                                                transition: 'all var(--transition-base)',
                                                position: 'relative'
                                            }}
                                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = index === 0 ? '0 10px 25px rgba(239, 68, 68, 0.15)' : 'var(--shadow-sm)'}>

                                                {index === 0 && (
                                                    <Badge bg="danger" style={{
                                                        position: 'absolute',
                                                        top: '-10px',
                                                        right: '15px',
                                                        boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)',
                                                        animation: 'pulse 2s infinite'
                                                    }}>
                                                        LATEST
                                                    </Badge>
                                                )}
                                                <div className="d-flex gap-3">
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={`http://localhost:5001${v.snapshot_url}`}
                                                            alt="Violation"
                                                            style={{
                                                                width: '120px',
                                                                height: '90px',
                                                                objectFit: 'cover',
                                                                borderRadius: '8px'
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1" style={{ color: 'var(--danger)' }}>
                                                            <i className="fas fa-exclamation-circle me-2"></i>
                                                            {v.violation_type}
                                                        </h6>
                                                        <small style={{ color: 'var(--gray-600)' }}>
                                                            <i className="fas fa-clock me-1"></i>
                                                            {new Date(v.detected_at).toLocaleString()}
                                                        </small>
                                                        <div className="mt-2">
                                                            <Badge bg={v.severity === 'High' ? 'danger' : v.severity === 'Medium' ? 'warning' : 'info'}>
                                                                {v.severity}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </GlassCard>
                    </Col>
                </Row>
            </Container >
        </>
    );
};

export default HotelDashboard;
