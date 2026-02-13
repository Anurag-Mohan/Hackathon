import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        hotel_name: '',
        email: '',
        password: '',
        contact: '',
        address: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register-hotel', formData);
            alert('Registration successful! Please wait for admin approval.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <>
            <Navbar />
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', paddingTop: '80px' }}>
                <Row className="w-100 justify-content-center">
                    <Col md={6}>
                        <GlassCard>
                            <h2 className="text-center mb-4">Register Your Hotel</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Hotel Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="hotel_name"
                                        className="form-control-glass"
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        className="form-control-glass"
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        className="form-control-glass"
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contact Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contact"
                                        className="form-control-glass"
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="address"
                                        className="form-control-glass"
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Button type="submit" className="w-100 btn-primary-custom mt-3">
                                    Submit for Approval
                                </Button>
                            </Form>
                        </GlassCard>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default RegisterPage;
