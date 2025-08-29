const { Router } = require('express');
const authRouter = require('./auth.js');
const adminRouter = require('./admin.js');
const reservations = require('./reservations');
const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/reservations', reservations);


module.exports = router;