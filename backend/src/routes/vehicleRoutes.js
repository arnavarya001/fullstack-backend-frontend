const express = require('express');
const router = express.Router();

const {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicleController');

const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getVehicles);
router.get('/:id', getVehicleById);

router.post('/', authenticateUser, requireAdmin, createVehicle);
router.put('/:id', authenticateUser, requireAdmin, updateVehicle);
router.delete('/:id', authenticateUser, requireAdmin, deleteVehicle);

module.exports = router;
