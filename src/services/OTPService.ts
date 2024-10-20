import nodemailer from 'nodemailer'
import logger from '../utils/logger';
import * as dotenv from 'dotenv';

dotenv.config();


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io', // Use Mailtrap for testing
    port: parseInt(process.env.SMTP_PORT || '2525'),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendOTPEmail = async (email: string, otp: string) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'test@yourdomain.com',
        to: email,
        subject: 'Your Login OTP',
        html: `
            <h1>Your OTP Code</h1>
            <p>Your verification code is: <strong>${otp}</strong></p>
            <p>This code will expire in 15 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
        `
    };

    try {
        if (process.env.NODE_ENV === 'test') {
            logger.info('Test mode: Skipping email send');
            return;
        }
        await transporter.sendMail(mailOptions);
        logger.info(`OTP email sent to ${email}`);
    } catch (error) {
        logger.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};

export const generateOTP = Math.floor(100000 + Math.random() * 900000).toString();


