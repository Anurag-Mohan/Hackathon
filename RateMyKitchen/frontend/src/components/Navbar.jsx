import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <Navbar expand="lg" variant="dark" className="glass-nav fixed-top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
                    <i className="fas fa-utensils me-2"></i>RateMyKitchen
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>

                        {!token ? (
                            <>
                                <Nav.Link as={Link} to="/register-hotel">Register Hotel</Nav.Link>
                                <Button as={Link} to="/login" variant="outline-light" className="ms-2 rounded-pill">
                                    Login
                                </Button>
                            </>
                        ) : (
                            <>
                                {user.role === 'admin' && (
                                    <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link>
                                )}
                                {user.role === 'hotel' && (
                                    <Nav.Link as={Link} to="/hotel">My Kitchen</Nav.Link>
                                )}
                                <Button onClick={handleLogout} variant="outline-danger" className="ms-2 rounded-pill">
                                    Logout
                                </Button>
                            </>
                        )}

                        <Button as={Link} to="/report" className="btn-primary-custom ms-3">
                            Report Violation
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
