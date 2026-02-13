import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Modal, Badge } from 'react-bootstrap';
import axios from 'axios';

const AchievementManager = () => {
    const [achievements, setAchievements] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        year: new Date().getFullYear()
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/admin/achievements', config);
            setAchievements(res.data);
        } catch (err) {
            console.error('Error fetching achievements:', err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            setMessage({ type: 'danger', text: 'Please select an image' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('year', formData.year);
            formDataToSend.append('image', imageFile);

            await axios.post('http://localhost:5001/api/admin/achievements/upload', formDataToSend, {
                headers: {
                    ...config.headers,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage({ type: 'success', text: 'Achievement uploaded successfully!' });
            setFormData({ title: '', description: '', year: new Date().getFullYear() });
            setImageFile(null);
            setImagePreview(null);
            fetchAchievements();
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.error || 'Error uploading achievement' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5001/api/admin/achievements/${deleteId}`, config);
            setMessage({ type: 'success', text: 'Achievement deleted successfully!' });
            fetchAchievements();
            setShowDeleteModal(false);
        } catch (err) {
            setMessage({ type: 'danger', text: 'Error deleting achievement' });
        }
    };

    return (
        <div>
            <h3 className="mb-4 fw-bold" style={{ color: 'var(--gray-900)' }}>
                <i className="fas fa-trophy me-2" style={{ color: 'var(--primary-600)' }}></i>
                Achievement Management
            </h3>

            {message.text && (
                <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
                    {message.text}
                </Alert>
            )}

            {/* Upload Form */}
            <Card className="glass-card border-0 mb-4">
                <Card.Body>
                    <h5 className="mb-3 fw-bold">Upload New Achievement</h5>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., National Health Award"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Year</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        required
                                        min="2000"
                                        max="2100"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                placeholder="Describe the achievement..."
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Achievement Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                            />
                            <Form.Text className="text-muted">
                                Max size: 5MB. Supported formats: JPG, PNG, GIF, WEBP
                            </Form.Text>
                        </Form.Group>

                        {imagePreview && (
                            <div className="mb-3">
                                <p className="mb-2 fw-bold">Preview:</p>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '300px',
                                        maxHeight: '200px',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-upload me-2"></i>
                                    Upload Achievement
                                </>
                            )}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {/* Achievements Gallery */}
            <Card className="glass-card border-0">
                <Card.Body>
                    <h5 className="mb-3 fw-bold">Current Achievements ({achievements.length})</h5>
                    <Row className="g-3">
                        {achievements.map((achievement) => (
                            <Col md={4} key={achievement.id}>
                                <Card className="h-100 border-0" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                    <Card.Img
                                        variant="top"
                                        src={`http://localhost:5001${achievement.image_path}`}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                        }}
                                    />
                                    <Card.Body>
                                        <Card.Title className="fw-bold" style={{ fontSize: '1rem' }}>
                                            {achievement.title}
                                        </Card.Title>
                                        <Card.Text style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                                            {achievement.description}
                                        </Card.Text>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <Badge bg="primary">{achievement.year}</Badge>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => {
                                                    setDeleteId(achievement.id);
                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    {achievements.length === 0 && (
                        <div className="text-center py-5 text-muted">
                            <i className="fas fa-trophy fa-3x mb-3" style={{ opacity: 0.3 }}></i>
                            <p>No achievements uploaded yet.</p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this achievement? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AchievementManager;
