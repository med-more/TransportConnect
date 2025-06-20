const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  verifyUser,
  toggleUserStatus,
  getAnnouncements,
  deleteAnnouncement
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All admin routes require authentication and admin role
router.use(auth);
router.use(roleCheck('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/verify', verifyUser);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/announcements', getAnnouncements);
router.delete('/announcements/:id', deleteAnnouncement);

module.exports = router;