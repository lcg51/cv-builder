'use server';
import { signIn, signOut } from '@/auth';

export const googleSignOut = async (path: string) => {
	await signOut({ redirectTo: path });
};

export const googleSignIn = async (path: string) => {
	await signIn('google', { redirectTo: path });
};
