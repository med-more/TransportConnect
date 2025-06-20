const express = require('express');
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getMyAnnouncements
} = require('../controllers/announcementController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const validate = require('../middleware/validation');
const { createAnnouncementLimiter, searchLimiter } = require('../middleware/rateLimiter');
const { 
  createAnnouncementValidator, 
  updateAnnouncementValidator 
} = require('../validators/announcementValidator');

router.get('/my', auth, roleCheck('conductor'), getMyAnnouncements);

router.post(
  '/',
  auth,
  roleCheck('conductor'),
  createAnnouncementLimiter,
  createAnnouncementValidator,
  validate,
  createAnnouncement
);

router.get('/', searchLimiter, getAnnouncements);
router.get('/:id', getAnnouncement);

router.put(
  '/:id',
  auth,
  roleCheck('conductor'),
  updateAnnouncementValidator,
  validate,
  updateAnnouncement
);

router.delete('/:id', auth, roleCheck('conductor'), deleteAnnouncement);

module.exports = router;