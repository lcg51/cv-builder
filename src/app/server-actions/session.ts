'use server';
import { signIn, signOut as googleSignOut } from '@/auth';

export const signOut = async () => {
	await googleSignOut({ redirectTo: '/login' });
};

export const googleSignIn = async () => {
	await signIn('google', { redirectTo: '/admin' });
};
