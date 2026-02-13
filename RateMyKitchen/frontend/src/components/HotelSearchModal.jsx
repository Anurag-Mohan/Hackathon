import React, { useState } from 'react';
import { Modal, Form, InputGroup, Button, Badge, Card, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const HotelSearchModal = ({ show, onHide }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [hotelDetails, setHotelDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    // Debounced Search Effect
    React.useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim().length >= 2) {
                handleSearch();
            } else if (searchQuery.trim().length === 0) {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearch = async () => {
        if (searchQuery.trim().length < 2) return;

        setSearching(true);
        try {
            const res = await axios.get(`http://localhost:5001/api/guest/search?query=${searchQuery}`);
            setSearchResults(res.data);
            // Don't clear selection on real-time update unless query changes drastically (handled by effect)
        } catch (err) {
            console.error(err);
        } finally {
            setSearching(false);
        }
    };

    const handleSelectHotel = async (hotel) => {
        setSelectedHotel(hotel);
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5001/api/guest/hotels/${hotel.id}`);
            setHotelDetails(res.data);
        } catch (err) {
            console.error(err);
            alert('Error loading hotel details');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (!score) return 'var(--gray-400)';
        if (score >= 80) return 'var(--success)';
        if (score >= 60) return 'var(--warning)';
        return 'var(--danger)';
    };

    const getGradeLetter = (score) => {
        if (!score) return 'N/A';
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    };

    const handleClose = () => {
        setSearchQuery('');
        setSearchResults([]);
        setSelectedHotel(null);
        setHotelDetails(null);
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))', color: 'white', border: 'none' }}>
                <Modal.Title>
                    <i className="fas fa-search me-2"></i>
                    Search Hotels
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: '2rem', maxHeight: '70vh', overflowY: 'auto' }}>
                {/* Search Input */}
                <InputGroup className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder="Enter hotel name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ borderRadius: '8px 0 0 8px', padding: '0.75rem' }}
                    />
                    <Button
                        onClick={handleSearch}
                        disabled={searching}
                        style={{
                            background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))',
                            border: 'none',
                            borderRadius: '0 8px 8px 0',
                            padding: '0.75rem 1.5rem'
                        }}
                    >
                        {searching ? <Spinner animation="border" size="sm" /> : <i className="fas fa-search"></i>}
                    </Button>
                </InputGroup>

                {/* Search Results */}
                {!selectedHotel && searchResults.length > 0 && (
                    <div>
                        <h6 className="mb-3" style={{ color: 'var(--gray-700)' }}>
                            Found {searchResults.length} hotel(s)
                        </h6>
                        <div className="d-flex flex-column gap-2">
                            {searchResults.map(hotel => (
                                <Card
                                    key={hotel.id}
                                    style={{
                                        cursor: 'pointer',
                                        border: '1px solid var(--gray-200)',
                                        borderRadius: '12px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                                    onClick={() => handleSelectHotel(hotel)}
                                >
                                    <Card.Body className="p-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1" style={{ color: 'var(--gray-900)' }}>
                                                    {hotel.hotel_name}
                                                </h6>
                                                <small style={{ color: 'var(--gray-600)' }}>
                                                    <i className="fas fa-map-marker-alt me-1"></i>{hotel.address}
                                                </small>
                                            </div>
                                            <div className="text-end">
                                                <div style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '50%',
                                                    background: hotel.hygiene_score
                                                        ? `conic-gradient(${getScoreColor(hotel.hygiene_score)} ${hotel.hygiene_score}%, var(--gray-200) 0)`
                                                        : 'var(--gray-200)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        background: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 'bold',
                                                        color: getScoreColor(hotel.hygiene_score)
                                                    }}>
                                                        {getGradeLetter(hotel.hygiene_score)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hotel Details */}
                {selectedHotel && (
                    <div>
                        <Button
                            variant="link"
                            onClick={() => { setSelectedHotel(null); setHotelDetails(null); }}
                            className="mb-3 p-0"
                            style={{ color: 'var(--primary-600)' }}
                        >
                            <i className="fas fa-arrow-left me-2"></i>Back to results
                        </Button>

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : hotelDetails && (
                            <div>
                                {/* Hotel Info */}
                                <Card className="mb-3" style={{ border: '2px solid var(--primary-200)', borderRadius: '16px' }}>
                                    <Card.Body className="p-4">
                                        <h4 className="mb-3" style={{ color: 'var(--gray-900)' }}>
                                            {hotelDetails.hotel.hotel_name}
                                        </h4>
                                        <p className="mb-2" style={{ color: 'var(--gray-600)' }}>
                                            <i className="fas fa-map-marker-alt me-2"></i>{hotelDetails.hotel.address}
                                        </p>
                                        <p className="mb-3" style={{ color: 'var(--gray-600)' }}>
                                            <i className="fas fa-phone me-2"></i>{hotelDetails.hotel.contact}
                                        </p>

                                        <div className="d-flex gap-4 mb-3">
                                            <div>
                                                <small style={{ color: 'var(--gray-600)' }}>Hygiene Score</small>
                                                <h3 className="mb-0" style={{ color: getScoreColor(hotelDetails.hotel.hygiene_score) }}>
                                                    {hotelDetails.hotel.hygiene_score || 'N/A'}
                                                    <small style={{ fontSize: '1rem', marginLeft: '0.5rem' }}>
                                                        ({getGradeLetter(hotelDetails.hotel.hygiene_score)})
                                                    </small>
                                                </h3>
                                            </div>
                                            <div>
                                                <small style={{ color: 'var(--gray-600)' }}>Status</small>
                                                <div>
                                                    <Badge bg={hotelDetails.hotel.hygiene_status === 'Clean' ? 'success' : hotelDetails.hotel.hygiene_status === 'Moderately Clean' ? 'warning' : hotelDetails.hotel.hygiene_status === 'Dirty' ? 'danger' : 'secondary'}>
                                                        {hotelDetails.hotel.hygiene_status || 'Pending'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div>
                                                <small style={{ color: 'var(--gray-600)' }}>Violations</small>
                                                <h3 className="mb-0" style={{ color: 'var(--danger)' }}>
                                                    {hotelDetails.hotel.violation_count || 0}
                                                </h3>
                                            </div>
                                        </div>

                                        {hotelDetails.hotel.last_inspection_date && (
                                            <small style={{ color: 'var(--gray-600)' }}>
                                                <i className="fas fa-calendar-check me-2"></i>
                                                Last Inspection: {new Date(hotelDetails.hotel.last_inspection_date).toLocaleDateString()}
                                            </small>
                                        )}
                                    </Card.Body>
                                </Card>

                                {/* Violations */}
                                <h6 className="mb-3" style={{ color: 'var(--gray-900)' }}>
                                    <i className="fas fa-exclamation-triangle me-2" style={{ color: 'var(--danger)' }}></i>
                                    Recent Violations ({hotelDetails.violations.length})
                                </h6>

                                {hotelDetails.violations.length === 0 ? (
                                    <Alert variant="success" style={{ borderRadius: '12px' }}>
                                        <i className="fas fa-check-circle me-2"></i>
                                        No violations detected! This hotel maintains excellent hygiene standards.
                                    </Alert>
                                ) : (
                                    <div className="d-flex flex-column gap-3">
                                        {hotelDetails.violations.map(violation => (
                                            <Card key={violation.id} style={{ border: '1px solid var(--gray-200)', borderRadius: '12px' }}>
                                                <Card.Body className="p-3">
                                                    <div className="d-flex gap-3">
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                src={`http://localhost:5001${violation.snapshot_url}`}
                                                                alt="Violation"
                                                                style={{
                                                                    width: '100px',
                                                                    height: '75px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '8px'
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <h6 className="mb-1" style={{ color: 'var(--danger)' }}>
                                                                {violation.violation_type}
                                                            </h6>
                                                            <small style={{ color: 'var(--gray-600)' }}>
                                                                <i className="fas fa-clock me-1"></i>
                                                                {new Date(violation.detected_at).toLocaleString()}
                                                            </small>
                                                            <div className="mt-2">
                                                                <Badge bg={violation.severity === 'High' ? 'danger' : violation.severity === 'Medium' ? 'warning' : 'info'}>
                                                                    {violation.severity}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* No Results */}
                {!selectedHotel && searchResults.length === 0 && searchQuery && !searching && (
                    <Alert variant="info" style={{ borderRadius: '12px' }}>
                        <i className="fas fa-info-circle me-2"></i>
                        No hotels found. Try a different search term.
                    </Alert>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default HotelSearchModal;
