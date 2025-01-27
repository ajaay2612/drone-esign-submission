import { redirect } from '@sveltejs/kit'
import prisma from '$lib/prisma';

export const load = async ({ locals }) => {
    const session = await locals.getSession()

    if (!session) {
        throw redirect(303, '/login')
    } else {

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });

        if (user.isSuperUser) {
            throw redirect(303, '/admin')
        }else{
            throw redirect(303, '/dashboard')
        }

    }
}