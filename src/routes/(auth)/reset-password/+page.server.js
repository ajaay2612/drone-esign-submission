import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import bcrypt from 'bcryptjs';

export const load = async ({ url }) => {
    const token = url.searchParams.get('token');

    if (!token) {
        return { validToken: false };
    }

    const user = await prisma.user.findFirst({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: {
                gt: new Date()
            }
        }
    });

    return {
        validToken: !!user,
        token
    };
};

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const token = formData.get('token');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (!password || !confirmPassword) {
            return fail(400, { error: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return fail(400, { error: 'Passwords do not match' });
        }

        if (password.length < 8) {
            return fail(400, { error: 'Password must be at least 8 characters long' });
        }

        try {
            const user = await prisma.user.findFirst({
                where: {
                    resetPasswordToken: token,
                    resetPasswordExpires: {
                        gt: new Date()
                    }
                }
            });

            if (!user) {
                return fail(400, { error: 'Invalid or expired reset token' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    resetPasswordToken: null,
                    resetPasswordExpires: null
                }
            });

        } catch (error) {
            console.error('Password reset error:', error);
            return fail(500, { error: 'Something went wrong during password reset' });
        }

        throw redirect(303, '/login?resetSuccess=true');

    }
};