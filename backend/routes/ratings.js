const express = require('express');
const router = express.Router();
const {
  createRating,
  getUserRatings,
  getMyRatings,
  respondToRating
} = require('../controllers/ratingController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const { createRatingValidator } = require('../validators/ratingValidator');

router.post('/', auth, createRatingValidator, validate, createRating);
router.get('/my', auth, getMyRatings);
router.get('/user/:id', getUserRatings);
router.put('/:id/respond', auth, respondToRating);

module.exports = router;