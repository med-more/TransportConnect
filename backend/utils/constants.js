const CONSTANTS = {
  // User roles
  USER_ROLES: {
    ADMIN: 'admin',
    CONDUCTOR: 'conductor',
    SENDER: 'sender'
  },

  // Request statuses
  REQUEST_STATUS: {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
  },

  // Announcement statuses
  ANNOUNCEMENT_STATUS: {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    FULL: 'full'
  },

  // Vehicle types
  VEHICLE_TYPES: {
    CAR: 'car',
    VAN: 'van',
    TRUCK: 'truck',
    MOTORCYCLE: 'motorcycle'
  },

  // Cargo types
  CARGO_TYPES: {
    FRAGILE: 'fragile',
    ELECTRONICS: 'electronics',
    FURNITURE: 'furniture',
    CLOTHING: 'clothing',
    FOOD: 'food',
    BOOKS: 'books',
    AUTOMOTIVE: 'automotive',
    OTHER: 'other'
  },

  // Price types
  PRICE_TYPES: {
    FIXED: 'fixed',
    NEGOTIABLE: 'negotiable',
    PER_KG: 'per_kg'
  },

  // Rating criteria
  RATING_CRITERIA: {
    PUNCTUALITY: 'punctuality',
    COMMUNICATION: 'communication',
    PACKAGE_CONDITION: 'packageCondition',
    PROFESSIONALISM: 'professionalism'
  },

  // Email types
  EMAIL_TYPES: {
    WELCOME: 'welcome',
    NEW_REQUEST: 'new_request',
    REQUEST_ACCEPTED: 'request_accepted',
    REQUEST_REJECTED: 'request_rejected',
    PICKUP_CONFIRMED: 'pickup_confirmed',
    DELIVERY_CONFIRMED: 'delivery_confirmed',
    PASSWORD_RESET: 'password_reset'
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // Rate limiting
  RATE_LIMITS: {
    GENERAL: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX: 100
    },
    AUTH: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX: 5
    },
    SEARCH: {
      WINDOW_MS: 60 * 1000, // 1 minute
      MAX: 30
    }
  },

  // File upload limits
  FILE_LIMITS: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  },

  // Moroccan cities (major ones)
  MOROCCAN_CITIES: [
    'Casablanca', 'Rabat', 'Fès', 'Marrakech', 'Agadir', 'Tanger', 
    'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'Mohammedia',
    'Khouribga', 'El Jadida', 'Béni Mellal', 'Nador', 'Taza',
    'Settat', 'Berrechid', 'Khemisset', 'Inezgane', 'Ksar El Kebir',
    'Larache', 'Guelmim', 'Errachidia', 'Essaouira', 'Ouarzazate'
  ],

  // Success messages
  SUCCESS_MESSAGES: {
    USER_REGISTERED: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    PROFILE_UPDATED: 'Profile updated successfully',
    ANNOUNCEMENT_CREATED: 'Announcement created successfully',
    REQUEST_CREATED: 'Request created successfully',
    REQUEST_ACCEPTED: 'Request accepted successfully',
    REQUEST_REJECTED: 'Request rejected successfully',
    RATING_CREATED: 'Rating created successfully'
  },

  // Error messages
  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_NOT_FOUND: 'User not found',
    UNAUTHORIZED: 'Not authorized',
    VALIDATION_ERROR: 'Validation failed',
    SERVER_ERROR: 'Internal server error',
    TOKEN_EXPIRED: 'Token expired',
    ACCOUNT_SUSPENDED: 'Account is suspended'
  }
};

module.exports = CONSTANTS;