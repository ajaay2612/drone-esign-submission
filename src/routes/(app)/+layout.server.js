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


    
    let userData = ["firstName", "lastName", "dateOfBirth", "phoneNumber","countryCode", "streetAddress", "city", "state","stateCode",  "zipCode"];
    let userDataComplete = true;

    for (let field of userData) {
        if (!user[field]) {
            userDataComplete = false;
            break;
        }
    }   

    if (!userDataComplete && url.pathname !== '/dashboard' && !user.isSuperUser) {
        throw redirect(303, '/dashboard')
    }


    return {
        user: session.user,
        userData:{
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: user.dateOfBirth,
            phoneNumber: user.phoneNumber,
            countryCode: user.countryCode,
            streetAddress: user.streetAddress,
            city: user.city,
            state: user.state,
            stateCode: user.stateCode,
            zipCode: user.zipCode,
            notifications: user.notifications || [],
            superUser : user.isSuperUser
        },
        userDataComplete
    }

}
