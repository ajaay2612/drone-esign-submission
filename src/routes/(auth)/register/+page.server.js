import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';  // Make sure it's imported separately
import bcrypt from 'bcryptjs';
import prisma from '$lib/prisma';

export const load = async ({ locals }) => {
  const session = await locals.getSession();
  if (session) {
    throw redirect(303, '/dashboard');
  }
  return {};
};

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const name = formData.get('name');

    if (!email || !password || !confirmPassword) {
      return fail(400, {
        error: 'All fields are required'
      });
    }

    if (password !== confirmPassword) {
      return fail(400, {
        error: 'Passwords do not match'
      });
    }

    if (password.length < 8) {
      return fail(400, {
        error: 'Password must be at least 8 characters long'
      });
    }

    // Move the try-catch inside the core logic
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return fail(400, {
        error: 'User already exists'
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name
        }
      });
    } catch (err) {
      console.error('Registration error:', err);
      return fail(500, {
        error: 'Something went wrong during registration'
      });
    }

    // Move the redirect outside of try-catch
    throw redirect(303, '/login?registered=true');
  }
};