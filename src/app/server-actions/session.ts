'use server';
import { signIn, signOut } from '@/auth';

export const googleSignOut = async (path: string) => {
	await signOut({ redirectTo: path });
};

export const googleSignIn = async (path: string) => {
	await signIn('google', { redirectTo: path });
};

export const credentialsSignIn = async (email: string, password: string) => {
	try {
		await signIn('credentials', {
			email,
			password,
			redirectTo: '/'
		});
	} catch (error) {
		// NextAuth throws NEXT_REDIRECT on success — re-throw it
		if (error instanceof Error && 'digest' in error) {
			const digest = (error as Error & { digest: string }).digest;
			if (digest?.startsWith('NEXT_REDIRECT')) {
				throw error;
			}
		}
		return { error: 'Invalid email or password' };
	}
};
