import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CursorTrail from '../components/CursorTrail';
import GlassCard from '../components/GlassCard';
import axios from 'axios';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        hotel_name: '',
        email: '',
        password: '',
        address: '',
        contact: ''
    });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [validFields, setValidFields] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Password strength calculation
        if (name === 'password') {
            let strength = 0;
            if (value.length >= 8) strength++;
            if (/[A-Z]/.test(value)) strength++;
            if (/[0-9]/.test(value)) strength++;
            if (/[^A-Za-z0-9]/.test(value)) strength++;
            setPasswordStrength(strength);
        }

        // Field validation
        if (value.trim()) {
            setValidFields(prev => ({ ...prev, [name]: true }));
        } else {
            setValidFields(prev => ({ ...prev, [name]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/auth/register-hotel', formData);
            alert('Registration successful! Please wait for admin approval.');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || 'Registration failed');
        }
    };

    const getStrengthColor = () => {
        if (passwordStrength <= 1) return '#ef4444';
        if (passwordStrength === 2) return '#f59e0b';
        if (passwordStrength === 3) return '#10b981';
        return '#059669';
    };

    const getStrengthText = () => {
        if (passwordStrength === 0) return 'Very Weak';
        if (passwordStrength === 1) return 'Weak';
        if (passwordStrength === 2) return 'Fair';
        if (passwordStrength === 3) return 'Good';
        return 'Strong';
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
                <div style={{
                    position: 'absolute',
                    top: '5%',
                    right: '15%',
                    width: '450px',
                    height: '450px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent 70%)',
                    filter: 'blur(60px)',
                    animation: 'float 18s ease-in-out infinite'
                }}></div>

                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    left: '10%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(20, 184, 166, 0.25), transparent 70%)',
                    filter: 'blur(60px)',
                    animation: 'float 22s ease-in-out infinite reverse'
                }}></div>

                <div style={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    width: '350px',
                    height: '350px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent 70%)',
                    filter: 'blur(50px)',
                    animation: 'float 20s ease-in-out infinite'
                }}></div>
            </div>

            <Container style={{
                marginTop: '100px',
                paddingTop: '40px',
                paddingBottom: '60px',
                minHeight: '100vh'
            }}>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
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
                                    <i className="fas fa-hotel fa-2x" style={{ color: 'white' }}></i>

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
                                }}>Register Your Hotel</h2>
                                <p style={{
                                    color: 'var(--gray-600)',
                                    fontSize: '1.05rem'
                                }}>Join our AI-powered hygiene monitoring platform</p>
                            </div>

                            <GlassCard>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{
                                            fontWeight: '600',
                                            color: 'var(--gray-700)',
                                            marginBottom: '0.5rem'
                                        }}>Hotel Name</Form.Label>
                                        <div style={{ position: 'relative' }}>
                                            <i className="fas fa-building" style={{
                                                position: 'absolute',
                                                left: '16px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: 'var(--gray-400)',
                                                zIndex: 1
                                            }}></i>
                                            {validFields.hotel_name && (
                                                <i className="fas fa-check-circle" style={{
                                                    position: 'absolute',
                                                    right: '16px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: 'var(--success)',
                                                    zIndex: 1
                                                }}></i>
                                            )}
                                            <Form.Control
                                                type="text"
                                                name="hotel_name"
                                                placeholder="Enter hotel name"
                                                value={formData.hotel_name}
                                                onChange={handleChange}
                                                required
                                                style={{
                                                    paddingLeft: '45px',
                                                    paddingRight: validFields.hotel_name ? '45px' : '16px',
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
                                            {validFields.email && (
                                                <i className="fas fa-check-circle" style={{
                                                    position: 'absolute',
                                                    right: '16px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: 'var(--success)',
                                                    zIndex: 1
                                                }}></i>
                                            )}
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder="Enter email address"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                style={{
                                                    paddingLeft: '45px',
                                                    paddingRight: validFields.email ? '45px' : '16px',
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

                                    <Form.Group className="mb-3">
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
                                                name="password"
                                                placeholder="Create a strong password"
                                                value={formData.password}
                                                onChange={handleChange}
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
                                        {formData.password && (
                                            <div className="mt-2">
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '4px',
                                                    marginBottom: '6px'
                                                }}>
                                                    {[1, 2, 3, 4].map((level) => (
                                                        <div
                                                            key={level}
                                                            style={{
                                                                flex: 1,
                                                                height: '4px',
                                                                borderRadius: '2px',
                                                                background: passwordStrength >= level ? getStrengthColor() : 'var(--gray-200)',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                        ></div>
                                                    ))}
                                                </div>
                                                <p style={{
                                                    fontSize: '0.85rem',
                                                    color: getStrengthColor(),
                                                    fontWeight: '600',
                                                    margin: 0
                                                }}>
                                                    {getStrengthText()}
                                                </p>
                                            </div>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label style={{
                                            fontWeight: '600',
                                            color: 'var(--gray-700)',
                                            marginBottom: '0.5rem'
                                        }}>Address</Form.Label>
                                        <div style={{ position: 'relative' }}>
                                            <i className="fas fa-map-marker-alt" style={{
                                                position: 'absolute',
                                                left: '16px',
                                                top: '20px',
                                                color: 'var(--gray-400)',
                                                zIndex: 1
                                            }}></i>
                                            {validFields.address && (
                                                <i className="fas fa-check-circle" style={{
                                                    position: 'absolute',
                                                    right: '16px',
                                                    top: '20px',
                                                    color: 'var(--success)',
                                                    zIndex: 1
                                                }}></i>
                                            )}
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                name="address"
                                                placeholder="Enter complete address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                                style={{
                                                    paddingLeft: '45px',
                                                    paddingRight: validFields.address ? '45px' : '16px',
                                                    paddingTop: '14px',
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
                                        }}>Contact Number</Form.Label>
                                        <div style={{ position: 'relative' }}>
                                            <i className="fas fa-phone" style={{
                                                position: 'absolute',
                                                left: '16px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: 'var(--gray-400)',
                                                zIndex: 1
                                            }}></i>
                                            {validFields.contact && (
                                                <i className="fas fa-check-circle" style={{
                                                    position: 'absolute',
                                                    right: '16px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: 'var(--success)',
                                                    zIndex: 1
                                                }}></i>
                                            )}
                                            <Form.Control
                                                type="tel"
                                                name="contact"
                                                placeholder="Enter contact number"
                                                value={formData.contact}
                                                onChange={handleChange}
                                                required
                                                style={{
                                                    paddingLeft: '45px',
                                                    paddingRight: validFields.contact ? '45px' : '16px',
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
                                            transition: 'all 0.3s ease'
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
                                        <i className="fas fa-check-circle me-2"></i>
                                        Register Hotel
                                    </Button>
                                </Form>

                                <div className="text-center mt-4">
                                    <p style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
                                        Already have an account?{' '}
                                        <a href="/login" style={{
                                            color: 'var(--primary-600)',
                                            textDecoration: 'none',
                                            fontWeight: '600',
                                            transition: 'all 0.2s ease'
                                        }}
                                            onMouseEnter={(e) => e.target.style.color = 'var(--primary-700)'}
                                            onMouseLeave={(e) => e.target.style.color = 'var(--primary-600)'}
                                        >
                                            Sign in here
                                        </a>
                                    </p>
                                </div>
                            </GlassCard>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default RegisterPage;
