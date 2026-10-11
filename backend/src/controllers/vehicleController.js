const Vehicle = require('../models/Vehicle');

const getVehicles = async (req, res) => {
    try {
        const { search, type, status } = req.query;
        let filter = {};

        if (search) {
            filter.$or = [
                { vehicleNumber: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
                { owner: { $regex: search, $options: 'i' } }
            ];
        }

        if (type && type !== 'All') {
            filter.type = type;
        }

        if (status && status !== 'All') {
            filter.status = status;
        }

        const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createVehicle = async (req, res) => {
    try {
        const { vehicleNumber, model, type, owner, insuranceExpiry, status } = req.body;

        if (!vehicleNumber || !model || !type || !owner || !insuranceExpiry) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const existing = await Vehicle.findOne({ vehicleNumber: vehicleNumber.toUpperCase().trim() });
        if (existing) {
            return res.status(400).json({ message: 'Vehicle number already exists' });
        }

        const vehicle = await Vehicle.create({
            vehicleNumber: vehicleNumber.toUpperCase().trim(),
            model,
            type,
            owner,
            insuranceExpiry,
            status: status || 'Active'
        });

        res.status(201).json({ message: 'Vehicle created successfully', vehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle updated successfully', vehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
};
