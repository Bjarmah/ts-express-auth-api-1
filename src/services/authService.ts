import { googleClient } from '../config/googleAuth';
import { User, UserRole } from '../models/user';
import AppDataSource from '../config/database';
import { generateToken } from '../utils/jwt';
import logger from '../utils/logger';

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    async googleLogin(code: string) {
        try {
            // Exchange authorization code for tokens
            const { tokens } = await googleClient.getToken(code);
            const ticket = await googleClient.verifyIdToken({
                idToken: tokens.id_token!,
                audience: process.env.GOOGLE_CLIENT_ID

            });

            const payload = ticket.getPayload();
            if (!payload) {
                throw new Error('Invalid Google token');
            }

            // Check if user exists
            let user = await this.userRepository.findOne({
                where: { email: payload.email }
            });

            if (!user) {
                // Create new user if doesn't exist
                user = new User();
                user.email = payload.email!;
                user.googleId = payload.sub;
                user.role = UserRole.USER; // Default role
                user.isEmailVerified = payload.email_verified || false;

                await this.userRepository.save(user);
                logger.info(`New user created via Google OAuth: ${user.email}`);
            } else {
                // Update existing user's Google ID if not set
                if (!user.googleId) {
                    user.googleId = payload.sub;
                    await this.userRepository.save(user);
                }
            }

            // Generate JWT token
            const jwt = generateToken(user);

            return {
                token: jwt,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            };
        } catch (error) {
            logger.error('Google OAuth error:', error);
            throw error;
        }
    }
}
