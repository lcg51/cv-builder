import NextAuth from 'next-auth';
import { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { payloadLogin, payloadCreateUser, payloadFindUserByEmail } from '@/app/server-actions/auth';

export const authOptions: NextAuthConfig = {
	session: { strategy: 'jwt' },

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
		}),

		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				const result = await payloadLogin(credentials.email as string, credentials.password as string);
				if (!result) return null;

				return {
					id: result.user.id,
					email: result.user.email,
					name: result.user.name ?? null,
					image: null
				};
			}
		})
	],

	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider === 'google' && user.email) {
				try {
					const existing = await payloadFindUserByEmail(user.email);
					if (!existing) {
						const generatedPassword = `google_${account.providerAccountId}_${crypto.randomUUID()}`;
						await payloadCreateUser({
							email: user.email,
							password: generatedPassword,
							name: user.name ?? ''
						});
					}
				} catch (err) {
					console.error('Failed to sync Google user to Payload CMS:', err);
				}
			}
			return true;
		},

		async jwt({ token, user, account }) {
			if (user) {
				token.id = user.id;
				token.name = user.name;
				token.email = user.email;
				token.image = user.image;
				token.provider = account?.provider;
			}
			return token;
		},

		async session({ session, token }) {
			return {
				...session,
				user: {
					...session.user,
					id: token.id as string,
					name: token.name as string | null,
					email: token.email as string,
					image: token.image as string | null
				}
			};
		}
	},

	pages: {
		signIn: '/login'
	}
};

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut
} = NextAuth(authOptions);
