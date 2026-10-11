import React from 'react';
import { Link } from 'react-router-dom';

function getInsuranceTag(expiryDate) {
    if (!expiryDate) return null;
    const today = new Date();
    const expDate = new Date(expiryDate);
    if (Number.isNaN(expDate.getTime())) return null;

    today.setHours(0, 0, 0, 0);
    expDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { text: 'Expired', bg: '#fee2e2', color: '#dc2626' };
    }
    if (diffDays <= 30) {
        return { text: 'Expiring soon', bg: '#ffedd5', color: '#c2410c' };
    }
    return null;
}

function VehicleCard({ vehicle, user, onDelete }) {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active':
                return { backgroundColor: '#dcfce7', color: '#15803d' };
            case 'Under Maintenance':
            case 'Maintenance':
                return { backgroundColor: '#fef3c7', color: '#b45309' };
            case 'Inactive':
                return { backgroundColor: '#fee2e2', color: '#b91c1c' };
            default:
                return { backgroundColor: '#f1f5f9', color: '#475569' };
        }
    };

    const insuranceTag = getInsuranceTag(vehicle.insuranceExpiry);

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <span style={styles.regNumber}>{vehicle.vehicleNumber}</span>
                <span style={{ ...styles.statusBadge, ...getStatusStyle(vehicle.status) }}>
                    ● {vehicle.status}
                </span>
            </div>

            <div style={styles.content}>
                <h3 style={styles.title}>{vehicle.model}</h3>

                <div style={styles.infoRow}>
                    <span style={styles.typeBadge}>{vehicle.type}</span>
                </div>

                <div style={styles.details}>
                    <p style={styles.detailItem}>
                        <strong>Owner:</strong> {vehicle.owner}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={styles.detailItem}>
                            <strong>Insurance Expiry:</strong> {vehicle.insuranceExpiry}
                        </span>
                        {insuranceTag && (
                            <span style={{
                                fontSize: '11px',
                                fontWeight: 'bold',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: insuranceTag.bg,
                                color: insuranceTag.color
                            }}>
                                {insuranceTag.text}
                            </span>
                        )}
                    </div>
                </div>

                {user && user.role === 'admin' && (
                    <div style={styles.actions}>
                        <Link to={`/edit-vehicle/${vehicle._id}`} style={styles.editBtn}>
                            Edit
                        </Link>
                        <button
                            onClick={() => onDelete(vehicle._id)}
                            style={styles.deleteBtn}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    },
    header: {
        backgroundColor: '#f8fafc',
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0'
    },
    regNumber: {
        fontSize: '15px',
        fontWeight: 'bold',
        color: '#1e293b',
        letterSpacing: '1px',
        backgroundColor: '#f1f5f9',
        padding: '3px 8px',
        borderRadius: '4px',
        border: '1px solid #cbd5e1'
    },
    statusBadge: {
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
    },
    content: {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    title: {
        margin: '0',
        fontSize: '18px',
        color: '#0f172a',
        fontWeight: '600'
    },
    infoRow: {
        display: 'flex',
        alignItems: 'center'
    },
    typeBadge: {
        backgroundColor: '#e0e7ff',
        color: '#4338ca',
        fontSize: '12px',
        fontWeight: '600',
        padding: '3px 8px',
        borderRadius: '6px'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontSize: '14px',
        color: '#475569',
        marginTop: '4px'
    },
    detailItem: {
        margin: 0
    },
    actions: {
        display: 'flex',
        gap: '10px',
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px solid #f1f5f9'
    },
    editBtn: {
        flex: 1,
        textAlign: 'center',
        backgroundColor: '#f59e0b',
        color: '#ffffff',
        padding: '8px 12px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: '500'
    },
    deleteBtn: {
        flex: 1,
        backgroundColor: '#ef4444',
        color: '#ffffff',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500'
    }
};

export default VehicleCard;
