import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';

function Register({ setUser }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        try {
            let res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            let data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Registration failed');
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            navigate('/');
        } catch (err) {
            setError('Server error, please try again');
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <Link to="/" style={styles.backLink}>← Back to Home</Link>

                <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Register</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
                    Create an account to view vehicles
                </p>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label>Name:</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Email:</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Password:</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" style={styles.button}>Register</button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '15px' }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        padding: '50px 20px',
        backgroundColor: '#f5f5f5',
        minHeight: '80vh'
    },
    card: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
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
        fontSize: '14px'
    },
    button: {
        width: '100%',
        padding: '10px',
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

export default Register;
