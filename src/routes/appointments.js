const { Router } = require('express');
const appointmentController = require('../controllers/appointmentController');
const authenticateToken = require('../middlewares/auth');
const router = Router();

// Ruta para obtener las citas de un usuario específico
// Protegida con middleware de autenticación
router.get('/:id/appointments', authenticateToken, appointmentController.getUserAppointments);

module.exports = router;