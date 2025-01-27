import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const actions = {
    default: async ({ request, locals }) => {
        const session = await locals.getSession();

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });
        
        try {
 
            const formData = await request.formData();

            // update user record
            const dateOfBirthString = formData.get('dateOfBirth');
            const dateOfBirth = dateOfBirthString ? new Date(dateOfBirthString) : null;

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    firstName: formData.get('firstName') || null,
                    lastName: formData.get('lastName') || null,
                    dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null,
                    phoneNumber: formData.get('phoneNumber') || null,
                    countryCode: formData.get('countryCode') || null,
                    streetAddress: formData.get('streetAddress') || null,
                    city: formData.get('city') || null,
                    state: formData.get('state') || null,
                    stateCode: formData.get('stateCode') || null,
                    zipCode: formData.get('zipCode') || null,
                },
            });


        } catch (error) {
            console.error('User data save error', error);
            return fail(500, {
                error: 'Failed to process user data'
            });
        }
        

        throw redirect(303,"/dashboard");

    }
};