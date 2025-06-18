const { body } = require('express-validator');

const updateProfileValidator = [
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('phone')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Please provide a valid phone number')
    .isLength({ min: 8, max: 20 })
    .withMessage('Phone number must be between 8 and 20 characters'),

  body('address.street')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Street address must not exceed 100 characters'),

  body('address.city')
    .optional()
    .isLength({ max: 50 })
    .withMessage('City must not exceed 50 characters'),

  body('address.zipCode')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Zip code must not exceed 10 characters'),

  body('address.country')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Country must not exceed 50 characters'),

  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
];

module.exports = {
  updateProfileValidator
};