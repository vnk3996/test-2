const { TOTP, Secret } = require("otpauth");
const QRCode = require('qrcode');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');

const ISSUER = 'NodeExpApp';

const setUp = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw AppError.notFound('User not found');
    if (user.mfaEnabled) throw AppError.badRequest('MFA is already enabled');

    const secret = new Secret();

    const totp = new TOTP({
        issuer: ISSUER,
        label: user.email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret,
    });

    // Save secret to DB (not yet enabled)
    user.mfaSecret = secret.base32;
    await user.save();

    // Generate QR code
    const otpauthUrl = totp.toString();
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    return {
        qrCode: qrCodeDataUrl,
        manualKey: secret.base32,
        otpauthUrl,
    };
};

const verifySetup = async (userId, code) => {
    const user = await User.findByPk(userId);
    if (!user) throw AppError.notFound('User not found');
    if (!user.mfaSecret) throw AppError.badRequest('MFA setup not initiated');
    if (user.mfaEnabled) throw AppError.badRequest('MFA is already enabled');

    const isValid = verifyCode(user.mfaSecret, user.email, code);
    if (!isValid) throw AppError.badRequest('Invalid code. Please try again.');

    user.mfaEnabled = true;
    await user.save();

    return { message: 'MFA enabled successfully' };
};

const validateLogin = async (userId, code) => {
    const user = await User.findByPk(userId);
    if (!user) throw AppError.notFound('User not found');
    if (!user.mfaEnabled || !user.mfaSecret) {
        throw AppError.badRequest('MFA is not enabled for this user');
    }

    const isValid = verifyCode(user.mfaSecret, user.email, code);
    if (!isValid) throw AppError.unauthorized('Invalid MFA code');

    return user;
};

function verifyCode(base32Secret, email, code) {
    const totp = new TOTP({
        issuer: ISSUER,
        label: email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: Secret.fromBase32(base32Secret),
    });

    // window: 1 allows 1 period before/after (handles slight time drift)
    const result = totp.validate({ token: code, window: 1 });
    return result !== null;
}

module.exports = { setUp, verifySetup, validateLogin };
