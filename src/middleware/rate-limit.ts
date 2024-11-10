import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes max
    max: 5, // 5 attempts
    message: 'Too many login attempts, please try again later',

});