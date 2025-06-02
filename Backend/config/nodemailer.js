import nodemailer from "nodemailer"

// Create transporter with debug logging
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    debug: true,
    logger: true,
    tls: {
        rejectUnauthorized: false // Only use this in development
    }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('SMTP Configuration Error:', error);
        console.error('Current SMTP Configuration:', {
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            user: process.env.SMTP_USER ? 'Set' : 'Not Set',
            pass: process.env.SMTP_PASS ? 'Set' : 'Not Set',
            secure: true
        });
    } else {
        console.log('SMTP Server is ready to send emails');
        console.log('SMTP Configuration:', {
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            user: process.env.SMTP_USER,
            secure: true
        });
    }
});

export default transporter;