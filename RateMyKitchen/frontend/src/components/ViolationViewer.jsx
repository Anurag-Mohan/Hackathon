import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Card, Badge, Spinner, Button, Alert, Tab, Tabs, Form } from 'react-bootstrap';
import axios from 'axios';

const ViolationViewer = ({ show, onHide, hotelId, hotelName }) => {
    const [violations, setViolations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('violations');

    // Action States
    const [fineAmount, setFineAmount] = useState('');
    const [fineReason, setFineReason] = useState('');
    const [memoMessage, setMemoMessage] = useState('');
    const [actionStatus, setActionStatus] = useState(null);



    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        if (show && hotelId) {
            fetchViolations();
            // Reset states on open
            setActionStatus(null);
            setFineAmount('');
            setFineReason('');
            setMemoMessage('');
            setActiveTab('violations');
        }
    }, [show, hotelId]);

    const fetchViolations = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`http://localhost:5001/api/admin/hotels/${hotelId}/violations`, config);
            setViolations(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load violations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleIssueFine = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/admin/fine', {
                hotel_id: hotelId,
                amount: fineAmount,
                reason: fineReason
            }, config);
            setActionStatus({ type: 'success', message: 'Fine issued successfully!' });
            setFineAmount('');
            setFineReason('');
        } catch (err) {
            setActionStatus({ type: 'danger', message: 'Failed to issue fine.' });
        }
    };

    const handleSendMemo = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/admin/memo', {
                hotel_id: hotelId,
                message: memoMessage
            }, config);
            setActionStatus({ type: 'success', message: 'Memo sent successfully!' });
            setMemoMessage('');
        } catch (err) {
            setActionStatus({ type: 'danger', message: 'Failed to send memo.' });
        }
    };



    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                <Modal.Title style={{ color: 'var(--gray-900)', fontWeight: '700' }}>
                    <i className="fas fa-building text-primary me-2"></i>
                    {hotelName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: '#f8fafc', minHeight: '500px' }}>
                <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4 custom-tabs">

                    {/* Violations Tab */}
                    <Tab eventKey="violations" title={<span><i className="fas fa-exclamation-triangle me-2"></i>Violations</span>}>
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2 text-muted">Loading snapshots...</p>
                            </div>
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : violations.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fas fa-check-circle fa-4x text-success mb-3"></i>
                                <p className="text-muted fw-bold">No violations detected!</p>
                            </div>
                        ) : (
                            <Row xs={1} md={2} className="g-4">
                                {violations.map((violation) => (
                                    <Col key={violation.id}>
                                        <Card className="h-100 shadow-sm border-0 overflow-hidden">
                                            <div style={{ position: 'relative', height: '200px', background: '#000' }}>
                                                <img
                                                    src={`http://localhost:5001${violation.snapshot_url}`}
                                                    alt={violation.violation_type}
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Snapshot+Error'; }}
                                                />
                                                <Badge
                                                    bg={violation.severity === 'High' ? 'danger' : violation.severity === 'Medium' ? 'warning' : 'info'}
                                                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                                                >
                                                    {violation.severity}
                                                </Badge>
                                            </div>
                                            <Card.Body>
                                                <h6 className="fw-bold mb-1">{violation.violation_type}</h6>
                                                <small className="text-muted d-block mb-2">
                                                    <i className="fas fa-clock me-1"></i>
                                                    {new Date(violation.detected_at).toLocaleString()}
                                                </small>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Tab>

                    {/* Actions Tab */}
                    <Tab eventKey="actions" title={<span><i className="fas fa-gavel me-2"></i>Actions</span>}>
                        {actionStatus && (
                            <Alert variant={actionStatus.type} onClose={() => setActionStatus(null)} dismissible>
                                {actionStatus.message}
                            </Alert>
                        )}
                        <Row>
                            <Col md={6}>
                                <Card className="border-0 shadow-sm h-100">
                                    <Card.Header className="bg-white fw-bold text-danger">
                                        <i className="fas fa-file-invoice-dollar me-2"></i>Issue Fine
                                    </Card.Header>
                                    <Card.Body>
                                        <Form onSubmit={handleIssueFine}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Amount ($)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={fineAmount}
                                                    onChange={(e) => setFineAmount(e.target.value)}
                                                    required
                                                    placeholder="e.g. 500"
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Reason</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={fineReason}
                                                    onChange={(e) => setFineReason(e.target.value)}
                                                    required
                                                    placeholder="Violation of hygiene protocols..."
                                                />
                                            </Form.Group>
                                            <Button variant="danger" type="submit" className="w-100">
                                                Issue Fine
                                            </Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="border-0 shadow-sm h-100">
                                    <Card.Header className="bg-white fw-bold text-warning">
                                        <i className="fas fa-comment-alt me-2"></i>Send Memo
                                    </Card.Header>
                                    <Card.Body>
                                        <Form onSubmit={handleSendMemo}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Message</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={5}
                                                    value={memoMessage}
                                                    onChange={(e) => setMemoMessage(e.target.value)}
                                                    required
                                                    placeholder="Warning notice regarding..."
                                                />
                                            </Form.Group>
                                            <Button variant="warning" type="submit" className="w-100 text-white">
                                                Send Memo
                                            </Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab>



                </Tabs>
            </Modal.Body>
            <Modal.Footer style={{ background: 'var(--gray-50)', borderTop: '1px solid var(--gray-200)' }}>
                <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViolationViewer;
