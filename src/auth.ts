import NextAuth from 'next-auth';
import { NextAuthConfig } from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@/lib/db';

export const authOptions: NextAuthConfig = {
	adapter: DrizzleAdapter(db),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code'
				}
			}
		})
	],
	callbacks: {
		session: ({ session, user }) => ({
			...session,
			user: {
				...session.user,
				id: user.id
			}
		})
	}
};

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut
} = NextAuth(authOptions);
