const Vehicle = require('../models/Vehicle');

const allowedTypes = ['Car', 'Bike', 'Truck', 'Bus', 'Van', 'Scooter', 'Sedan', 'SUV'];
const allowedStatuses = ['Active', 'Under Maintenance', 'Maintenance', 'Inactive'];

const getVehicles = async (req, res, next) => {
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
        next(error);
    }
};

const getVehicleById = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        next(error);
    }
};

const createVehicle = async (req, res, next) => {
    try {
        const { vehicleNumber, model, type, owner, insuranceExpiry, status } = req.body;

        if (!vehicleNumber || !vehicleNumber.trim()) {
            return res.status(400).json({ message: 'Vehicle number is required' });
        }
        if (!model || !model.trim()) {
            return res.status(400).json({ message: 'Vehicle model is required' });
        }
        if (!type || !type.trim()) {
            return res.status(400).json({ message: 'Vehicle type is required' });
        }
        if (!owner || !owner.trim()) {
            return res.status(400).json({ message: 'Owner name is required' });
        }
        if (!insuranceExpiry) {
            return res.status(400).json({ message: 'Insurance expiry date is required' });
        }

        const matchedType = allowedTypes.find(t => t.toLowerCase() === type.trim().toLowerCase());
        if (!matchedType) {
            return res.status(400).json({
                message: `Invalid vehicle type: "${type}". Allowed types are: ${allowedTypes.join(', ')}`
            });
        }

        let formattedStatus = 'Active';
        if (status) {
            const matchedStatus = allowedStatuses.find(s => s.toLowerCase() === status.trim().toLowerCase());
            if (!matchedStatus) {
                return res.status(400).json({
                    message: `Invalid vehicle status: "${status}". Allowed statuses are: Active, Under Maintenance, Inactive`
                });
            }
            formattedStatus = matchedStatus;
        }

        if (isNaN(Date.parse(insuranceExpiry))) {
            return res.status(400).json({
                message: 'Invalid insurance expiry date format. Please provide a valid date'
            });
        }

        const formattedNumber = vehicleNumber.toUpperCase().trim();
        const existing = await Vehicle.findOne({ vehicleNumber: formattedNumber });
        if (existing) {
            return res.status(400).json({
                message: `Vehicle number "${formattedNumber}" already exists`
            });
        }

        const vehicle = await Vehicle.create({
            vehicleNumber: formattedNumber,
            model: model.trim(),
            type: matchedType,
            owner: owner.trim(),
            insuranceExpiry,
            status: formattedStatus
        });

        res.status(201).json({ message: 'Vehicle created successfully', vehicle });
    } catch (error) {
        next(error);
    }
};

const updateVehicle = async (req, res, next) => {
    try {
        const { vehicleNumber, model, type, owner, insuranceExpiry, status } = req.body;
        const updateData = {};

        if (vehicleNumber !== undefined) {
            if (!vehicleNumber.trim()) {
                return res.status(400).json({ message: 'Vehicle number cannot be empty' });
            }
            const formattedNumber = vehicleNumber.toUpperCase().trim();
            const existing = await Vehicle.findOne({
                vehicleNumber: formattedNumber,
                _id: { $ne: req.params.id }
            });
            if (existing) {
                return res.status(400).json({
                    message: `Vehicle number "${formattedNumber}" already exists`
                });
            }
            updateData.vehicleNumber = formattedNumber;
        }

        if (model !== undefined) {
            if (!model.trim()) {
                return res.status(400).json({ message: 'Vehicle model cannot be empty' });
            }
            updateData.model = model.trim();
        }

        if (type !== undefined) {
            const matchedType = allowedTypes.find(t => t.toLowerCase() === type.trim().toLowerCase());
            if (!matchedType) {
                return res.status(400).json({
                    message: `Invalid vehicle type: "${type}". Allowed types are: ${allowedTypes.join(', ')}`
                });
            }
            updateData.type = matchedType;
        }

        if (owner !== undefined) {
            if (!owner.trim()) {
                return res.status(400).json({ message: 'Owner name cannot be empty' });
            }
            updateData.owner = owner.trim();
        }

        if (insuranceExpiry !== undefined) {
            if (isNaN(Date.parse(insuranceExpiry))) {
                return res.status(400).json({
                    message: 'Invalid insurance expiry date format. Please provide a valid date'
                });
            }
            updateData.insuranceExpiry = insuranceExpiry;
        }

        if (status !== undefined) {
            const matchedStatus = allowedStatuses.find(s => s.toLowerCase() === status.trim().toLowerCase());
            if (!matchedStatus) {
                return res.status(400).json({
                    message: `Invalid vehicle status: "${status}". Allowed statuses are: Active, Under Maintenance, Inactive`
                });
            }
            updateData.status = matchedStatus;
        }

        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.json({ message: 'Vehicle updated successfully', vehicle });
    } catch (error) {
        next(error);
    }
};

const deleteVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
};
