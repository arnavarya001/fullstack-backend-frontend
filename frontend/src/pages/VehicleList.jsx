import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL, getToken } from '../services/api';
import VehicleCard from '../components/VehicleCard';

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
                        <VehicleCard
                            key={vehicle._id}
                            vehicle={vehicle}
                            user={user}
                            onDelete={handleDelete}
                        />
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
    }
};

export default VehicleList;
