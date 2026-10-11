import { useState, useEffect } from 'react';
import { API_URL } from '../services/api';
import VehicleCard from '../components/VehicleCard';

function sanitizeQuery(input) {
    return String(input || '').replace(/[^a-zA-Z0-9\s-_]/g, '').trim();
}

function buildFleetEndpoint(query, type, status) {
    const url = new URL(`${API_URL}/vehicles`);
    const clean = sanitizeQuery(query);
    if (clean) {
        url.searchParams.set('search', clean);
    }
    if (type && type !== 'All') {
        url.searchParams.set('type', type);
    }
    if (status && status !== 'All') {
        url.searchParams.set('status', status);
    }
    return url.href;
}

function FleetView() {
    const [fleet, setFleet] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [loading, setLoading] = useState(true);

    function requestFleet() {
        setLoading(true);
        const endpoint = buildFleetEndpoint(searchQuery, filterType, filterStatus);
        fetch(endpoint)
            .then((res) => res.json())
            .then((data) => {
                setFleet(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        requestFleet();
    }, [filterType, filterStatus]);

    function onSearchSubmit(e) {
        e.preventDefault();
        requestFleet();
    }

    function resetFilters() {
        setSearchQuery('');
        setFilterType('All');
        setFilterStatus('All');
    }

    const activeCount = fleet.filter((item) => item.status === 'Active').length;
    const maintenanceCount = fleet.filter((item) => item.status === 'Under Maintenance' || item.status === 'Maintenance').length;
    const inactiveCount = fleet.filter((item) => item.status === 'Inactive').length;

    let mainContent;
    if (loading) {
        mainContent = (
            <div style={fleetStyles.messageBox}>
                <p style={fleetStyles.infoMessage}>Loading fleet records...</p>
            </div>
        );
    } else if (fleet.length === 0) {
        mainContent = (
            <div style={fleetStyles.messageBox}>
                <p style={fleetStyles.emptyMessage}>
                    No vehicles found matching your query or selected filters.
                </p>
                <button onClick={resetFilters} style={fleetStyles.secondaryBtn}>
                    Clear Filters
                </button>
            </div>
        );
    } else {
        mainContent = (
            <div style={fleetStyles.cardsGrid}>
                {fleet.map((vehicle) => (
                    <VehicleCard key={vehicle._id} vehicle={vehicle} />
                ))}
            </div>
        );
    }

    const hasActiveFilters = Boolean(searchQuery || filterType !== 'All' || filterStatus !== 'All');

    return (
        <div style={fleetStyles.pageWrapper}>
            <div style={fleetStyles.banner}>
                <div style={fleetStyles.bannerContent}>
                    <h1 style={fleetStyles.mainHeading}>Fleet Directory</h1>
                    <p style={fleetStyles.subText}>
                        Browse, search, and monitor organizational vehicles and fleet availability
                    </p>
                    <div style={fleetStyles.metricsRow}>
                        <div style={fleetStyles.metricBadge}>
                            <span style={fleetStyles.metricLabel}>Total Listed:</span>
                            <strong style={fleetStyles.metricValue}>{fleet.length}</strong>
                        </div>
                        <div style={fleetStyles.metricBadge}>
                            <span style={fleetStyles.metricLabel}>Active:</span>
                            <strong style={{ ...fleetStyles.metricValue, color: '#16a34a' }}>{activeCount}</strong>
                        </div>
                        <div style={fleetStyles.metricBadge}>
                            <span style={fleetStyles.metricLabel}>Maintenance:</span>
                            <strong style={{ ...fleetStyles.metricValue, color: '#d97706' }}>{maintenanceCount}</strong>
                        </div>
                        <div style={fleetStyles.metricBadge}>
                            <span style={fleetStyles.metricLabel}>Inactive:</span>
                            <strong style={{ ...fleetStyles.metricValue, color: '#dc2626' }}>{inactiveCount}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div style={fleetStyles.controlPanel}>
                <form onSubmit={onSearchSubmit} style={fleetStyles.searchForm}>
                    <input
                        type="text"
                        placeholder="Search by registration number or model..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={fleetStyles.searchField}
                    />
                    <button type="submit" style={fleetStyles.primaryBtn}>
                        Search
                    </button>
                    {hasActiveFilters && (
                        <button type="button" onClick={resetFilters} style={fleetStyles.secondaryBtn}>
                            Reset
                        </button>
                    )}
                </form>

                <div style={fleetStyles.filterDropdownGroup}>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={fleetStyles.filterSelect}
                    >
                        <option value="All">All Vehicle Types</option>
                        <option value="Car">Car</option>
                        <option value="Bike">Bike</option>
                        <option value="Truck">Truck</option>
                        <option value="Bus">Bus</option>
                        <option value="Van">Van</option>
                        <option value="Scooter">Scooter</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={fleetStyles.filterSelect}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {mainContent}
        </div>
    );
}

const fleetStyles = {
    pageWrapper: {
        backgroundColor: '#f8fafc',
        minHeight: '92vh',
        padding: '30px 20px 50px'
    },
    banner: {
        maxWidth: '1200px',
        margin: '0 auto 24px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px 28px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    },
    bannerContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    mainHeading: {
        margin: 0,
        fontSize: '24px',
        fontWeight: '700',
        color: '#0f172a'
    },
    subText: {
        margin: 0,
        color: '#64748b',
        fontSize: '14px'
    },
    metricsRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '14px',
        marginTop: '8px'
    },
    metricBadge: {
        backgroundColor: '#f1f5f9',
        padding: '6px 14px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px'
    },
    metricLabel: {
        color: '#475569'
    },
    metricValue: {
        fontWeight: '700',
        color: '#0f172a'
    },
    controlPanel: {
        maxWidth: '1200px',
        margin: '0 auto 28px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        backgroundColor: '#ffffff',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    },
    searchForm: {
        display: 'flex',
        flex: '1 1 340px',
        gap: '10px'
    },
    searchField: {
        flex: 1,
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        fontSize: '14px',
        outline: 'none'
    },
    primaryBtn: {
        padding: '10px 18px',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600'
    },
    secondaryBtn: {
        padding: '10px 16px',
        backgroundColor: '#f1f5f9',
        color: '#334155',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
    },
    filterDropdownGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px'
    },
    filterSelect: {
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        fontSize: '14px',
        backgroundColor: '#ffffff',
        color: '#334155',
        cursor: 'pointer'
    },
    cardsGrid: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: '24px'
    },
    messageBox: {
        maxWidth: '600px',
        margin: '40px auto',
        textAlign: 'center',
        padding: '30px 20px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
    },
    infoMessage: {
        color: '#64748b',
        fontSize: '15px',
        margin: 0
    },
    emptyMessage: {
        color: '#64748b',
        fontSize: '15px',
        marginBottom: '16px'
    }
};

export default FleetView;
