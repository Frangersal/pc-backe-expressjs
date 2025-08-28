const { Router } = require('express');
const { createTimeBlock, listReservations } = require('../controllers/adminController');

const authenticateToken =require('../middlewares/auth')

const router = Router();

// Ruta para crear bloques de tiempo
router.post('/time-blocks', authenticateToken, createTimeBlock);

// Ruta para listar todas las reservaciones
router.get('/reservations', authenticateToken, listReservations);

module.exports = router;