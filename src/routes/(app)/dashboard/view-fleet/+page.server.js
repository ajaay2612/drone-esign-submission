
import prisma from '$lib/prisma';



export async function load({ parent }) {
    let {user} = await parent();

    const userData = await prisma.user.findUnique({
        where: {
            email: user.email
        },
        include: {
            Drone: true
        } 
    });

    let inTransfer = await prisma.drone.findMany({
        where: {
            futureOwnerId: userData.id
        }
    });
    inTransfer = inTransfer.map(drone => {
        return {
            ...drone,
            notActualOwner: true
        }
    })


    let transfered = await prisma.previousOwnership.findMany({
        where: {
            userId: userData.id
        },
        include: {
            drone: true
        }
    });

    transfered = transfered.map(drone => drone.drone)

    transfered = transfered.map(drone => {
        return {
            ...drone,
            notActualOwner : true
        }
    })

    const drones = userData.Drone

    let activeDrones = [drones.filter(drone => drone.signatureStatus === 'registered'), drones.filter(drone => drone.signatureStatus === 'registered').length];
    let rejectedDrones = [drones.filter(drone => drone.signatureStatus === 'declined'), drones.filter(drone => drone.signatureStatus === 'declined').length];
    let pendingDrones = [drones.filter(drone => drone.signatureStatus === 'pending' || drone.signatureStatus === 'sent'), drones.filter(drone => drone.signatureStatus === 'pending' || drone.signatureStatus === 'sent').length];
    
    return {
        drones,
        activeDrones,
        rejectedDrones ,
        pendingDrones ,
        inTransfer,
        transfered 
        
    }
}