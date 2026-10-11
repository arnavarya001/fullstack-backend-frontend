import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import VehicleList from './pages/VehicleList';
import FleetView from './pages/FleetView';
import VehicleForm from './pages/VehicleForm';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    return (
        <BrowserRouter>
            <div>
                <Navbar user={user} setUser={setUser} />
                <Routes>
                    <Route path="/" element={<VehicleList user={user} />} />
                    <Route path="/fleet" element={<FleetView />} />
                    <Route
                        path="/add-vehicle"
                        element={
                            <ProtectedRoute user={user} requiredRole="admin">
                                <VehicleForm user={user} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/edit-vehicle/:id"
                        element={
                            <ProtectedRoute user={user} requiredRole="admin">
                                <VehicleForm user={user} />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/register" element={<Register setUser={setUser} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;