import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('hotel'); // 'hotel' or 'admin'
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user)); // Store role and name

            if (role === 'admin') navigate('/admin');
            else navigate('/hotel');

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <>
            <Navbar />
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', paddingTop: '80px' }}>
                <Row className="w-100 justify-content-center">
                    <Col md={5}>
                        <GlassCard>
                            <h2 className="text-center mb-4">Welcome Back</h2>
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Tabs
                                activeKey={role}
                                onSelect={(k) => setRole(k)}
                                className="mb-4 custom-tabs"
                                justify
                            >
                                <Tab eventKey="hotel" title="Hotel Login">
                                </Tab>
                                <Tab eventKey="admin" title="Admin Login">
                                </Tab>
                            </Tabs>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        className="form-control-glass"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        className="form-control-glass"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button type="submit" className="w-100 btn-primary-custom mt-3">
                                    Login as {role === 'admin' ? 'Admin' : 'Hotel'}
                                </Button>
                            </Form>
                        </GlassCard>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default LoginPage;
