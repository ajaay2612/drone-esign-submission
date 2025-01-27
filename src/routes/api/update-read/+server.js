import { fail, redirect, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { env } from '$env/dynamic/private';


export async function GET({ request, locals }) {

    const session = await locals.getSession();
    if (!session) {
        throw redirect(303, '/login');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        for (let i = 0; i < user.notifications.length; i++) {
            user.notifications[i].read = true;
        }

        await prisma.user.update({  
            where: { email: session.user.email },
            data: { notifications: user.notifications }
        });

        return json({ message: 'Notifications updated', notifications: user.notifications});
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}