import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Badge, Tab, Tabs, Card } from 'react-bootstrap';
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

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchHotels();
        fetchReports();
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

    return (
        <>
            <Navbar />
            <Container className="py-5" style={{ paddingTop: '100px' }}>
                <div className="animate-fadeInUp">
                    <h2 className="mb-2 display-5 fw-bold" style={{ color: 'var(--gray-900)' }}>
                        Admin Dashboard
                    </h2>
                    <p className="mb-4" style={{ color: 'var(--gray-600)' }}>
                        Manage hotels, monitor violations, and review guest reports
                    </p>
                </div>

                {/* Stats Cards */}
                <Row className="g-4 mb-4">
                    <Col md={3} className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <Card className="glass-card border-0 h-100">
                            <Card.Body>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <p className="mb-1" style={{ color: 'var(--gray-600)', fontSize: '0.875rem', fontWeight: '600' }}>Total Hotels</p>
                                        <h3 className="mb-0 fw-bold text-gradient">{stats.totalHotels}</h3>
                                    </div>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className="fas fa-hotel fa-2x" style={{ color: 'white' }}></i>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        <Card className="glass-card border-0 h-100">
                            <Card.Body>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <p className="mb-1" style={{ color: 'var(--gray-600)', fontSize: '0.875rem', fontWeight: '600' }}>Pending Approvals</p>
                                        <h3 className="mb-0 fw-bold" style={{ color: 'var(--warning)' }}>{stats.pendingApprovals}</h3>
                                    </div>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: 'linear-gradient(135deg, var(--warning), #d97706)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className="fas fa-clock fa-2x" style={{ color: 'white' }}></i>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                        <Card className="glass-card border-0 h-100">
                            <Card.Body>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <p className="mb-1" style={{ color: 'var(--gray-600)', fontSize: '0.875rem', fontWeight: '600' }}>Total Violations</p>
                                        <h3 className="mb-0 fw-bold" style={{ color: 'var(--danger)' }}>{stats.totalViolations}</h3>
                                    </div>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: 'linear-gradient(135deg, var(--danger), #dc2626)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className="fas fa-exclamation-triangle fa-2x" style={{ color: 'white' }}></i>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                        <Card className="glass-card border-0 h-100">
                            <Card.Body>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <p className="mb-1" style={{ color: 'var(--gray-600)', fontSize: '0.875rem', fontWeight: '600' }}>Guest Reports</p>
                                        <h3 className="mb-0 fw-bold text-gradient">{stats.activeReports}</h3>
                                    </div>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: 'linear-gradient(135deg, var(--accent-500), var(--accent-700))',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className="fas fa-flag fa-2x" style={{ color: 'white' }}></i>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
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
                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            onClick={() => handleViewViolations(hotel)}
                                                        >
                                                            <i className="fas fa-video me-1"></i>Monitor
                                                        </Button>
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
                                                    {new Date(report.createdAt).toLocaleString()}
                                                </small>
                                            </div>
                                            <Badge bg="info">{report.status}</Badge>
                                        </div>
                                        <p style={{ color: 'var(--gray-700)' }}>{report.description}</p>
                                        {report.google_maps_link && (
                                            <a href={report.google_maps_link} target="_blank" rel="noreferrer"
                                                className="d-inline-block mb-3"
                                                style={{ color: 'var(--primary-600)', textDecoration: 'none', fontWeight: '600' }}>
                                                <i className="fas fa-map-marker-alt me-2"></i>
                                                View Location
                                            </a>
                                        )}
                                        {report.media_url && (
                                            <div>
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
            </Container>
        </>
    );
};

export default AdminDashboard;
