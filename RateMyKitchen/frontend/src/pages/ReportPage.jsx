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
    const [filePreview, setFilePreview] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (selectedFile) => {
        setFile(selectedFile);

        // Create preview
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileChange(droppedFile);
        }
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
            setFilePreview(null);
        } catch (err) {
            setMessage('Failed to submit report. Please try again.');
            setMessageType('danger');
        }
    };

    return (
        <>

            <Navbar />

            {/* Animated Background - Red/Orange Theme */}
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
                    top: '10%',
                    left: '15%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.2), transparent 70%)',
                    filter: 'blur(60px)',
                    animation: 'float 20s ease-in-out infinite'
                }}></div>

                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: '450px',
                    height: '450px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2), transparent 70%)',
                    filter: 'blur(60px)',
                    animation: 'float 18s ease-in-out infinite reverse'
                }}></div>

                <div style={{
                    position: 'absolute',
                    top: '45%',
                    right: '25%',
                    width: '350px',
                    height: '350px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(220, 38, 38, 0.15), transparent 70%)',
                    filter: 'blur(50px)',
                    animation: 'float 22s ease-in-out infinite'
                }}></div>
            </div>

            <Container style={{
                marginTop: '100px',
                paddingTop: '40px',
                paddingBottom: '60px',
                minHeight: '100vh'
            }}>
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        <div className="animate-fadeInUp">
                            <div className="text-center mb-4">
                                <div style={{
                                    width: '90px',
                                    height: '90px',
                                    margin: '0 auto 1.5rem',
                                    borderRadius: '24px',
                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3), 0 0 60px rgba(220, 38, 38, 0.2)',
                                    animation: 'pulse 3s ease-in-out infinite',
                                    position: 'relative'
                                }}>
                                    <i className="fas fa-flag fa-2x" style={{ color: 'white' }}></i>

                                    <div style={{
                                        position: 'absolute',
                                        inset: '-4px',
                                        borderRadius: '26px',
                                        background: 'linear-gradient(135deg, #f87171, #ef4444)',
                                        opacity: 0.3,
                                        filter: 'blur(10px)',
                                        animation: 'pulse 3s ease-in-out infinite'
                                    }}></div>
                                </div>
                                <h2 className="fw-bold mb-2" style={{
                                    color: 'var(--gray-900)',
                                    fontSize: '2rem',
                                    letterSpacing: '-0.02em'
                                }}>Report a Violation</h2>
                                <p style={{
                                    color: 'var(--gray-600)',
                                    fontSize: '1.05rem'
                                }}>Help us maintain food safety standards by reporting hygiene violations</p>
                            </div>

                            {message && (
                                <Alert
                                    variant={messageType}
                                    className="animate-fadeIn"
                                    style={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <i className={`fas fa-${messageType === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
                                    {message}
                                </Alert>
                            )}

                            <GlassCard>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
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
                                                    <Form.Control
                                                        type="text"
                                                        name="hotel_name_input"
                                                        placeholder="Enter the hotel name"
                                                        value={formData.hotel_name_input}
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
                                                            e.target.style.borderColor = '#ef4444';
                                                            e.target.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.1)';
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
                                                }}>
                                                    <i className="fas fa-map-marker-alt me-2" style={{ color: '#ef4444' }}></i>
                                                    Google Maps Link (Optional)
                                                </Form.Label>
                                                <div style={{ position: 'relative' }}>
                                                    <i className="fas fa-link" style={{
                                                        position: 'absolute',
                                                        left: '16px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: 'var(--gray-400)',
                                                        zIndex: 1
                                                    }}></i>
                                                    <Form.Control
                                                        type="text"
                                                        name="google_maps_link"
                                                        placeholder="Paste Google Maps link"
                                                        value={formData.google_maps_link}
                                                        onChange={handleChange}
                                                        onBlur={(e) => {
                                                            // Auto-fix URL on blur
                                                            let val = e.target.value.trim();
                                                            if (val && !val.startsWith('http')) {
                                                                setFormData(prev => ({ ...prev, google_maps_link: `https://${val}` }));
                                                            }
                                                            // Restore border style
                                                            e.target.style.borderColor = 'var(--gray-200)';
                                                            e.target.style.boxShadow = 'none';
                                                        }}
                                                    />
                                                </div>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{
                                                    fontWeight: '600',
                                                    color: 'var(--gray-700)',
                                                    marginBottom: '0.5rem'
                                                }}>Description</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={5}
                                                    name="description"
                                                    placeholder="Describe the hygiene violation in detail..."
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    required
                                                    style={{
                                                        paddingLeft: '16px',
                                                        paddingTop: '14px',
                                                        borderRadius: '12px',
                                                        border: '2px solid var(--gray-200)',
                                                        transition: 'all 0.3s ease',
                                                        resize: 'none'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = '#ef4444';
                                                        e.target.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = 'var(--gray-200)';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-4">
                                        <Form.Label style={{
                                            fontWeight: '600',
                                            color: 'var(--gray-700)',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <i className="fas fa-camera me-2" style={{ color: '#ef4444' }}></i>
                                            Upload Evidence (Photo/Video)
                                        </Form.Label>

                                        {/* Drag and Drop Zone */}
                                        <div
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            style={{
                                                border: `2px dashed ${isDragging ? '#ef4444' : 'var(--gray-300)'}`,
                                                borderRadius: '16px',
                                                padding: '2rem',
                                                textAlign: 'center',
                                                background: isDragging ? 'rgba(239, 68, 68, 0.05)' : 'var(--gray-50)',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                position: 'relative'
                                            }}
                                            onClick={() => document.getElementById('fileInput').click()}
                                        >
                                            {filePreview ? (
                                                <div>
                                                    {file.type.startsWith('image/') ? (
                                                        <img
                                                            src={filePreview}
                                                            alt="Preview"
                                                            style={{
                                                                maxWidth: '100%',
                                                                maxHeight: '200px',
                                                                borderRadius: '12px',
                                                                marginBottom: '1rem'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div style={{
                                                            padding: '2rem',
                                                            background: 'white',
                                                            borderRadius: '12px',
                                                            marginBottom: '1rem'
                                                        }}>
                                                            <i className="fas fa-video fa-3x" style={{ color: '#ef4444' }}></i>
                                                        </div>
                                                    )}
                                                    <p style={{
                                                        color: 'var(--gray-700)',
                                                        fontWeight: '600',
                                                        marginBottom: '0.5rem'
                                                    }}>{file.name}</p>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setFile(null);
                                                            setFilePreview(null);
                                                        }}
                                                    >
                                                        <i className="fas fa-times me-1"></i>
                                                        Remove
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        margin: '0 auto 1rem',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        animation: isDragging ? 'pulse 1s ease-in-out infinite' : 'none'
                                                    }}>
                                                        <i className="fas fa-cloud-upload-alt fa-2x" style={{ color: 'white' }}></i>
                                                    </div>
                                                    <h5 style={{ color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                                                        {isDragging ? 'Drop file here' : 'Drag & drop your file here'}
                                                    </h5>
                                                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                                                        or click to browse
                                                    </p>
                                                    <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                                        Accepted: JPG, PNG, MP4, MOV (Max 10MB)
                                                    </p>
                                                </>
                                            )}
                                            <input
                                                id="fileInput"
                                                type="file"
                                                accept="image/*,video/*"
                                                onChange={(e) => handleFileChange(e.target.files[0])}
                                                style={{ display: 'none' }}
                                                required={!file}
                                            />
                                        </div>
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        className="w-100"
                                        style={{
                                            height: '52px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                            border: 'none',
                                            fontWeight: '600',
                                            fontSize: '1.05rem',
                                            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 15px 35px rgba(239, 68, 68, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(239, 68, 68, 0.3)';
                                        }}
                                    >
                                        <i className="fas fa-paper-plane me-2"></i>
                                        Submit Report
                                    </Button>
                                </Form>

                                <div className="mt-4 p-3" style={{
                                    background: 'rgba(239, 68, 68, 0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(239, 68, 68, 0.2)'
                                }}>
                                    <p className="mb-0" style={{ color: 'var(--gray-700)', fontSize: '0.875rem' }}>
                                        <i className="fas fa-info-circle me-2" style={{ color: '#ef4444' }}></i>
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
