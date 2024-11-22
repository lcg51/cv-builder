import NextAuth from 'next-auth';
import { NextAuthConfig } from 'next-auth';
// import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthConfig = {
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
		// GitHubProvider({
		//   clientId: process.env.GITHUB_ID ?? "",
		//   clientSecret: process.env.GITHUB_SECRET ?? "",
		// }),
		// basePath: "/api/auth",
		// secret: process.env.NEXTAUTH_SECRET,
	]
};

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut
} = NextAuth(authOptions);
