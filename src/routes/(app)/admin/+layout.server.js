
import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit';


export async function load({ locals }) {
    const session = await locals.getSession();

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    });

    if(!user.isSuperUser){
        throw redirect(303, '/dashboard');
    }

   
}