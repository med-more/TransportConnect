const { body } = require('express-validator');

const locationValidator = [
  body('city')
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),

  body('address')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Address must not exceed 200 characters'),

  body('coordinates.lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('coordinates.lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];

const createAnnouncementValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),

  body('departure.city')
    .notEmpty()
    .withMessage('Departure city is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Departure city must be between 2 and 50 characters'),

  body('destination.city')
    .notEmpty()
    .withMessage('Destination city is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Destination city must be between 2 and 50 characters'),

  body('departureDate')
    .isISO8601()
    .withMessage('Please provide a valid departure date')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      if (date <= now) {
        throw new Error('Departure date must be in the future');
      }
      return true;
    }),

  body('arrivalDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid arrival date')
    .custom((value, { req }) => {
      if (value && req.body.departureDate) {
        const arrivalDate = new Date(value);
        const departureDate = new Date(req.body.departureDate);
        if (arrivalDate <= departureDate) {
          throw new Error('Arrival date must be after departure date');
        }
      }
      return true;
    }),

  body('maxDimensions.length')
    .isFloat({ min: 1 })
    .withMessage('Length must be a positive number'),

  body('maxDimensions.width')
    .isFloat({ min: 1 })
    .withMessage('Width must be a positive number'),

  body('maxDimensions.height')
    .isFloat({ min: 1 })
    .withMessage('Height must be a positive number'),

  body('maxWeight')
    .isFloat({ min: 0.1 })
    .withMessage('Maximum weight must be a positive number'),

  body('availableCapacity')
    .isFloat({ min: 0.1 })
    .withMessage('Available capacity must be a positive number'),

  body('acceptedCargoTypes')
    .isArray()
    .withMessage('Accepted cargo types must be an array')
    .custom((value) => {
      const validTypes = ['fragile', 'electronics', 'furniture', 'clothing', 'food', 'books', 'automotive', 'other'];
      if (!value.every(type => validTypes.includes(type))) {
        throw new Error('Invalid cargo type provided');
      }
      return true;
    }),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('priceType')
    .optional()
    .isIn(['fixed', 'negotiable', 'per_kg'])
    .withMessage('Price type must be fixed, negotiable, or per_kg'),

  body('vehicleType')
    .isIn(['car', 'van', 'truck', 'motorcycle'])
    .withMessage('Vehicle type must be car, van, truck, or motorcycle'),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('specialInstructions')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Special instructions must not exceed 300 characters')
];

const updateAnnouncementValidator = [
  body('title')
    .optional()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),

  body('departureDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid departure date')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      if (date <= now) {
        throw new Error('Departure date must be in the future');
      }
      return true;
    }),

  body('maxWeight')
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage('Maximum weight must be a positive number'),

  body('availableCapacity')
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage('Available capacity must be a positive number'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('status')
    .optional()
    .isIn(['active', 'completed', 'cancelled', 'full'])
    .withMessage('Status must be active, completed, cancelled, or full'),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
];

module.exports = {
  createAnnouncementValidator,
  updateAnnouncementValidator
};