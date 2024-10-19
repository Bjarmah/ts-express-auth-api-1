import { OAuth2Client } from 'google-auth-library';
import * as dotenv from 'dotenv';
dotenv.config();

export const googleClient = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.APP_URL}/auth/google/callback`
});