// In-memory OTP Cache with global binding to prevent loss during Next.js hot reloads in development
if (!global.otpCache) {
  global.otpCache = new Map();
}

const cache = global.otpCache;

/**
 * Save OTP and associated contact form data.
 * @param {string} email - Visitor's email address
 * @param {object} data - { name, subject, message, otp }
 * @param {number} ttlMinutes - Expiry time in minutes (default 5)
 */
export function saveOTP(email, data, ttlMinutes = 5) {
  const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
  cache.set(email.toLowerCase(), {
    ...data,
    expiresAt,
  });
}

/**
 * Retrieve OTP data for a given email.
 * @param {string} email - Visitor's email address
 * @returns {object|null} The cached data or null if not found
 */
export function getOTP(email) {
  const record = cache.get(email.toLowerCase());
  if (!record) return null;

  // Check if expired
  if (Date.now() > record.expiresAt) {
    cache.delete(email.toLowerCase());
    return null;
  }

  return record;
}

/**
 * Verify OTP for an email.
 * @param {string} email - Visitor's email address
 * @param {string} otp - The 6-digit OTP entered by the user
 * @returns {boolean} True if matches and is not expired
 */
export function verifyOTP(email, otp) {
  const record = getOTP(email);
  if (!record) return false;

  // Check OTP matches (case-insensitive and trimmed)
  const isMatch = record.otp.toString().trim() === otp.toString().trim();
  return isMatch;
}

/**
 * Delete OTP cache for an email.
 * @param {string} email - Visitor's email address
 */
export function deleteOTP(email) {
  cache.delete(email.toLowerCase());
}
