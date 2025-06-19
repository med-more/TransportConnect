const express = require('express');
const router = express.Router();
const { register, login, getProfile, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');
const { registerValidator, loginValidator } = require('../validators/authValidator');

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);


module.exports = router;