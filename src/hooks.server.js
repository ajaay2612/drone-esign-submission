import { SvelteKitAuth } from '@auth/sveltekit'
import CredentialsProvider from '@auth/core/providers/credentials'
import prisma from '$lib/prisma'
import bcrypt from 'bcryptjs'
import Google from '@auth/core/providers/google'
import { env } from '$env/dynamic/private';

let AUTH_SECRET = env.AUTH_SECRET
let GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID
let GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET


export const handle = async ({ event, resolve }) => {
  const auth = await SvelteKitAuth({
    providers: [
      Google({
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        profile(profile) {
          return {
            id: profile.sub,
            email: profile.email,
            name: profile.name,
            image: profile.picture,
          }
        }
      }),
      CredentialsProvider({
        name: 'credentials',
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          try {
            const user = await prisma.user.findUnique({
              where: { email: credentials.email }
            })

            if (!user) {
              return null
            }

            const isValid = await bcrypt.compare(credentials.password, user.password)

            if (!isValid) {
              return null
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name
            }
          } catch (error) {
            console.error('Auth error:', error)
            return null
          }
        }
      })
    ],
    callbacks: {
      async signIn({ user, account, profile }) {
        if (account?.provider === 'google') {
          try {
            const existingUser = await prisma.user.findUnique({
              where: { email: user.email },
              include: {
                Account: true
              }
            });
    
            if (!existingUser) {
              // Create new user and account
              await prisma.user.create({
                data: {
                  email: user.email,
                  name: user.name,
                  image: user.image,
                  password: await bcrypt.hash(crypto.randomUUID(), 10),
                  Account: {
                    create: {
                      type: account.type,
                      provider: account.provider,
                      providerAccountId: account.providerAccountId,
                      refresh_token: account.refresh_token,
                      access_token: account.access_token,
                      expires_at: account.expires_at,
                      token_type: account.token_type,
                      scope: account.scope,
                      id_token: account.id_token,
                      session_state: account.session_state
                    }
                  }
                }
              });
            } else if (!existingUser.Account.some(acc => acc.provider === 'google')) {
              // If user exists but doesn't have a Google account linked
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state
                }
              });
            }
          } catch (error) {
            console.error('Error handling OAuth sign in:', error);
            return false;
          }
        }
        return true;
      }
    },
    secret: AUTH_SECRET,
    trustHost: true,
    debug: false, // Remove in production
    session: {
      strategy: 'jwt'
    },
    pages: {
      signIn: '/login'
    }
  })

  return auth.handle({ event, resolve })
}