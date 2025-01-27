
import prisma from '$lib/prisma';



export async function load({ parent }) {

    const allDrones = await prisma.drone.findMany({
        include: {
            user: true 
        }
    });
        
    let activeDrones = [allDrones.filter(drone => drone.signatureStatus === 'registered'), allDrones.filter(drone => drone.signatureStatus === 'registered').length];
    let rejectedDrones = [allDrones.filter(drone => drone.signatureStatus === 'declined'), allDrones.filter(drone => drone.signatureStatus === 'declined').length];
    let pendingDrones = [allDrones.filter(drone => drone.signatureStatus === 'pending' || drone.signatureStatus === 'sent'), allDrones.filter(drone => drone.signatureStatus === 'pending' || drone.signatureStatus === 'sent').length];
    
    return {
        allDrones,
        activeDrones,
        rejectedDrones ,
        pendingDrones ,        
    }
}