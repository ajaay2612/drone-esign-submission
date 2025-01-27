import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

let SMTP_HOST = env.SMTP_HOST
let SMTP_PORT = env.SMTP_PORT
let SMTP_USER = env.SMTP_USER
let SMTP_PASS = env.SMTP_PASS
let SMTP_FROM = env.SMTP_FROM


const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    }
});

export async function sendEmail({ to, subject, text, html }) {
    try {
        await transporter.sendMail({
            from:SMTP_FROM,
            to,
            subject,
            text,
            html
        });
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
}