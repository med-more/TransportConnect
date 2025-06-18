const { body } = require('express-validator');

const createRatingValidator = [
  body('requestId')
    .isMongoId()
    .withMessage('Invalid request ID'),

  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comment must not exceed 500 characters'),

  body('criteria.punctuality')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Punctuality rating must be between 1 and 5'),

  body('criteria.communication')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Communication rating must be between 1 and 5'),

  body('criteria.packageCondition')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Package condition rating must be between 1 and 5'),

  body('criteria.professionalism')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Professionalism rating must be between 1 and 5'),

  body('wouldRecommend')
    .optional()
    .isBoolean()
    .withMessage('Would recommend must be a boolean value')
];

module.exports = {
  createRatingValidator
};