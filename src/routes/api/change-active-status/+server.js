import prisma from '$lib/prisma';


export async function POST({ request }) {
    const { droneId } = await request.json();
    try {

        let drone = await prisma.drone.findUnique({
            where: { id: droneId }
        });

        drone = await prisma.drone.update({
            where: { id: droneId },
            data: { active: drone.active ? false : true }
        });
        
        return new Response(JSON.stringify({ success: true, status: drone.active }));
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
 }