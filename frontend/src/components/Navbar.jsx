import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, setUser }) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    }

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.brand}>🚗 VehicleMS</Link>

            <div style={styles.links}>
                <Link to="/" style={styles.link}>Vehicles</Link>
                <Link to="/fleet" style={styles.link}>Fleet View</Link>

                {user && user.role === 'admin' && (
                    <Link to="/add-vehicle" style={styles.addBtn}>+ Add Vehicle</Link>
                )}

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={styles.userBadge}>
                            {user.name} ({user.role})
                        </span>
                        <button onClick={handleLogout} style={styles.logoutBtn}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: '#111',
        color: '#fff'
    },
    brand: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '20px',
        fontWeight: 'bold'
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '15px'
    },
    addBtn: {
        backgroundColor: '#0066cc',
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '5px',
        textDecoration: 'none',
        fontSize: '14px'
    },
    userBadge: {
        backgroundColor: '#333',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '13px'
    },
    logoutBtn: {
        backgroundColor: '#e63946',
        color: '#fff',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '13px'
    }
};

export default Navbar;
