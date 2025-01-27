import { fail, redirect } from '@sveltejs/kit'
import { AuthError } from '@auth/core/errors'

export const load = async ({ locals }) => {
  const session = await locals.getSession()
  if (session) {
    throw redirect(303, '/dashboard')
  }
  return {}
}

export const actions = {
  default: async (event) => {
    const formData = await event.request.formData()
    const email = formData.get('email')
    const password = formData.get('password')

    if (!email || !password) {
      return fail(400, {
        error: 'Missing email or password'
      })
    }

    const url = new URL('/auth/callback/credentials', event.url.origin)
    
    try {
      const response = await event.fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      // Get the redirect location from headers
      const location = response.headers.get('location')

      // Check if the redirect contains an error parameter
      if (location?.includes('error=')) {
        return fail(400, {
          error: 'Invalid credentials'
        })
      }

      // If no error in location and we got a 302, it's a successful login
      if (response.status === 302) {
        throw redirect(303, '/dashboard')
      }

      // Fallback error
      return fail(400, {
        error: 'Something went wrong'
      })
    } catch (error) {
      if (error instanceof Response || error.status === 303) {
        throw error
      }

      console.error('Login error:', error)
      return fail(500, {
        error: 'Something went wrong'
      })
    }
  }
}