const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: [true, 'Vehicle number is required'],
        unique: true,
        trim: true,
        uppercase: true
    },
    model: {
        type: String,
        required: [true, 'Vehicle model is required'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Vehicle type is required'],
        trim: true
    },
    owner: {
        type: String,
        required: [true, 'Owner name is required'],
        trim: true
    },
    insuranceExpiry: {
        type: String,
        required: [true, 'Insurance expiry date is required']
    },
    status: {
        type: String,
        enum: ['Active', 'Under Maintenance', 'Inactive'],
        default: 'Active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
