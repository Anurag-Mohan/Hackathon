import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import axios from 'axios';

const ReportPage = () => {
    const [formData, setFormData] = useState({
        hotel_name_input: '',
        google_maps_link: '',
        description: ''
    });
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('hotel_name_input', formData.hotel_name_input);
        data.append('google_maps_link', formData.google_maps_link);
        data.append('description', formData.description);
        data.append('media', file);

        try {
            await axios.post('http://localhost:5000/api/guest/report', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage('Report submitted successfully! Thank you for your contribution.');
            setFormData({ hotel_name_input: '', google_maps_link: '', description: '' });
            setFile(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed');
        }
    };

    return (
        <>
            <Navbar />
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', paddingTop: '80px' }}>
                <Row className="w-100 justify-content-center">
                    <Col md={8}>
                        <GlassCard>
                            <h2 className="text-center mb-4 text-primary">Report a Violation</h2>
                            <p className="text-center text-white-50 mb-4">Helper keep kitchens clean. Upload photos or videos anonymously.</p>

                            {message && <Alert variant="success">{message}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Hotel Name (Approx)</Form.Label>
                                            <Form.Control type="text" name="hotel_name_input" className="form-control-glass" onChange={handleChange} value={formData.hotel_name_input} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Google Maps Link</Form.Label>
                                            <Form.Control type="url" name="google_maps_link" className="form-control-glass" onChange={handleChange} value={formData.google_maps_link} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description of Issue</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="description" className="form-control-glass" onChange={handleChange} value={formData.description} />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Upload Evidence (Image/Video)</Form.Label>
                                    <Form.Control type="file" className="form-control-glass" onChange={handleFileChange} required />
                                </Form.Group>

                                <Button type="submit" className="w-100 btn-primary-custom">
                                    Submit Report
                                </Button>
                            </Form>
                        </GlassCard>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ReportPage;
