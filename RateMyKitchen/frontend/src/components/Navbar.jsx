import React from 'react';
import { Navbar as BSNavbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <BSNavbar expand="lg" fixed="top" className="navbar">
            <Container>
                <BSNavbar.Brand as={Link} to="/" className="navbar-brand">
                    <i className="fas fa-utensils me-2"></i>
                    RateMyKitchen
                </BSNavbar.Brand>
                <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BSNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {!isLoggedIn ? (
                            <>
                                <Nav.Link as={Link} to="/" className="nav-link">
                                    <i className="fas fa-home me-2"></i>Home
                                </Nav.Link>
                                <Nav.Link as={Link} to="/report" className="nav-link">
                                    <i className="fas fa-flag me-2"></i>Report
                                </Nav.Link>
                                <Nav.Link as={Link} to="/login" className="nav-link">
                                    <i className="fas fa-sign-in-alt me-2"></i>Login
                                </Nav.Link>
                                <Link to="/register-hotel">
                                    <Button variant="primary" size="sm" className="ms-2">
                                        <i className="fas fa-user-plus me-2"></i>Register
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to={user.role === 'admin' ? '/admin' : '/hotel'} className="nav-link">
                                    <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                                </Nav.Link>
                                <div className="d-flex align-items-center ms-3">
                                    <div className="me-3" style={{
                                        padding: '0.5rem 1rem',
                                        background: 'var(--primary-50)',
                                        borderRadius: '8px',
                                        border: '1px solid var(--primary-200)'
                                    }}>
                                        <i className={`fas fa-${user.role === 'admin' ? 'user-shield' : 'hotel'} me-2`}
                                            style={{ color: 'var(--primary-600)' }}></i>
                                        <span style={{ color: 'var(--gray-800)', fontWeight: '600' }}>{user.name}</span>
                                    </div>
                                    <Button variant="outline-primary" size="sm" onClick={handleLogout}>
                                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                                    </Button>
                                </div>
                            </>
                        )}
                    </Nav>
                </BSNavbar.Collapse>
            </Container>
        </BSNavbar>
    );
};

export default Navbar;
