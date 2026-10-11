import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL, getToken } from '../services/api';

function VehicleList({ user }) {
    const [vehicles, setVehicles] = useState([]);
    const [search, setSearch] = useState('');
    const [type, setType] = useState('All');
    const [status, setStatus] = useState('All');
    const [loading, setLoading] = useState(true);

    async function getVehicles() {
        setLoading(true);
        try {
            let url = `${API_URL}/vehicles?search=${search}`;
            if (type !== 'All') url += `&type=${type}`;
            if (status !== 'All') url += `&status=${status}`;

            let res = await fetch(url);
            let data = await res.json();
            setVehicles(data);
        } catch (err) {
            console.log('Error fetching vehicles:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getVehicles();
    }, [type, status]);

    function handleSearch(e) {
        e.preventDefault();
        getVehicles();
    }

    async function handleDelete(id) {
        if (!window.confirm('Are you sure you want to delete this vehicle?')) return;

        let token = getToken();
        try {
            let res = await fetch(`${API_URL}/vehicles/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setVehicles(vehicles.filter((v) => v._id !== id));
            } else {
                alert('Failed to delete vehicle');
            }
        } catch (err) {
            alert('Error deleting vehicle');
        }
    }

    return (
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '90vh', padding: '20px' }}>
            <div style={styles.header}>
                <div>
                    <h2>Vehicle Management System</h2>
                    <p style={{ color: '#666', marginTop: '5px' }}>
                        Browse, search, and manage registered vehicles
                    </p>
                </div>

                {user && user.role === 'admin' && (
                    <Link to="/add-vehicle" style={styles.addBtn}>
                        + Add Vehicle
                    </Link>
                )}
            </div>

            <div style={styles.filterBar}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flex: 1 }}>
                    <input
                        type="text"
                        placeholder="Search by number, model, or owner..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={styles.searchInput}
                    />
                    <button type="submit" style={styles.searchBtn}>Search</button>
                </form>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <select value={type} onChange={(e) => setType(e.target.value)} style={styles.select}>
                        <option value="All">All Types</option>
                        <option value="Car">Car</option>
                        <option value="Bike">Bike</option>
                        <option value="Truck">Truck</option>
                        <option value="Bus">Bus</option>
                        <option value="Van">Van</option>
                        <option value="Scooter">Scooter</option>
                    </select>

                    <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading vehicles...</p>
            ) : vehicles.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '40px', color: '#888' }}>
                    No vehicles found
                </p>
            ) : (
                <div style={styles.container}>
                    {vehicles.map((vehicle) => (
                        <div key={vehicle._id} style={styles.card}>
                            <div style={styles.cardTop}>
                                <span style={styles.numberBadge}>{vehicle.vehicleNumber}</span>
                                <span style={styles.statusBadge(vehicle.status)}>
                                    {vehicle.status}
                                </span>
                            </div>

                            <div style={styles.cardBody}>
                                <h3 style={{ margin: '10px 0 5px' }}>{vehicle.model}</h3>
                                <p style={{ color: '#555', margin: '4px 0' }}>
                                    Type: <strong>{vehicle.type}</strong>
                                </p>
                                <p style={{ color: '#555', margin: '4px 0' }}>
                                    Owner: <strong>{vehicle.owner}</strong>
                                </p>
                                <p style={{ color: '#777', fontSize: '13px', margin: '4px 0' }}>
                                    Insurance Expiry: {vehicle.insuranceExpiry}
                                </p>
                            </div>

                            {user && user.role === 'admin' && (
                                <div style={styles.cardActions}>
                                    <Link to={`/edit-vehicle/${vehicle._id}`} style={styles.editBtn}>
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(vehicle._id)}
                                        style={styles.deleteBtn}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    header: {
        maxWidth: '1200px',
        margin: '0 auto 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
    },
    addBtn: {
        backgroundColor: '#111',
        color: '#fff',
        padding: '10px 18px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '14px'
    },
    filterBar: {
        maxWidth: '1200px',
        margin: '0 auto 25px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    },
    searchInput: {
        flex: 1,
        padding: '8px 12px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '14px'
    },
    searchBtn: {
        padding: '8px 16px',
        backgroundColor: '#111',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    select: {
        padding: '8px 12px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '14px',
        backgroundColor: '#fff'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '18px',
        boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    cardTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
    },
    numberBadge: {
        fontWeight: 'bold',
        fontSize: '14px',
        color: '#111'
    },
    statusBadge: (status) => ({
        fontSize: '12px',
        fontWeight: 'bold',
        padding: '3px 8px',
        borderRadius: '10px',
        backgroundColor: status === 'Active' ? '#e6f7ec' : status === 'Under Maintenance' ? '#fef3c7' : '#fee2e2',
        color: status === 'Active' ? '#15803d' : status === 'Under Maintenance' ? '#b45309' : '#b91c1c'
    }),
    cardBody: {
        padding: '10px 0'
    },
    cardActions: {
        display: 'flex',
        gap: '10px',
        borderTop: '1px solid #eee',
        paddingTop: '12px',
        marginTop: '10px'
    },
    editBtn: {
        flex: 1,
        textAlign: 'center',
        backgroundColor: '#f59e0b',
        color: '#fff',
        padding: '8px',
        borderRadius: '5px',
        textDecoration: 'none',
        fontSize: '13px'
    },
    deleteBtn: {
        flex: 1,
        backgroundColor: '#ef4444',
        color: '#fff',
        border: 'none',
        padding: '8px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '13px'
    }
};

export default VehicleList;
