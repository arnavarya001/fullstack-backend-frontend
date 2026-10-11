import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { API_URL, getToken } from '../services/api';

function VehicleForm({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [vehicleNumber, setVehicleNumber] = useState('');
    const [model, setModel] = useState('');
    const [type, setType] = useState('Car');
    const [owner, setOwner] = useState('');
    const [insuranceExpiry, setInsuranceExpiry] = useState('');
    const [status, setStatus] = useState('Active');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        if (id) {
            async function getSingleVehicle() {
                try {
                    let res = await fetch(`${API_URL}/vehicles/${id}`);
                    let data = await res.json();
                    if (res.ok) {
                        setVehicleNumber(data.vehicleNumber || '');
                        setModel(data.model || '');
                        setType(data.type || 'Car');
                        setOwner(data.owner || '');
                        setInsuranceExpiry(data.insuranceExpiry || '');
                        setStatus(data.status || 'Active');
                    }
                } catch (err) {
                    setError('Error loading vehicle');
                }
            }
            getSingleVehicle();
        }
    }, [id, user, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        const token = getToken();
        const url = id ? `${API_URL}/vehicles/${id}` : `${API_URL}/vehicles`;
        const method = id ? 'PUT' : 'POST';

        try {
            let res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    vehicleNumber,
                    model,
                    type,
                    owner,
                    insuranceExpiry,
                    status
                })
            });

            let data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Operation failed');
                return;
            }

            navigate('/');
        } catch (err) {
            setError('Server error, please try again');
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <Link to="/" style={styles.backLink}>← Back to Home</Link>

                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                    {id ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h2>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label>Vehicle Number:</label>
                        <input
                            type="text"
                            placeholder="e.g. DL-01-AB-1234"
                            value={vehicleNumber}
                            onChange={(e) => setVehicleNumber(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Model:</label>
                        <input
                            type="text"
                            placeholder="e.g. Honda City"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Vehicle Type:</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            style={styles.input}
                        >
                            <option value="Car">Car</option>
                            <option value="Bike">Bike</option>
                            <option value="Truck">Truck</option>
                            <option value="Bus">Bus</option>
                            <option value="Van">Van</option>
                            <option value="Scooter">Scooter</option>
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Owner Name:</label>
                        <input
                            type="text"
                            placeholder="e.g. Rahul Sharma"
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Insurance Expiry Date:</label>
                        <input
                            type="date"
                            value={insuranceExpiry}
                            onChange={(e) => setInsuranceExpiry(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Status:</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            style={styles.input}
                        >
                            <option value="Active">Active</option>
                            <option value="Under Maintenance">Under Maintenance</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <button type="submit" style={styles.button}>
                        {id ? 'Update Vehicle' : 'Add Vehicle'}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px',
        backgroundColor: '#f5f5f5',
        minHeight: '80vh'
    },
    card: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '480px'
    },
    backLink: {
        display: 'inline-block',
        marginBottom: '15px',
        color: '#0066cc',
        textDecoration: 'none'
    },
    inputGroup: {
        marginBottom: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '14px',
        backgroundColor: '#fff'
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#111',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '10px'
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: '10px'
    }
};

export default VehicleForm;
