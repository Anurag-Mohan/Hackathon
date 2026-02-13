import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import axios from 'axios';

const ReportPage = () => {
    const [formData, setFormData] = useState({
        hotel_name_input: '',
        description: '',
        google_maps_link: ''
    });
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

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
        data.append('description', formData.description);
        data.append('google_maps_link', formData.google_maps_link);
        data.append('media', file);

        try {
            await axios.post('http://localhost:5001/api/guest/report', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage('Report submitted successfully! Thank you for your contribution.');
            setMessageType('success');
            setFormData({ hotel_name_input: '', description: '', google_maps_link: '' });
            setFile(null);
        } catch (err) {
            setMessage('Failed to submit report. Please try again.');
            setMessageType('danger');
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
                                    background: 'linear-gradient(135deg, var(--danger), #dc2626)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'var(--shadow-xl)'
                                }}>
                                    <i className="fas fa-flag fa-2x" style={{ color: 'white' }}></i>
                                </div>
                                <h2 className="fw-bold mb-2" style={{ color: 'var(--gray-900)' }}>Report a Violation</h2>
                                <p style={{ color: 'var(--gray-600)' }}>
                                    Help us maintain food safety standards by reporting hygiene violations
                                </p>
                            </div>

                            {message && (
                                <Alert variant={messageType} className="animate-fadeIn">
                                    <i className={`fas fa-${messageType === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
                                    {message}
                                </Alert>
                            )}

                            <GlassCard>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Hotel Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="hotel_name_input"
                                            placeholder="Enter the hotel name"
                                            value={formData.hotel_name_input}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="description"
                                            placeholder="Describe the hygiene violation in detail..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <i className="fas fa-map-marker-alt me-2" style={{ color: 'var(--primary-600)' }}></i>
                                            Google Maps Link (Optional)
                                        </Form.Label>
                                        <Form.Control
                                            type="url"
                                            name="google_maps_link"
                                            placeholder="Paste Google Maps link of the location"
                                            value={formData.google_maps_link}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>
                                            <i className="fas fa-camera me-2" style={{ color: 'var(--primary-600)' }}></i>
                                            Upload Evidence (Photo/Video)
                                        </Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={handleFileChange}
                                            required
                                        />
                                        <Form.Text style={{ color: 'var(--gray-500)' }}>
                                            Accepted formats: JPG, PNG, MP4, MOV (Max 10MB)
                                        </Form.Text>
                                    </Form.Group>

                                    <Button type="submit" className="w-100 btn-danger">
                                        <i className="fas fa-paper-plane me-2"></i>
                                        Submit Report
                                    </Button>
                                </Form>

                                <div className="mt-4 p-3" style={{
                                    background: 'var(--primary-50)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--primary-200)'
                                }}>
                                    <p className="mb-0" style={{ color: 'var(--gray-700)', fontSize: '0.875rem' }}>
                                        <i className="fas fa-info-circle me-2" style={{ color: 'var(--primary-600)' }}></i>
                                        Your report will be reviewed by our admin team. All submissions are confidential.
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

export default ReportPage;
