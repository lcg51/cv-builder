'use server';
import { signIn, signOut } from '@/auth';

const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_API_URL ?? '/cms-api';
const USER_API_URL = `${CMS_BASE_URL}/api/app-users`;

// --- Types ---

export type AppUser = {
	id: string;
	email: string;
	name?: string;
};

type LoginResponse = {
	token: string;
	user: AppUser;
};

// --- CMS API ---

export async function payloadLogin(email: string, password: string): Promise<LoginResponse | null> {
	const res = await fetch(`${USER_API_URL}/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	});
	if (!res.ok) return null;
	return res.json();
}

export async function payloadCreateUser(data: {
	email: string;
	password: string;
	name: string;
}): Promise<AppUser | null> {
	const res = await fetch(`${USER_API_URL}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	if (!res.ok) return null;
	const result = await res.json();
	return result.doc ?? result;
}

export async function payloadFindUserByEmail(email: string): Promise<AppUser | null> {
	const res = await fetch(`${USER_API_URL}?where[email][equals]=${encodeURIComponent(email)}`, {
		headers: { 'Content-Type': 'application/json' }
	});
	if (!res.ok) return null;
	const data = await res.json();
	return data.docs?.[0] ?? null;
}

export async function payloadGetMe(token: string): Promise<AppUser | null> {
	const res = await fetch(`${USER_API_URL}/me`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `JWT ${token}`
		}
	});
	if (!res.ok) return null;
	const data = await res.json();
	return data.user ?? null;
}

export async function payloadLogout(token: string): Promise<boolean> {
	const res = await fetch(`${USER_API_URL}/logout`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `JWT ${token}`
		}
	});
	return res.ok;
}

// --- NextAuth actions ---

export const googleSignIn = async (path: string) => {
	await signIn('google', { redirectTo: path });
};

export const googleSignOut = async (path: string) => {
	await signOut({ redirectTo: path });
};

export const credentialsSignIn = async (email: string, password: string, redirectTo = '/') => {
	try {
		await signIn('credentials', { email, password, redirectTo });
	} catch (error) {
		// NextAuth throws NEXT_REDIRECT on success — re-throw it
		if (error instanceof Error && 'digest' in error) {
			const digest = (error as Error & { digest: string }).digest;
			if (digest?.startsWith('NEXT_REDIRECT')) throw error;
		}
		return { error: 'Invalid email or password' };
	}
};

export const credentialsSignUp = async (name: string, email: string, password: string, redirectTo = '/') => {
	try {
		const user = await payloadCreateUser({ name, email, password });
		if (!user) return { error: 'Failed to create account' };
		await signIn('credentials', { email, password, redirectTo });
	} catch (error) {
		if (error instanceof Error && 'digest' in error) {
			const digest = (error as Error & { digest: string }).digest;
			if (digest?.startsWith('NEXT_REDIRECT')) throw error;
		}
		return { error: 'Registration failed' };
	}
};
