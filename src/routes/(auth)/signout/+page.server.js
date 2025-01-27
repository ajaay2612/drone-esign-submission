import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export const load = async (event) => {
    const url = new URL('/auth/signout', event.url.origin);
    
    try {
        const response = await event.fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        // Get the redirect location from headers
        const location = response.headers.get('location');

        // Check if there's an error in the redirect URL
        if (location?.includes('error=')) {
            return fail(400, {
                error: 'Failed to sign out'
            });
        }

        // If we got a successful response, redirect to home
        if (response.status === 200 || response.status === 302) {
            throw redirect(303, '/');
        }

        // Fallback error
        return fail(400, {
            error: 'Something went wrong during sign out'
        });
    } catch (error) {
        if (error instanceof Response || error.status === 303) {
            throw error;
        }

        console.error('Signout error:', error);
        return fail(500, {
            error: 'Something went wrong'
        });
    }
};