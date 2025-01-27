
import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit'


export async function GET({ request, locals }) {
    const url = new URL(request.url);
    const droneId = url.searchParams.get('droneId');

    const session = await locals.getSession();
    if (!session) {
        throw redirect(303, '/login');
    }


    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    });


    let targetUrl = null;
  
    if (user.isSuperUser){
        targetUrl = `/admin/${droneId}`;
    }else{
        targetUrl = `/dashboard/view-fleet/${droneId}`;
    }
    
    throw redirect(303, targetUrl)
}