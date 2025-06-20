const express = require('express');
const router = express.Router();
const { updateProfile, getUserById, getDashboard } = require('../controllers/userController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const { updateProfileValidator } = require('../validators/userValidator');

router.put('/profile', auth, updateProfileValidator, validate, updateProfile);
router.get('/dashboard', auth, getDashboard);
router.get('/:id', auth, getUserById);

module.exports = router;