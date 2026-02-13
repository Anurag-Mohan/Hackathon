import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';

const LandingPage = () => {
    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', paddingTop: '80px' }}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} className="text-white">
                            <h1 className="display-3 fw-bold mb-4">
                                Experience <span style={{ color: 'var(--primary)' }}>Pure Hygiene</span>
                            </h1>
                            <p className="lead mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                RateMyKitchen uses advanced AI to ensure the hotels you dine at meet the highest hygiene standards.
                                Transparency like never before.
                            </p>
                            <div className="d-flex gap-3">
                                <Button as={Link} to="/register-hotel" className="btn-primary-custom btn-lg">
                                    Register Hotel
                                </Button>
                                <Button as={Link} to="/report" variant="outline-light" className="btn-lg rounded-pill">
                                    Report Violation
                                </Button>
                            </div>
                        </Col>
                        <Col lg={6} className="mt-5 mt-lg-0 text-center">
                            <div className="floating-element">
                                <GlassCard className="p-4 d-inline-block text-start">
                                    <h4 className="mb-3"><i className="fas fa-robot me-2"></i>AI Surveillance</h4>
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="bg-success rounded-circle p-1 me-2" style={{ width: '10px', height: '10px' }}></div>
                                        <small>Monitoring Kitchen #12A</small>
                                    </div>
                                    <div className="bg-dark rounded p-2 mb-2" style={{ width: '300px', height: '180px', opacity: 0.6 }}>
                                        {/* Placeholder for camera feed graphic */}
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                                            LIVE FEED SIMULATION
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <small className="text-success"><i className="fas fa-check-circle me-1"></i>No Violations</small>
                                        <small className="text-muted">Updated 2s ago</small>
                                    </div>
                                </GlassCard>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Features Section */}
            <Container className="py-5">
                <Row className="g-4">
                    <Col md={4}>
                        <GlassCard className="h-100 text-center">
                            <i className="fas fa-video fa-3x mb-3 text-primary"></i>
                            <h3>24/7 Monitoring</h3>
                            <p className="text-white-50">Our AI never sleeps. Continuous monitoring of kitchen hygiene using advanced computer vision.</p>
                        </GlassCard>
                    </Col>
                    <Col md={4}>
                        <GlassCard className="h-100 text-center">
                            <i className="fas fa-file-contract fa-3x mb-3 text-primary"></i>
                            <h3>Instant Reports</h3>
                            <p className="text-white-50">Violations are detected instantly and reported to both hotel management and admins.</p>
                        </GlassCard>
                    </Col>
                    <Col md={4}>
                        <GlassCard className="h-100 text-center">
                            <i className="fas fa-users fa-3x mb-3 text-primary"></i>
                            <h3>Public Trust</h3>
                            <p className="text-white-50">Guests can report issues directly, ensuring a community-driven approach to safety.</p>
                        </GlassCard>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default LandingPage;
