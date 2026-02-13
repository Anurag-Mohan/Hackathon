import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import axios from 'axios';

const LoginPage = () => {
    const [role, setRole] = useState('hotel');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/auth/login', { email, password, role });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/hotel');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <>
            <Navbar />
            <Container className="py-5" style={{ paddingTop: '120px', minHeight: '100vh' }}>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <div className="animate-fadeInUp">
                            <div className="text-center mb-4">
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    margin: '0 auto 1.5rem',
                                    borderRadius: '20px',
                                    background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'var(--shadow-xl)'
                                }}>
                                    <i className="fas fa-sign-in-alt fa-2x" style={{ color: 'white' }}></i>
                                </div>
                                <h2 className="fw-bold mb-2" style={{ color: 'var(--gray-900)' }}>Welcome Back</h2>
                                <p style={{ color: 'var(--gray-600)' }}>Sign in to access your dashboard</p>
                            </div>

                            <GlassCard>
                                <Tabs
                                    activeKey={role}
                                    onSelect={(k) => setRole(k)}
                                    className="mb-4"
                                    justify
                                >
                                    <Tab eventKey="hotel" title={<span><i className="fas fa-hotel me-2"></i>Hotel</span>} />
                                    <Tab eventKey="admin" title={<span><i className="fas fa-user-shield me-2"></i>Admin</span>} />
                                </Tabs>

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Button type="submit" className="w-100 btn-primary">
                                        <i className="fas fa-sign-in-alt me-2"></i>
                                        Sign In
                                    </Button>
                                </Form>

                                {role === 'hotel' && (
                                    <div className="text-center mt-4">
                                        <p style={{ color: 'var(--gray-600)' }}>
                                            Don't have an account?{' '}
                                            <a href="/register-hotel" style={{
                                                color: 'var(--primary-600)',
                                                textDecoration: 'none',
                                                fontWeight: '600'
                                            }}>
                                                Register here
                                            </a>
                                        </p>
                                    </div>
                                )}
                            </GlassCard>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default LoginPage;
