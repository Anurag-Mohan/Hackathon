import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
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
            const res = await axios.get('http://localhost:5000/api/hotel/profile', config);
            setHotel(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchViolations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/hotel/violations', config);
            setViolations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Navbar />
            <Container className="py-5" style={{ paddingTop: '100px' }}>
                <Row className="mb-4">
                    <Col md={12}>
                        <GlassCard>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h2>{hotel.hotel_name}</h2>
                                    <p className="mb-0">{hotel.address} | {hotel.contact}</p>
                                </div>
                                <div className="text-end">
                                    <h4>Hygiene Grade</h4>
                                    <Badge bg={hotel.hygiene_status === 'Clean' ? 'success' : 'warning'} className="fs-5">
                                        {hotel.hygiene_status || 'Pending'}
                                    </Badge>
                                </div>
                            </div>
                        </GlassCard>
                    </Col>
                </Row>

                <Row>
                    <Col md={8}>
                        <h4 className="mb-3">Recent Violations</h4>
                        <GlassCard>
                            {violations.length === 0 ? (
                                <p className="text-center text-muted">No violations detected. Keep it up!</p>
                            ) : (
                                violations.map(v => (
                                    <div key={v.id} className="d-flex align-items-center border-bottom border-secondary py-3">
                                        <div className="flex-shrink-0">
                                            <img src={`http://localhost:5000${v.snapshot_url}`} alt="Violation" width="100" height="80" className="rounded object-fit-cover" />
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h5 className="mb-1 text-danger">{v.violation_type}</h5>
                                            <small className="text-muted">{new Date(v.detected_at).toLocaleString()}</small>
                                            <Badge bg="danger" className="ms-2">{v.severity}</Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </GlassCard>
                    </Col>
                    <Col md={4}>
                        <h4 className="mb-3">AI Monitoring Status</h4>
                        <GlassCard className="text-center">
                            <div className="display-1 text-primary mb-3">
                                <i className="fas fa-video"></i>
                            </div>
                            <h5>System Active</h5>
                            <p className="text-white-50">Your kitchen is currently being monitored by the AI system.</p>
                        </GlassCard>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default HotelDashboard;
