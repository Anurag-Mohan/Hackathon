import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';

const LandingPage = () => {
    const [scrollY, setScrollY] = useState(0);
    const [revealedPhotos, setRevealedPhotos] = useState([false, false, false]);
    const photoRefs = [React.useRef(null), React.useRef(null), React.useRef(null)];
    const [achievements, setAchievements] = useState([]);
    const [stats, setStats] = useState({
        totalHotels: 0,
        totalViolations: 0,
        detectionAccuracy: '0%',
        activeMonitoring: 0
    });
    const [loading, setLoading] = useState(true);

    // Fetch achievements and stats from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [achievementsRes, statsRes] = await Promise.all([
                    fetch('http://localhost:5001/api/stats/achievements/latest'),
                    fetch('http://localhost:5001/api/stats/summary')
                ]);

                const achievementsData = await achievementsRes.json();
                const statsData = await statsRes.json();

                setAchievements(achievementsData);
                setStats(statsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Use fallback data if API fails
                setAchievements([
                    { title: 'Grade A Certification', description: 'Awarded for exceptional hygiene standards', icon: 'certificate' },
                    { title: 'Excellence Award 2024', description: 'Best kitchen hygiene practices', icon: 'trophy' },
                    { title: '100% Compliance', description: 'Perfect health inspection record', icon: 'award' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observers = photoRefs.map((ref, idx) => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
                            setRevealedPhotos(prev => {
                                const newState = [...prev];
                                newState[idx] = true;
                                return newState;
                            });
                        }
                    });
                },
                { threshold: [0.2] }
            );

            if (ref.current) {
                observer.observe(ref.current);
            }

            return observer;
        });

        return () => {
            observers.forEach((observer, idx) => {
                if (photoRefs[idx].current) {
                    observer.unobserve(photoRefs[idx].current);
                }
            });
        };
    }, []);

    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <section className="hero-section" style={{
                paddingTop: '100px',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated Floating Background Elements */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(20, 184, 166, 0.15))',
                    animation: 'float 6s ease-in-out infinite',
                    filter: 'blur(40px)',
                    zIndex: 0,
                    transform: `translateY(${scrollY * 0.1}px)`
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '60%',
                    right: '10%',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(59, 130, 246, 0.15))',
                    animation: 'float 8s ease-in-out infinite 1s',
                    filter: 'blur(40px)',
                    zIndex: 0,
                    transform: `translateY(${scrollY * -0.15}px)`
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '20%',
                    left: '50%',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(249, 115, 22, 0.1))',
                    animation: 'float 10s ease-in-out infinite 2s',
                    filter: 'blur(50px)',
                    zIndex: 0,
                    transform: `translateY(${scrollY * 0.2}px)`
                }}></div>

                <Container style={{ position: 'relative', zIndex: 1 }}>
                    <Row className="align-items-center">
                        <Col lg={6} className="animate-slideInLeft">
                            <h1 className="display-3 fw-bold mb-4" style={{
                                color: 'var(--gray-900)',
                                transform: `translateX(${Math.min(scrollY * -0.1, 0)}px)`
                            }}>
                                AI-Powered Kitchen
                                <span className="text-gradient d-block animate-gradientShift" style={{
                                    backgroundSize: '200% 200%',
                                    fontSize: '1.1em',
                                    textShadow: '0 0 30px rgba(59, 130, 246, 0.3)'
                                }}>Hygiene Monitoring</span>
                            </h1>
                            <p className="lead mb-4 animate-fadeInUp" style={{
                                color: 'var(--gray-600)',
                                fontSize: '1.25rem',
                                animationDelay: '0.2s',
                                transform: `translateX(${Math.min(scrollY * -0.05, 0)}px)`
                            }}>
                                Revolutionizing food safety with real-time AI surveillance.
                                Ensure compliance, build trust, and maintain the highest hygiene standards.
                            </p>
                            <div className="d-flex gap-3 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                                <Link to="/register-hotel">
                                    <Button size="lg" className="btn-primary" style={{
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        Register Your Hotel <i className="fas fa-arrow-right ms-2"></i>
                                    </Button>
                                </Link>
                                <Link to="/report">
                                    <Button size="lg" variant="outline-primary" style={{
                                        transition: 'all 0.3s ease'
                                    }}>
                                        Report Violation <i className="fas fa-flag ms-2"></i>
                                    </Button>
                                </Link>
                            </div>
                        </Col>
                        <Col lg={6} className="text-center">
                            <div className="position-relative animate-bounceIn" style={{
                                animationDelay: '0.3s',
                                transform: `translateY(${scrollY * 0.1}px)`
                            }}>
                                <div className="floating-icon-container" style={{ position: 'relative' }}>
                                    {/* Pulsing Glow Ring */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '350px',
                                        height: '350px',
                                        borderRadius: '50%',
                                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent 70%)',
                                        animation: 'pulse 3s ease-in-out infinite',
                                        zIndex: 0
                                    }}></div>

                                    {/* Main Central Icon */}
                                    <div className="icon-circle" style={{
                                        background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))',
                                        backgroundSize: '200% 200%',
                                        width: '300px',
                                        height: '300px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto',
                                        boxShadow: '0 25px 50px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.2)',
                                        position: 'relative',
                                        animation: 'float 4s ease-in-out infinite, gradientShift 5s ease infinite',
                                        zIndex: 1
                                    }}>
                                        <i className="fas fa-utensils animate-scaleUp" style={{
                                            fontSize: '120px',
                                            color: 'white',
                                            filter: 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3))'
                                        }}></i>

                                        {/* Orbiting Icon 1 - AI Robot */}
                                        <div className="orbit-icon animate-orbit" style={{
                                            position: 'absolute',
                                            background: 'white',
                                            borderRadius: '50%',
                                            width: '90px',
                                            height: '90px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(59, 130, 246, 0.4)',
                                            top: '50%',
                                            left: '50%',
                                            marginLeft: '-45px',
                                            marginTop: '-45px',
                                            border: '3px solid var(--primary-100)'
                                        }}>
                                            <i className="fas fa-robot animate-pulse" style={{
                                                fontSize: '36px',
                                                color: 'var(--primary-600)',
                                                filter: 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3))'
                                            }}></i>
                                        </div>

                                        {/* Orbiting Icon 2 - Shield */}
                                        <div className="orbit-icon animate-orbit-reverse" style={{
                                            position: 'absolute',
                                            background: 'white',
                                            borderRadius: '50%',
                                            width: '90px',
                                            height: '90px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(16, 185, 129, 0.4)',
                                            top: '50%',
                                            left: '50%',
                                            marginLeft: '-45px',
                                            marginTop: '-45px',
                                            border: '3px solid rgba(16, 185, 129, 0.2)'
                                        }}>
                                            <i className="fas fa-shield-alt animate-pulse" style={{
                                                fontSize: '36px',
                                                color: 'var(--success)',
                                                animationDelay: '0.5s',
                                                filter: 'drop-shadow(0 2px 8px rgba(16, 185, 129, 0.3))'
                                            }}></i>
                                        </div>

                                        {/* Static Decorative Icons with Enhanced Glow */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '-30px',
                                            right: '20px',
                                            background: 'linear-gradient(135deg, #ffffff, #f0f9ff)',
                                            borderRadius: '50%',
                                            width: '70px',
                                            height: '70px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 0 20px rgba(20, 184, 166, 0.3)',
                                            animation: 'float 5s ease-in-out infinite 0.5s',
                                            border: '3px solid rgba(20, 184, 166, 0.3)'
                                        }}>
                                            <i className="fas fa-certificate animate-scaleUp" style={{
                                                fontSize: '28px',
                                                color: 'var(--accent-600)',
                                                animationDelay: '1s',
                                                filter: 'drop-shadow(0 2px 4px rgba(20, 184, 166, 0.3))'
                                            }}></i>
                                        </div>

                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-20px',
                                            left: '30px',
                                            background: 'linear-gradient(135deg, #ffffff, #fffbeb)',
                                            borderRadius: '50%',
                                            width: '70px',
                                            height: '70px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 0 20px rgba(245, 158, 11, 0.3)',
                                            animation: 'float 6s ease-in-out infinite 1s',
                                            border: '3px solid rgba(245, 158, 11, 0.3)'
                                        }}>
                                            <i className="fas fa-chart-line animate-scaleUp" style={{
                                                fontSize: '28px',
                                                color: 'var(--warning)',
                                                animationDelay: '1.5s',
                                                filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))'
                                            }}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Achievement Gallery Section */}
            <section className="py-5" style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(249, 250, 251, 0.8) 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Background */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05), transparent 70%)',
                    animation: 'pulse 6s ease-in-out infinite',
                    zIndex: 0
                }}></div>

                <Container style={{ position: 'relative', zIndex: 1 }}>
                    <div className="text-center mb-5 animate-fadeInUp">
                        <div style={{
                            display: 'inline-block',
                            padding: '0.5rem 1.5rem',
                            background: 'linear-gradient(135deg, var(--primary-100), var(--accent-100))',
                            borderRadius: '50px',
                            marginBottom: '1rem',
                            border: '2px solid rgba(59, 130, 246, 0.2)'
                        }}>
                            <i className="fas fa-trophy me-2" style={{ color: 'var(--primary-600)' }}></i>
                            <span style={{ color: 'var(--primary-700)', fontWeight: '700', fontSize: '0.9rem' }}>
                                ACHIEVEMENTS & RECOGNITION
                            </span>
                        </div>
                        <h2 className="display-5 fw-bold mb-3 text-gradient" style={{
                            textShadow: '0 0 30px rgba(59, 130, 246, 0.2)'
                        }}>
                            Health Department Excellence
                        </h2>
                        <p className="lead" style={{ color: 'var(--gray-600)', maxWidth: '700px', margin: '0 auto' }}>
                            Showcasing our commitment to the highest standards of food safety and hygiene
                        </p>
                    </div>

                    <Row className="g-4 justify-content-center">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading achievements...</span>
                                </div>
                            </div>
                        ) : achievements.length > 0 ? (
                            achievements.map((achievement, idx) => (
                                <Col md={4} key={achievement.id || idx} className="animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div
                                        className="achievement-card"
                                        style={{
                                            background: 'white',
                                            borderRadius: '20px',
                                            padding: '1.5rem',
                                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                            transform: `rotate(${[-2, 0, 2][idx % 3]}deg)`,
                                            cursor: 'pointer',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'rotate(0deg) translateY(-15px) scale(1.05)';
                                            e.currentTarget.style.boxShadow = '0 25px 50px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.2)';
                                            e.currentTarget.style.zIndex = '10';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = `rotate(${[-2, 0, 2][idx % 3]}deg) translateY(0) scale(1)`;
                                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                                            e.currentTarget.style.zIndex = '1';
                                        }}
                                    >
                                        {/* Shimmer Effect */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: '-100%',
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
                                            animation: 'shimmer 3s ease-in-out infinite',
                                            animationDelay: `${idx * 0.5}s`
                                        }}></div>


                                        {/* Image Container with Elegant Reveal */}
                                        <div
                                            ref={photoRefs[idx]}
                                            style={{
                                                width: '100%',
                                                height: '250px',
                                                borderRadius: '12px',
                                                marginBottom: '1rem',
                                                position: 'relative',
                                                background: 'linear-gradient(135deg, var(--gray-100), var(--gray-50))',
                                                opacity: 1,
                                                transform: revealedPhotos[idx] ? 'scale(1)' : 'scale(0.95)',
                                                filter: revealedPhotos[idx] ? 'blur(0)' : 'blur(5px)',
                                                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                                transitionDelay: `${idx * 0.15}s`,
                                                boxShadow: revealedPhotos[idx] ? '0 10px 40px rgba(59, 130, 246, 0.2)' : '0 0 0 rgba(0, 0, 0, 0)',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {achievement.image_path ? (
                                                <img
                                                    src={`http://localhost:5001${achievement.image_path}`}
                                                    alt={achievement.title}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0
                                                    }}
                                                />
                                            ) : (
                                                <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                                    <i className={`fas fa-${achievement.icon || 'trophy'} fa-4x mb-3`}
                                                        style={{
                                                            color: 'var(--primary-400)',
                                                            animation: 'float 4s ease-in-out infinite',
                                                            animationDelay: `${idx * 0.3}s`
                                                        }}></i>
                                                    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                                                        Achievement Image
                                                    </p>
                                                </div>
                                            )}
                                        </div>



                                        {/* Content */}
                                        <div className="text-center">
                                            <h4 className="mb-2 fw-bold" style={{ color: 'var(--gray-900)' }}>
                                                {achievement.title}
                                            </h4>
                                            <p className="mb-3" style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>
                                                {achievement.description || achievement.desc}
                                            </p>
                                            {achievement.year && (
                                                <div style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.5rem 1rem',
                                                    background: 'linear-gradient(135deg, var(--primary-50), var(--accent-50))',
                                                    borderRadius: '20px',
                                                    border: '1px solid var(--primary-200)'
                                                }}>
                                                    <i className="fas fa-calendar-alt" style={{ color: 'var(--primary-600)' }}></i>
                                                    <span style={{ color: 'var(--gray-700)', fontWeight: '600', fontSize: '0.875rem' }}>
                                                        {achievement.year}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Corner Badge */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '15px',
                                            right: '15px',
                                            background: 'linear-gradient(135deg, var(--success), #059669)',
                                            color: 'white',
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                                            animation: 'pulse 2s ease-in-out infinite',
                                            animationDelay: `${idx * 0.5}s`
                                        }}>
                                            <i className="fas fa-star me-1"></i>
                                            2024
                                        </div>
                                    </div>
                                </Col>
                            ))
                        ) : (
                            <div className="text-center py-5">
                                <p className="text-muted">No achievements to display yet.</p>
                            </div>
                        )}
                    </Row>

                    {/* View All Button */}
                    <div className="text-center mt-5 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                        <Button
                            size="lg"
                            variant="outline-primary"
                            style={{
                                borderWidth: '2px',
                                borderRadius: '12px',
                                padding: '0.875rem 2rem',
                                fontWeight: '700',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <i className="fas fa-images me-2"></i>
                            View All Achievements
                        </Button>
                    </div>
                </Container>
            </section>

            {/* Features Section */}
            <section className="py-5" style={{
                background: 'rgba(255, 255, 255, 0.5)',
                transform: `translateY(${Math.min(scrollY * 0.05, 50)}px)`,
                transition: 'transform 0.1s ease-out'
            }}>
                <Container>
                    <h2 className="text-center mb-5 text-gradient display-5 fw-bold animate-fadeInUp" style={{
                        textShadow: '0 0 30px rgba(59, 130, 246, 0.2)'
                    }}>
                        Why Choose RateMyKitchen?
                    </h2>
                    <Row className="g-4">
                        {[
                            { icon: 'video', color: 'var(--primary-500)', title: '24/7 AI Monitoring', desc: 'Advanced YOLOv8 AI continuously monitors kitchen activities, detecting violations in real-time with 99% accuracy.', delay: '0.1s' },
                            { icon: 'certificate', color: 'var(--accent-500)', title: 'Instant Certification', desc: 'Receive automated hygiene certificates and compliance reports to showcase your commitment to food safety.', delay: '0.2s' },
                            { icon: 'users', color: 'var(--success)', title: 'Public Transparency', desc: 'Guests can report violations and view hygiene ratings, promoting accountability and trust in the food industry.', delay: '0.3s' }
                        ].map((feature, idx) => (
                            <Col md={4} key={idx} className="animate-fadeInUp" style={{ animationDelay: feature.delay }}>
                                <div className="glass-card text-center card-hover h-100" style={{
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}>
                                    <div className="mb-4">
                                        <div className="animate-bounceIn" style={{
                                            width: '90px',
                                            height: '90px',
                                            background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                                            borderRadius: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto',
                                            boxShadow: `0 10px 30px ${feature.color}40, 0 0 20px ${feature.color}20`,
                                            animationDelay: `${0.2 + idx * 0.1}s`,
                                            transition: 'all 0.3s ease'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                                                e.currentTarget.style.boxShadow = `0 15px 40px ${feature.color}60, 0 0 30px ${feature.color}40`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                                                e.currentTarget.style.boxShadow = `0 10px 30px ${feature.color}40, 0 0 20px ${feature.color}20`;
                                            }}>
                                            <i className={`fas fa-${feature.icon} fa-2x animate-pulse`} style={{
                                                color: 'white',
                                                animationDelay: `${idx * 0.5}s`
                                            }}></i>
                                        </div>
                                    </div>
                                    <h4 className="mb-3" style={{ color: 'var(--gray-900)' }}>{feature.title}</h4>
                                    <p style={{ color: 'var(--gray-600)' }}>{feature.desc}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Stats Section */}
            <section className="py-5">
                <Container>
                    <Row className="text-center g-4">
                        {[
                            { value: '99%', label: 'Detection Accuracy', delay: '0.1s' },
                            { value: '24/7', label: 'Real-Time Monitoring', delay: '0.2s' },
                            { value: '100+', label: 'Hotels Registered', delay: '0.3s' },
                            { value: '5000+', label: 'Violations Detected', delay: '0.4s' }
                        ].map((stat, idx) => (
                            <Col md={3} key={idx} className="animate-fadeInUp" style={{ animationDelay: stat.delay }}>
                                <div className="glass-card card-hover" style={{
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = '';
                                    }}>
                                    <h2 className="display-4 fw-bold text-gradient mb-2 animate-scaleUp" style={{
                                        animationDelay: `${idx * 0.5}s`,
                                        textShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
                                    }}>{stat.value}</h2>
                                    <p style={{ color: 'var(--gray-600)', fontWeight: '600' }}>{stat.label}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-5 animate-fadeIn" style={{
                background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 8s ease infinite',
                boxShadow: '0 -10px 40px rgba(59, 130, 246, 0.3)'
            }}>
                <Container className="text-center">
                    <h2 className="display-5 fw-bold mb-4 animate-fadeInUp" style={{
                        color: 'white',
                        textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)'
                    }}>
                        Ready to Elevate Your Kitchen Standards?
                    </h2>
                    <p className="lead mb-4 animate-fadeInUp" style={{
                        color: 'rgba(255, 255, 255, 0.95)',
                        animationDelay: '0.2s'
                    }}>
                        Join hundreds of hotels ensuring the highest hygiene standards with AI technology.
                    </p>
                    <Link to="/register-hotel">
                        <Button size="lg" className="animate-bounceIn" style={{
                            background: 'white',
                            color: 'var(--primary-600)',
                            border: 'none',
                            padding: '1rem 2.5rem',
                            borderRadius: '12px',
                            fontWeight: '700',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                            animationDelay: '0.4s',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 255, 255, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                            }}>
                            Get Started Today <i className="fas fa-rocket ms-2"></i>
                        </Button>
                    </Link>
                </Container>
            </section>
        </>
    );
};

export default LandingPage;


