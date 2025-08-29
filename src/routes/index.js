const { Router } = require('express');
const authRouter = require('./auth.js');
const adminRouter = require('./admin.js');
const reservations = require('./reservations');
const appointments = require('./appointments');
const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/reservations', reservations);
router.use('/users', appointments)


module.exports = router;