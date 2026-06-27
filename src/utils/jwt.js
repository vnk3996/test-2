const jwt = require('jsonwebtoken');
const AppError = require('./AppError');

/**
 * Sign a full access token (for authenticated sessions)
 */
function signAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
}

/**
 * Sign a temporary token (e.g., for MFA flow)
 */
function signTempToken(payload, expiresIn = '5m') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

/**
 * Verify and decode a token
 * Throws AppError on failure
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw AppError.unauthorized('Token has expired');
        }
        throw AppError.unauthorized('Invalid token');
    }
}

module.exports = { signAccessToken, signTempToken, verifyToken };
