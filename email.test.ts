import { sendOTPEmail } from './src/services/OTPService' // Update the path
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { generateOTP } from './src/services/OTPService'; // Update or remove if you have a different OTP generation method

dotenv.config();

// Test configuration
const TEST_EMAIL = 'your-test-email@example.com'; // Replace with your test email
const TEST_OTP = '123456'; // For testing purposes

async function verifySmtpConnection() {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
        port: parseInt(process.env.SMTP_PORT || '2525'),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        console.log('Verifying SMTP configuration...');
        const verification = await transporter.verify();
        console.log('✅ SMTP configuration is valid');
        return true;
    } catch (error) {
        console.error('❌ SMTP verification failed:', error);
        console.log('Current SMTP Configuration:');
        console.log('Host:', process.env.SMTP_HOST);
        console.log('Port:', process.env.SMTP_PORT);
        console.log('User:', process.env.SMTP_USER ? '✓ Set' : '✗ Not Set');
        console.log('Password:', process.env.SMTP_PASS ? '✓ Set' : '✗ Not Set');
        return false;
    }
}

async function testSendOTP() {
    console.log('\nTesting OTP email sending...');
    console.log(`Sending test OTP to: ${TEST_EMAIL}`);

    try {
        await sendOTPEmail(TEST_EMAIL, TEST_OTP);
        console.log('✅ Test email sent successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to send test email:', error);
        return false;
    }
}

async function testEmailTemplateRendering() {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
        port: parseInt(process.env.SMTP_PORT || '2525'),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'test@yourdomain.com',
        to: TEST_EMAIL,
        subject: 'Test Email Template',
        html: `
            <h1>Test Email Template</h1>
            <p>This is a test of the email template with OTP: <strong>${TEST_OTP}</strong></p>
            <p>Template variables:</p>
            <ul>
                <li>FROM: ${process.env.EMAIL_FROM || 'test@yourdomain.com'}</li>
                <li>TO: ${TEST_EMAIL}</li>
                <li>OTP: ${TEST_OTP}</li>
            </ul>
        `
    };

    try {
        console.log('\nTesting email template rendering...');
        await transporter.sendMail(mailOptions);
        console.log('✅ Template test email sent successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to send template test email:', error);
        return false;
    }
}

async function runAllTests() {
    console.log('🚀 Starting SMTP and Email Tests\n');

    // Check if required environment variables are set
    console.log('Checking environment variables...');
    const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'EMAIL_FROM'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:', missingVars.join(', '));
        console.log('\nPlease set the following variables in your .env file:');
        console.log(`
SMTP_HOST=your-smtp-host
SMTP_PORT=your-smtp-port
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
EMAIL_FROM=your-sender-email
        `);
        return;
    }

    // Run tests
    const results = {
        smtpConnection: await verifySmtpConnection(),
        sendOTP: await testSendOTP(),
        templateRendering: await testEmailTemplateRendering()
    };

    // Print summary
    console.log('\n📋 Test Summary:');
    console.log('--------------');
    console.log('SMTP Connection:', results.smtpConnection ? '✅ Pass' : '❌ Fail');
    console.log('Send OTP:', results.sendOTP ? '✅ Pass' : '❌ Fail');
    console.log('Template Rendering:', results.templateRendering ? '✅ Pass' : '❌ Fail');

    // Overall status
    const allPassed = Object.values(results).every(result => result === true);
    console.log('\n🏁 Final Result:', allPassed ? '✅ All tests passed!' : '❌ Some tests failed');
}

// Run the tests
runAllTests().catch(console.error);