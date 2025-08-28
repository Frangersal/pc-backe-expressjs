const { Router } = require('express');
const authRouter = require('./auth.js');
const adminRouter = require('./admin.js');
const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);


module.exports = router;