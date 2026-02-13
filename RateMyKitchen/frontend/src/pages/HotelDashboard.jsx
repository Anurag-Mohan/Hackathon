import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Badge, Card, ProgressBar } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import axios from 'axios';

const HotelDashboard = () => {
    const [hotel, setHotel] = useState({});
    const [violations, setViolations] = useState([]);

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchProfile();
        fetchViolations();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/hotel/profile', config);
            setHotel(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchViolations = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/hotel/violations', config);
            setViolations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getHygieneScore = () => {
        const maxViolations = 10;
        const score = Math.max(0, 100 - (hotel.violation_count || 0) * 10);
        return score;
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'var(--success)';
        if (score >= 60) return 'var(--warning)';
        return 'var(--danger)';
    };

    return (
        <>
            <Navbar />
            <Container className="py-5" style={{ paddingTop: '100px' }}>
                {/* Header */}
                <div className="animate-fadeInUp mb-4">
                    <h2 className="mb-2 display-5 fw-bold" style={{ color: 'var(--gray-900)' }}>
                        {hotel.hotel_name}
                    </h2>
                    <p style={{ color: 'var(--gray-600)' }}>
                        <i className="fas fa-map-marker-alt me-2"></i>{hotel.address} |
                        <i className="fas fa-phone ms-3 me-2"></i>{hotel.contact}
                    </p>
                </div>

                <Row className="g-4 mb-4">
                    {/* Hygiene Score Card */}
                    <Col md={4} className="animate-fadeInUp">
                        <Card className="glass-card border-0 h-100">
                            <Card.Body className="text-center">
                                <div className="mb-3">
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        margin: '0 auto',
                                        borderRadius: '50%',
                                        background: `conic-gradient(${getScoreColor(getHygieneScore())} ${getHygieneScore()}%, var(--gray-200) 0)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
                                            background: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'column'
                                        }}>
                                            <h2 className="mb-0 fw-bold" style={{ color: getScoreColor(getHygieneScore()) }}>
                                                {getHygieneScore()}
                                            </h2>
                                            <small style={{ color: 'var(--gray-600)' }}>Score</small>
                                        </div>
                                    </div>
                                </div>
                                <h5 style={{ color: 'var(--gray-900)' }}>Hygiene Rating</h5>
                                <Badge bg={hotel.hygiene_status === 'Clean' ? 'success' : 'warning'} className="fs-6">
                                    {hotel.hygiene_status || 'Pending'}
                                </Badge>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Violations Count */}
                    <Col md={4} className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <Card className="glass-card border-0 h-100">
                            <Card.Body className="text-center">
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    margin: '0 auto 1rem',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, var(--danger), #dc2626)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fas fa-exclamation-triangle fa-3x" style={{ color: 'white' }}></i>
                                </div>
                                <h2 className="mb-2 fw-bold" style={{ color: 'var(--danger)' }}>
                                    {hotel.violation_count || 0}
                                </h2>
                                <h5 style={{ color: 'var(--gray-900)' }}>Total Violations</h5>
                                <p className="mb-0" style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                                    Detected by AI monitoring
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* AI Monitoring Status */}
                    <Col md={4} className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        <Card className="glass-card border-0 h-100">
                            <Card.Body className="text-center">
                                <div className="animate-pulse" style={{
                                    width: '80px',
                                    height: '80px',
                                    margin: '0 auto 1rem',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, var(--success), #059669)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fas fa-video fa-3x" style={{ color: 'white' }}></i>
                                </div>
                                <h5 style={{ color: 'var(--gray-900)' }}>AI Monitoring</h5>
                                <Badge bg="success" className="fs-6">
                                    <i className="fas fa-circle me-2" style={{ fontSize: '0.5rem' }}></i>
                                    Active
                                </Badge>
                                <p className="mb-0 mt-2" style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                                    24/7 real-time surveillance
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <h4 className="mb-3" style={{ color: 'var(--gray-900)' }}>
                            <i className="fas fa-history me-2" style={{ color: 'var(--primary-600)' }}></i>
                            Recent Violations
                        </h4>
                        <GlassCard>
                            {violations.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-check-circle fa-4x mb-3" style={{ color: 'var(--success)' }}></i>
                                    <h5 style={{ color: 'var(--gray-900)' }}>No violations detected!</h5>
                                    <p style={{ color: 'var(--gray-600)' }}>Keep up the excellent hygiene standards.</p>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {violations.map(v => (
                                        <div key={v.id} className="col-md-6">
                                            <div className="p-3" style={{
                                                background: 'white',
                                                borderRadius: '12px',
                                                border: '1px solid var(--gray-200)',
                                                boxShadow: 'var(--shadow-sm)',
                                                transition: 'all var(--transition-base)'
                                            }}
                                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
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
            </Container>
        </>
    );
};

export default HotelDashboard;
