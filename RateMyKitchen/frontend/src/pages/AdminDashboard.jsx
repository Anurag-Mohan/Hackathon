import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Badge, Tab, Tabs, Card, Modal, Form } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import AchievementManager from '../components/AchievementManager';
import ViolationViewer from '../components/ViolationViewer';
import axios from 'axios';

const AdminDashboard = () => {
    const [hotels, setHotels] = useState([]);
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({
        totalHotels: 0,
        pendingApprovals: 0,
        totalViolations: 0,
        activeReports: 0
    });

    // Violation Viewer State
    const [showViolationModal, setShowViolationModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);

    // Rating Modal State
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratingFormData, setRatingFormData] = useState({
        hygiene_score: '',
        hygiene_status: 'Pending',
        memo: '',
        fine_amount: ''
    });

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchHotels();
        fetchReports();

        // Refresh stats every 2 seconds
        const interval = setInterval(() => {
            fetchHotels();
            fetchReports();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const fetchHotels = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/admin/hotels', config);
            setHotels(res.data);
            setStats(prev => ({
                ...prev,
                totalHotels: res.data.length,
                pendingApprovals: res.data.filter(h => h.is_verified === 0).length,
                totalViolations: res.data.reduce((sum, h) => sum + (h.violation_count || 0), 0)
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchReports = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/admin/reports', config);
            setReports(res.data);
            setStats(prev => ({ ...prev, activeReports: res.data.length }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(`http://localhost:5001/api/admin/hotels/${id}/approve`, {}, config);
            fetchHotels();
        } catch (err) {
            alert('Error approving hotel');
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(`http://localhost:5001/api/admin/hotels/${id}/reject`, {}, config);
            fetchHotels();
        } catch (err) {
            alert('Error rejecting hotel');
        }
    };

    const handleViewViolations = (hotel) => {
        setSelectedHotel(hotel);
        setShowViolationModal(true);
    };

    const handleOpenRatingModal = (hotel) => {
        setSelectedHotel(hotel);
        setRatingFormData({
            hygiene_score: hotel.hygiene_score || '',
            hygiene_status: hotel.hygiene_status || 'Pending',
            memo: hotel.memo || '',
            fine_amount: hotel.fine_amount || ''
        });
        setShowRatingModal(true);
    };

    const handleRatingFormChange = (e) => {
        const { name, value } = e.target;
        setRatingFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitRating = async () => {
        try {
            await axios.put(
                `http://localhost:5001/api/admin/hotels/${selectedHotel.id}/rating`,
                ratingFormData,
                config
            );
            setShowRatingModal(false);
            fetchHotels();
            alert('Rating updated successfully!');
        } catch (err) {
            alert('Error updating rating: ' + (err.response?.data?.message || err.message));
        }
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
                <div className="animate-fadeInUp">
                    <div className="d-flex align-items-center gap-3 mb-2">
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                        }}>
                            <i className="fas fa-user-shield fa-2x" style={{ color: 'white' }}></i>
                        </div>
                        <div>
                            <h2 className="mb-0 display-5 fw-bold" style={{
                                color: 'var(--gray-900)',
                                letterSpacing: '-0.02em'
                            }}>
                                Admin Dashboard
                            </h2>
                        </div>
                    </div>
                    <p className="mb-4 ms-5 ps-3" style={{ color: 'var(--gray-600)', fontSize: '1.05rem' }}>
                        Manage hotels, monitor violations, and review guest reports
                    </p>
                </div>

                {/* Stats Cards */}
                <Row className="g-4 mb-5">
                    <Col md={3} className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <div
                            style={{
                                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)',
                                borderRadius: '20px',
                                padding: '1.5rem',
                                border: '2px solid rgba(59, 130, 246, 0.2)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                height: '100%'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="mb-1" style={{ color: 'var(--gray-600)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Hotels</p>
                                    <h3 className="mb-0 fw-bold" style={{
                                        background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontSize: '2.5rem'
                                    }}>{stats.totalHotels}</h3>
                                </div>
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                                }}>
                                    <i className="fas fa-hotel fa-2x" style={{ color: 'white' }}></i>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={3} className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        <div
                            style={{
                                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
                                borderRadius: '20px',
                                padding: '1.5rem',
                                border: '2px solid rgba(245, 158, 11, 0.2)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                height: '100%'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 15px 35px rgba(245, 158, 11, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="mb-1" style={{ color: 'var(--gray-600)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Approvals</p>
                                    <h3 className="mb-0 fw-bold" style={{ color: '#f59e0b', fontSize: '2.5rem' }}>{stats.pendingApprovals}</h3>
                                </div>
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
                                }}>
                                    <i className="fas fa-clock fa-2x" style={{ color: 'white' }}></i>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={3} className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                        <div
                            style={{
                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                                borderRadius: '20px',
                                padding: '1.5rem',
                                border: '2px solid rgba(239, 68, 68, 0.2)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                height: '100%'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 15px 35px rgba(239, 68, 68, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="mb-1" style={{ color: 'var(--gray-600)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Violations</p>
                                    <h3 className="mb-0 fw-bold" style={{ color: '#ef4444', fontSize: '2.5rem' }}>{stats.totalViolations}</h3>
                                </div>
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)'
                                }}>
                                    <i className="fas fa-exclamation-triangle fa-2x" style={{ color: 'white' }}></i>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={3} className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                        <div
                            style={{
                                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(13, 148, 136, 0.1) 100%)',
                                borderRadius: '20px',
                                padding: '1.5rem',
                                border: '2px solid rgba(20, 184, 166, 0.2)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                height: '100%'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 15px 35px rgba(20, 184, 166, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="mb-1" style={{ color: 'var(--gray-600)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Guest Reports</p>
                                    <h3 className="mb-0 fw-bold" style={{
                                        background: 'linear-gradient(135deg, var(--accent-600), var(--accent-700))',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontSize: '2.5rem'
                                    }}>{stats.activeReports}</h3>
                                </div>
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    background: 'linear-gradient(135deg, var(--accent-600), var(--accent-700))',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 10px 25px rgba(20, 184, 166, 0.3)'
                                }}>
                                    <i className="fas fa-flag fa-2x" style={{ color: 'white' }}></i>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Tabs defaultActiveKey="hotels" className="mb-4">
                    <Tab eventKey="hotels" title={<span><i className="fas fa-hotel me-2"></i>Hotel Management</span>}>
                        <GlassCard>
                            <div className="table-responsive">
                                <Table hover className="mb-0">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Status</th>
                                            <th>Hygiene</th>
                                            <th>Violations</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hotels.map(hotel => (
                                            <tr key={hotel.id}>
                                                <td><strong>#{hotel.id}</strong></td>
                                                <td>{hotel.hotel_name}</td>
                                                <td>{hotel.email}</td>
                                                <td>
                                                    <Badge bg={hotel.is_verified === 1 ? 'success' : hotel.is_verified === 2 ? 'danger' : 'warning'}>
                                                        {hotel.is_verified === 1 ? 'Verified' : hotel.is_verified === 2 ? 'Rejected' : 'Pending'}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Badge bg={hotel.hygiene_status === 'Clean' ? 'success' : 'warning'}>
                                                        {hotel.hygiene_status || 'N/A'}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <strong>{hotel.violation_count || 0}</strong>
                                                        {hotel.violation_count > 0 && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline-danger"
                                                                className="rounded-circle"
                                                                style={{ width: '32px', height: '32px', padding: 0 }}
                                                                onClick={() => handleViewViolations(hotel)}
                                                                title="View Snapshots"
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    {hotel.is_verified === 0 ? (
                                                        <div className="d-flex gap-2">
                                                            <Button size="sm" variant="success" onClick={() => handleApprove(hotel.id)}>
                                                                <i className="fas fa-check me-1"></i>Approve
                                                            </Button>
                                                            <Button size="sm" variant="danger" onClick={() => handleReject(hotel.id)}>
                                                                <i className="fas fa-times me-1"></i>Reject
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline-primary"
                                                                onClick={() => handleViewViolations(hotel)}
                                                            >
                                                                <i className="fas fa-video me-1"></i>Monitor
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline-warning"
                                                                onClick={() => handleOpenRatingModal(hotel)}
                                                            >
                                                                <i className="fas fa-star me-1"></i>Rating
                                                            </Button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </GlassCard>
                    </Tab>

                    <Tab eventKey="reports" title={<span><i className="fas fa-flag me-2"></i>Guest Reports</span>}>
                        <GlassCard>
                            {reports.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-inbox fa-3x mb-3" style={{ color: 'var(--gray-400)' }}></i>
                                    <p style={{ color: 'var(--gray-600)' }}>No guest reports yet</p>
                                </div>
                            ) : (
                                reports.map(report => (
                                    <div key={report.id} className="mb-4 p-4" style={{
                                        background: 'white',
                                        borderRadius: '12px',
                                        border: '1px solid var(--gray-200)',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 style={{ color: 'var(--gray-900)' }}>
                                                    <i className="fas fa-hotel me-2" style={{ color: 'var(--primary-600)' }}></i>
                                                    {report.hotel_name_input}
                                                </h5>
                                                <small style={{ color: 'var(--gray-500)' }}>
                                                    <i className="fas fa-clock me-1"></i>
                                                    {new Date(report.submitted_at || report.createdAt).toLocaleString()}
                                                </small>
                                            </div>
                                            <Badge bg={
                                                report.status === 'Action Taken' ? 'success' :
                                                    report.status === 'Rejected' ? 'danger' : 'warning'
                                            }>{report.status}</Badge>
                                        </div>
                                        <p style={{ color: 'var(--gray-700)' }}>{report.description}</p>

                                        {/* AI Analysis Tags */}
                                        {report.ai_analysis && report.ai_analysis.length > 0 && (
                                            <div className="mb-3 p-3 text-start" style={{ background: '#fef2f2', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
                                                <h6 className="fw-bold text-danger mb-2"><i className="fas fa-robot me-2"></i>AI Detected Violations:</h6>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {report.ai_analysis.map((violation, idx) => (
                                                        <Badge key={idx} bg="danger" className="p-2">
                                                            {violation.type || violation.class}
                                                            <span className="opacity-75 ms-1">({Math.round((violation.confidence || 0) * 100)}%)</span>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {report.google_maps_link && (
                                            <a href={report.google_maps_link} target="_blank" rel="noreferrer"
                                                className="d-inline-block mb-3"
                                                style={{ color: 'var(--primary-600)', textDecoration: 'none', fontWeight: '600' }}>
                                                <i className="fas fa-map-marker-alt me-2"></i>
                                                View Location
                                            </a>
                                        )}
                                        {report.media_url && (
                                            <div className="mb-3">
                                                {report.media_type === 'image' ? (
                                                    <img src={`http://localhost:5001${report.media_url}`}
                                                        alt="Proof"
                                                        style={{ maxWidth: '300px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }} />
                                                ) : (
                                                    <video src={`http://localhost:5001${report.media_url}`}
                                                        controls
                                                        style={{ maxWidth: '300px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }} />
                                                )}
                                            </div>
                                        )}

                                        {/* Admin Actions */}
                                        {report.status === 'Pending' && (
                                            <div className="d-flex gap-2 mt-3 pt-3 border-top">
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    onClick={async () => {
                                                        try {
                                                            const res = await axios.put(`http://localhost:5001/api/admin/reports/${report.id}/action`, { status: 'Action Taken' }, config);
                                                            await fetchReports();
                                                            await fetchHotels(); // Refresh stats

                                                            if (res.data.hotelLinked) {
                                                                alert('✅ Report validated! Stats updated for ' + report.hotel_name_input);
                                                            } else {
                                                                alert('⚠️ Report marked as Action Taken, BUT hotel name "' + report.hotel_name_input + '" was not found in registered hotels. Stats were NOT updated.');
                                                            }
                                                        } catch (e) { alert('Error updating report'); }
                                                    }}
                                                >
                                                    <i className="fas fa-check-circle me-1"></i> Confirm Violation
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={async () => {
                                                        try {
                                                            await axios.put(`http://localhost:5001/api/admin/reports/${report.id}/action`, { status: 'Rejected' }, config);
                                                            fetchReports();
                                                        } catch (e) { alert('Error updating report'); }
                                                    }}
                                                >
                                                    <i className="fas fa-times-circle me-1"></i> Reject Report
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </GlassCard>
                    </Tab>

                    <Tab eventKey="achievements" title={<span><i className="fas fa-trophy me-2"></i>Achievements</span>}>
                        <AchievementManager />
                    </Tab>
                </Tabs>

                <ViolationViewer
                    show={showViolationModal}
                    onHide={() => setShowViolationModal(false)}
                    hotelId={selectedHotel?.id}
                    hotelName={selectedHotel?.hotel_name}
                />

                {/* Rating Update Modal */}
                <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)} size="lg" centered>
                    <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))', color: 'white', border: 'none' }}>
                        <Modal.Title>
                            <i className="fas fa-star me-2"></i>
                            Update Hygiene Rating - {selectedHotel?.hotel_name}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '2rem' }}>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ fontWeight: '600', color: 'var(--gray-700)' }}>
                                            <i className="fas fa-chart-line me-2"></i>Hygiene Score (0-100)
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="hygiene_score"
                                            value={ratingFormData.hygiene_score}
                                            onChange={handleRatingFormChange}
                                            min="0"
                                            max="100"
                                            placeholder="Enter score"
                                            style={{ borderRadius: '8px', padding: '0.75rem' }}
                                        />
                                        <Form.Text className="text-muted">
                                            Official hygiene score (0 = Poor, 100 = Excellent)
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ fontWeight: '600', color: 'var(--gray-700)' }}>
                                            <i className="fas fa-clipboard-check me-2"></i>Hygiene Status
                                        </Form.Label>
                                        <Form.Select
                                            name="hygiene_status"
                                            value={ratingFormData.hygiene_status}
                                            onChange={handleRatingFormChange}
                                            style={{ borderRadius: '8px', padding: '0.75rem' }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Clean">Clean</option>
                                            <option value="Moderately Clean">Moderately Clean</option>
                                            <option value="Dirty">Dirty</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ fontWeight: '600', color: 'var(--gray-700)' }}>
                                            <i className="fas fa-sticky-note me-2"></i>Admin Memo
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="memo"
                                            value={ratingFormData.memo}
                                            onChange={handleRatingFormChange}
                                            placeholder="Enter notes, recommendations, or observations..."
                                            style={{ borderRadius: '8px', padding: '0.75rem' }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ fontWeight: '600', color: 'var(--gray-700)' }}>
                                            <i className="fas fa-dollar-sign me-2"></i>Fine Amount
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="fine_amount"
                                            value={ratingFormData.fine_amount}
                                            onChange={handleRatingFormChange}
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            style={{ borderRadius: '8px', padding: '0.75rem' }}
                                        />
                                        <Form.Text className="text-muted">
                                            Total fines imposed (in currency)
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer style={{ border: 'none', padding: '1.5rem' }}>
                        <Button variant="secondary" onClick={() => setShowRatingModal(false)} style={{ borderRadius: '8px', padding: '0.5rem 1.5rem' }}>
                            <i className="fas fa-times me-2"></i>Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitRating}
                            style={{
                                background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.5rem 1.5rem',
                                fontWeight: '600'
                            }}
                        >
                            <i className="fas fa-save me-2"></i>Update Rating
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};

export default AdminDashboard;
