import React, { useState, useEffect } from 'react';
import { Navbar as BSNavbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import HotelSearchModal from './HotelSearchModal';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isLoggedIn = !!localStorage.getItem('token');
    const [scrolled, setScrolled] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <>
            <BSNavbar
                expand="lg"
                fixed="top"
                style={{
                    background: 'transparent',
                    padding: '1rem 0',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <Container>
                    <div style={{
                        width: '100%',
                        background: scrolled
                            ? 'rgba(255, 255, 255, 0.75)'
                            : 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        borderRadius: '60px',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: scrolled
                            ? '0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                            : '0 4px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                        padding: '0.75rem 1.5rem',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap'
                    }}>
                        <BSNavbar.Brand
                            as={Link}
                            to="/"
                            style={{
                                fontWeight: '700',
                                fontSize: '1.3rem',
                                background: 'linear-gradient(135deg, var(--primary-600), var(--accent-500))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'transform 0.3s ease',
                                cursor: 'pointer',
                                margin: 0
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <i className="fas fa-utensils" style={{
                                background: 'linear-gradient(135deg, var(--primary-600), var(--accent-500))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}></i>
                            RateMyKitchen
                        </BSNavbar.Brand>

                        <BSNavbar.Toggle aria-controls="basic-navbar-nav" style={{
                            border: 'none',
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '12px',
                            padding: '0.5rem 0.75rem'
                        }} />

                        <BSNavbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto align-items-center" style={{ gap: '0.75rem' }}>
                                <Button
                                    onClick={() => setShowSearchModal(true)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '50px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        border: '1px solid rgba(59, 130, 246, 0.2)',
                                        color: 'var(--primary-600)',
                                        fontWeight: '600',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        fontSize: '0.9rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <i className="fas fa-search"></i> Search Hotels
                                </Button>

                                {!isLoggedIn ? (
                                    <>
                                        <Nav.Link
                                            as={Link}
                                            to="/"
                                            style={{
                                                padding: '0.5rem 1rem',
                                                color: 'var(--gray-700)',
                                                fontWeight: '500',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                borderRadius: '12px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                                                e.currentTarget.style.color = 'var(--primary-600)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = 'var(--gray-700)';
                                            }}
                                        >
                                            <i className="fas fa-home"></i>Home
                                        </Nav.Link>
                                        <Nav.Link
                                            as={Link}
                                            to="/report"
                                            style={{
                                                padding: '0.5rem 1rem',
                                                color: 'var(--gray-700)',
                                                fontWeight: '500',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                borderRadius: '12px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                                                e.currentTarget.style.color = 'var(--primary-600)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = 'var(--gray-700)';
                                            }}
                                        >
                                            <i className="fas fa-flag"></i>Report
                                        </Nav.Link>
                                        <Nav.Link
                                            as={Link}
                                            to="/login"
                                            style={{
                                                padding: '0.5rem 1rem',
                                                color: 'var(--gray-700)',
                                                fontWeight: '500',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                borderRadius: '12px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                                                e.currentTarget.style.color = 'var(--primary-600)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = 'var(--gray-700)';
                                            }}
                                        >
                                            <i className="fas fa-sign-in-alt"></i>Login
                                        </Nav.Link>
                                        <Link to="/register-hotel" style={{ textDecoration: 'none' }}>
                                            <Button
                                                style={{
                                                    padding: '0.5rem 1.25rem',
                                                    borderRadius: '50px',
                                                    background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))',
                                                    border: 'none',
                                                    color: 'white',
                                                    fontWeight: '600',
                                                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    fontSize: '0.9rem'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                                                }}
                                            >
                                                <i className="fas fa-user-plus"></i>Register
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Nav.Link
                                            as={Link}
                                            to={user.role === 'admin' ? '/admin' : '/hotel'}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                color: 'var(--gray-700)',
                                                fontWeight: '500',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                borderRadius: '12px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                                                e.currentTarget.style.color = 'var(--primary-600)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = 'var(--gray-700)';
                                            }}
                                        >
                                            <i className="fas fa-tachometer-alt"></i>Dashboard
                                        </Nav.Link>
                                        <div style={{
                                            padding: '0.4rem 1rem',
                                            background: 'rgba(59, 130, 246, 0.08)',
                                            borderRadius: '50px',
                                            border: '1px solid rgba(59, 130, 246, 0.15)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <i className={`fas fa-${user.role === 'admin' ? 'user-shield' : 'hotel'}`}
                                                style={{ color: 'var(--primary-600)', fontSize: '0.9rem' }}></i>
                                            <span style={{ color: 'var(--gray-800)', fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</span>
                                        </div>
                                        <Button
                                            onClick={handleLogout}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                borderRadius: '50px',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                color: 'var(--red-600)',
                                                fontWeight: '600',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                fontSize: '0.9rem'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            <i className="fas fa-sign-out-alt"></i>Logout
                                        </Button>
                                    </>
                                )}
                            </Nav>
                        </BSNavbar.Collapse>
                    </div>
                </Container>
            </BSNavbar>
            <HotelSearchModal show={showSearchModal} onHide={() => setShowSearchModal(false)} />
        </>
    );
};

export default Navbar;
