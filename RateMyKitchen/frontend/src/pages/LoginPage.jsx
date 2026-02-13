import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CursorTrail from '../components/CursorTrail';
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
            <CursorTrail />
            <Navbar />

            {/* Animated Background */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                overflow: 'hidden'
            }}>
                {/* Gradient Bubbles */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent 70%)',
                    filter: 'blur(60px)',
                    animation: 'float 20s ease-in-out infinite'
                }}></div>

                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(20, 184, 166, 0.25), transparent 70%)',
                    filter: 'blur(60px)',
                    animation: 'float 15s ease-in-out infinite reverse'
                }}></div>

                <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent 70%)',
                    filter: 'blur(50px)',
                    animation: 'float 18s ease-in-out infinite'
                }}></div>
            </div>

            <Container style={{
                marginTop: '100px',
                paddingTop: '40px',
                paddingBottom: '60px',
                minHeight: '100vh'
            }}>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <div className="animate-fadeInUp">
                            <div className="text-center mb-4">
                                <div style={{
                                    width: '90px',
                                    height: '90px',
                                    margin: '0 auto 1.5rem',
                                    borderRadius: '24px',
                                    background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(20, 184, 166, 0.2)',
                                    animation: 'pulse 3s ease-in-out infinite',
                                    position: 'relative'
                                }}>
                                    <i className="fas fa-sign-in-alt fa-2x" style={{ color: 'white' }}></i>

                                    {/* Glow ring */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: '-4px',
                                        borderRadius: '26px',
                                        background: 'linear-gradient(135deg, var(--primary-400), var(--accent-400))',
                                        opacity: 0.3,
                                        filter: 'blur(10px)',
                                        animation: 'pulse 3s ease-in-out infinite'
                                    }}></div>
                                </div>
                                <h2 className="fw-bold mb-2" style={{
                                    color: 'var(--gray-900)',
                                    fontSize: '2rem',
                                    letterSpacing: '-0.02em'
                                }}>Welcome Back</h2>
                                <p style={{
                                    color: 'var(--gray-600)',
                                    fontSize: '1.05rem'
                                }}>Sign in to access your dashboard</p>
                            </div>

                            <GlassCard>
                                <Tabs
                                    activeKey={role}
                                    onSelect={(k) => setRole(k)}
                                    className="mb-4 custom-tabs"
                                    justify
                                >
                                    <Tab
                                        eventKey="hotel"
                                        title={
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                padding: '0.5rem 1rem',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                <i className="fas fa-hotel"></i>
                                                Hotel
                                            </span>
                                        }
                                    />
                                    <Tab
                                        eventKey="admin"
                                        title={
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                padding: '0.5rem 1rem',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                <i className="fas fa-user-shield"></i>
                                                Admin
                                            </span>
                                        }
                                    />
                                </Tabs>

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{
                                            fontWeight: '600',
                                            color: 'var(--gray-700)',
                                            marginBottom: '0.5rem'
                                        }}>Email Address</Form.Label>
                                        <div style={{ position: 'relative' }}>
                                            <i className="fas fa-envelope" style={{
                                                position: 'absolute',
                                                left: '16px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: 'var(--gray-400)',
                                                zIndex: 1
                                            }}></i>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                style={{
                                                    paddingLeft: '45px',
                                                    height: '50px',
                                                    borderRadius: '12px',
                                                    border: '2px solid var(--gray-200)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = 'var(--primary-500)';
                                                    e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'var(--gray-200)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label style={{
                                            fontWeight: '600',
                                            color: 'var(--gray-700)',
                                            marginBottom: '0.5rem'
                                        }}>Password</Form.Label>
                                        <div style={{ position: 'relative' }}>
                                            <i className="fas fa-lock" style={{
                                                position: 'absolute',
                                                left: '16px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: 'var(--gray-400)',
                                                zIndex: 1
                                            }}></i>
                                            <Form.Control
                                                type="password"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                style={{
                                                    paddingLeft: '45px',
                                                    height: '50px',
                                                    borderRadius: '12px',
                                                    border: '2px solid var(--gray-200)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = 'var(--primary-500)';
                                                    e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'var(--gray-200)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        className="w-100"
                                        style={{
                                            height: '52px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))',
                                            border: 'none',
                                            fontWeight: '600',
                                            fontSize: '1.05rem',
                                            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
                                        }}
                                    >
                                        <i className="fas fa-sign-in-alt me-2"></i>
                                        Sign In
                                    </Button>
                                </Form>

                                {role === 'hotel' && (
                                    <div className="text-center mt-4">
                                        <p style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
                                            Don't have an account?{' '}
                                            <a href="/register-hotel" style={{
                                                color: 'var(--primary-600)',
                                                textDecoration: 'none',
                                                fontWeight: '600',
                                                transition: 'all 0.2s ease'
                                            }}
                                                onMouseEnter={(e) => e.target.style.color = 'var(--primary-700)'}
                                                onMouseLeave={(e) => e.target.style.color = 'var(--primary-600)'}
                                            >
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
