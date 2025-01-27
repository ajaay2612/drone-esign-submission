import { fail } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import crypto from 'crypto';
import { sendEmail } from '$lib/email'; // You'll need to implement this
import { env } from '$env/dynamic/public';

let domain = env.PUBLIC_DOMAIN;

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const email = formData.get('email');

        if (!email) {
            return fail(400, { error: 'Email is required' });
        }

        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                // Still return success to prevent email enumeration
                return { success: true };
            }

            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

            await prisma.user.update({
                where: { email },
                data: {
                    resetPasswordToken: resetToken,
                    resetPasswordExpires: resetExpires
                }
            });

            // Send email with reset link
            const resetUrl = `${domain}/reset-password?token=${resetToken}`;

            await sendEmail({
                to: email,
                subject: 'Password Reset Request',
                text: `To reset your password, click this link: ${resetUrl}`
            });

            return { success: true };
        } catch (error) {
            console.error('Password reset request error:', error);
            return fail(500, {
                error: 'Something went wrong. Please try again later.'
            });
        }
    }
};