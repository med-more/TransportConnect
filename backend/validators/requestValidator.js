const { body } = require('express-validator');

const createRequestValidator = [
  body('announcementId')
    .isMongoId()
    .withMessage('Invalid announcement ID'),

  body('packageDetails.weight')
    .isFloat({ min: 0.1 })
    .withMessage('Package weight must be a positive number'),

  body('packageDetails.dimensions.length')
    .isFloat({ min: 1 })
    .withMessage('Package length must be a positive number'),

  body('packageDetails.dimensions.width')
    .isFloat({ min: 1 })
    .withMessage('Package width must be a positive number'),

  body('packageDetails.dimensions.height')
    .isFloat({ min: 1 })
    .withMessage('Package height must be a positive number'),

  body('packageDetails.type')
    .isIn(['fragile', 'electronics', 'furniture', 'clothing', 'food', 'books', 'automotive', 'other'])
    .withMessage('Invalid package type'),

  body('packageDetails.description')
    .notEmpty()
    .withMessage('Package description is required')
    .isLength({ min: 10, max: 300 })
    .withMessage('Package description must be between 10 and 300 characters'),

  body('packageDetails.value')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Package value must be a positive number'),

  body('pickupLocation.city')
    .notEmpty()
    .withMessage('Pickup city is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Pickup city must be between 2 and 50 characters'),

  body('pickupLocation.address')
    .notEmpty()
    .withMessage('Pickup address is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Pickup address must be between 5 and 200 characters'),

  body('deliveryLocation.city')
    .notEmpty()
    .withMessage('Delivery city is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Delivery city must be between 2 and 50 characters'),

  body('deliveryLocation.address')
    .notEmpty()
    .withMessage('Delivery address is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Delivery address must be between 5 and 200 characters'),

  body('proposedPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Proposed price must be a positive number'),

  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Message must not exceed 500 characters'),

  body('specialInstructions')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Special instructions must not exceed 300 characters'),

  body('preferredPickupTime')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid pickup time'),

  body('preferredDeliveryTime')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid delivery time')
];

module.exports = {
  createRequestValidator
};