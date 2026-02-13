import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

    return (
        <>
            <Navbar />
            <Container className="py-5" style={{ paddingTop: '120px', minHeight: '100vh' }}>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
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
                                    <i className="fas fa-hotel fa-2x" style={{ color: 'white' }}></i>
                                </div>
                                <h2 className="fw-bold mb-2" style={{ color: 'var(--gray-900)' }}>Register Your Hotel</h2>
                                <p style={{ color: 'var(--gray-600)' }}>Join our AI-powered hygiene monitoring platform</p>
                            </div>

                            <GlassCard>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Hotel Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="hotel_name"
                                            placeholder="Enter hotel name"
                                            value={formData.hotel_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="Enter email address"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Create a strong password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="address"
                                            placeholder="Enter complete address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Contact Number</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="contact"
                                            placeholder="Enter contact number"
                                            value={formData.contact}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Button type="submit" className="w-100 btn-primary">
                                        <i className="fas fa-check-circle me-2"></i>
                                        Register Hotel
                                    </Button>
                                </Form>

                                <div className="text-center mt-4">
                                    <p style={{ color: 'var(--gray-600)' }}>
                                        Already have an account?{' '}
                                        <a href="/login" style={{
                                            color: 'var(--primary-600)',
                                            textDecoration: 'none',
                                            fontWeight: '600'
                                        }}>
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
