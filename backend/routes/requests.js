const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequests,
  getRequest,
  acceptRequest,
  rejectRequest,
  updateRequestStatus,
  cancelRequest
} = require('../controllers/requestController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const validate = require('../middleware/validation');
const { createRequestValidator } = require('../validators/requestValidator');

// Routes de base
router.post('/', auth, roleCheck('sender'), createRequestValidator, validate, createRequest);
router.get('/', auth, getRequests);

// Routes avec ID
router.get('/id/:id', auth, getRequest);
router.put('/id/:id/accept', auth, roleCheck('conductor'), acceptRequest);
router.put('/id/:id/reject', auth, roleCheck('conductor'), rejectRequest);
router.put('/id/:id/status', auth, roleCheck('conductor'), updateRequestStatus);
router.put('/id/:id/cancel', auth, roleCheck('sender'), cancelRequest);

module.exports = router;