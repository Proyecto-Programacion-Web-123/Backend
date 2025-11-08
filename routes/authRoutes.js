const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout-all', auth(true), ctrl.logoutAll);

module.exports = router;
