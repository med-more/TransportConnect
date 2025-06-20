const crypto = require('crypto');

class Helpers {
  // Generate random string
  static generateRandomString(length = 8) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }

  // Generate tracking number
  static generateTrackingNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `TC${timestamp}${random}`;
  }

  // Calculate distance between two coordinates (Haversine formula)
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  static toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Format price in MAD
  static formatPrice(price) {
    return new Intl.NumberFormat('ar-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  }

  // Validate Moroccan phone number
  static isValidMoroccanPhone(phone) {
    const phoneRegex = /^(\+212|0)(5|6|7)[0-9]{8}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  // Generate slug from text
  static generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Paginate results
  static paginate(page = 1, limit = 10) {
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit))); // Max 100 items per page
    const skip = (pageNumber - 1) * limitNumber;
    
    return {
      page: pageNumber,
      limit: limitNumber,
      skip
    };
  }

  // Build pagination response
  static buildPaginationResponse(page, limit, total, data) {
    const totalPages = Math.ceil(total / limit);
    
    return {
      data,
      pagination: {
        current: page,
        total: totalPages,
        count: data.length,
        totalDocuments: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        next: page < totalPages ? page + 1 : null,
        prev: page > 1 ? page - 1 : null
      }
    };
  }

  // Sanitize search query
  static sanitizeSearchQuery(query) {
    if (!query || typeof query !== 'string') return '';
    
    return query
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🐛 ${message}`, meta);
      this.writeToFile') // Escape regex special characters
      .substring(0, 100); // Limit length
  }

  // Generate OTP
  static generateOTP(length = 6) {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  // Check if date is within range
  static isDateInRange(date, startDate, endDate) {
    const checkDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return checkDate >= start && checkDate <= end;
  }

  // Calculate package volume
  static calculateVolume(dimensions) {
    const { length, width, height } = dimensions;
    return (length * width * height) / 1000000; // Convert cm³ to m³
  }

  // Check if package fits in available space
  static packageFits(packageDimensions, maxDimensions) {
    return packageDimensions.length <= maxDimensions.length &&
           packageDimensions.width <= maxDimensions.width &&
           packageDimensions.height <= maxDimensions.height;
  }

  // Format duration
  static formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
  }

  // Validate coordinates
  static isValidCoordinates(lat, lng) {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  // Clean object (remove null/undefined values)
  static cleanObject(obj) {
    const cleaned = {};
    for (const key in obj) {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
        cleaned[key] = obj[key];
      }
    }
    return cleaned;
  }
}

module.exports = Helpers;