import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Badge, Tab, Tabs } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import axios from 'axios';

const AdminDashboard = () => {
    const [hotels, setHotels] = useState([]);
    const [reports, setReports] = useState([]);

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchHotels();
        fetchReports();
    }, []);

    const fetchHotels = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/hotels', config);
            setHotels(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchReports = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/reports', config);
            setReports(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/hotels/${id}/approve`, {}, config); // Fixed URL
            fetchHotels();
        } catch (err) {
            alert('Error approving hotel');
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/hotels/${id}/reject`, {}, config); // Fixed URL
            fetchHotels();
        } catch (err) {
            alert('Error rejecting hotel');
        }
    };

    return (
        <>
            <Navbar />
            <Container className="py-5" style={{ paddingTop: '100px' }}>
                <h2 className="mb-4">Admin Dashboard</h2>

                <Tabs defaultActiveKey="hotels" className="mb-4 custom-tabs">
                    <Tab eventKey="hotels" title="Hotel Management">
                        <GlassCard>
                            <Table variant="dark" hover responsive className="bg-transparent text-white">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Hygiene</th>
                                        <th>Violations</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hotels.map(hotel => (
                                        <tr key={hotel.id}>
                                            <td>{hotel.id}</td>
                                            <td>{hotel.hotel_name}</td>
                                            <td>{hotel.email}</td>
                                            <td>
                                                <Badge bg={hotel.is_verified === 1 ? 'success' : hotel.is_verified === 2 ? 'danger' : 'warning'}>
                                                    {hotel.is_verified === 1 ? 'Verified' : hotel.is_verified === 2 ? 'Rejected' : 'Pending'}
                                                </Badge>
                                            </td>
                                            <td>{hotel.hygiene_status}</td>
                                            <td>{hotel.violation_count}</td>
                                            <td>
                                                {hotel.is_verified === 0 && (
                                                    <>
                                                        <Button size="sm" variant="success" className="me-2" onClick={() => handleApprove(hotel.id)}>Approve</Button>
                                                        <Button size="sm" variant="danger" onClick={() => handleReject(hotel.id)}>Reject</Button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </GlassCard>
                    </Tab>

                    <Tab eventKey="reports" title="Guest Reports">
                        <GlassCard>
                            {reports.map(report => (
                                <div key={report.id} className="mb-3 p-3 border-bottom border-secondary">
                                    <div className="d-flex justify-content-between">
                                        <h5>Hotel: {report.hotel_name_input}</h5>
                                        <Badge bg="info">{report.status}</Badge>
                                    </div>
                                    <p>{report.description}</p>
                                    {report.google_maps_link && (
                                        <a href={report.google_maps_link} target="_blank" rel="noreferrer" className="text-info d-block mb-2">
                                            View Location <i className="fas fa-external-link-alt"></i>
                                        </a>
                                    )}
                                    {report.media_type === 'image' ? (
                                        <img src={`http://localhost:5000${report.media_url}`} height="150" alt="Proof" className="rounded" />
                                    ) : (
                                        <video src={`http://localhost:5000${report.media_url}`} height="150" controls className="rounded" />
                                    )}
                                </div>
                            ))}
                        </GlassCard>
                    </Tab>
                </Tabs>
            </Container>
        </>
    );
};

export default AdminDashboard;
