import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit'


export async function load({ request, locals, url }) {
    const session = await locals.getSession();
    if (!session) {
        throw redirect(303, '/login')
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    });

    if(user.isSuperUser){
        throw redirect(303, '/admin');
    }

}
