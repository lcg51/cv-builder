const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_API_URL ?? '/cms-api';

type PayloadUser = {
	id: string;
	email: string;
	name?: string;
};

type PayloadLoginResponse = {
	token: string;
	user: PayloadUser;
};

export async function payloadLogin(email: string, password: string): Promise<PayloadLoginResponse | null> {
	const res = await fetch(`${CMS_BASE_URL}/api/app-users/login`, {
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
}): Promise<PayloadUser | null> {
	const res = await fetch(`${CMS_BASE_URL}/api/app-users`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	if (!res.ok) return null;
	const result = await res.json();
	return result.doc ?? result;
}

export async function payloadFindUserByEmail(email: string): Promise<PayloadUser | null> {
	const res = await fetch(`${CMS_BASE_URL}/app-users?where[email][equals]=${encodeURIComponent(email)}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) return null;
	const data = await res.json();
	return data.docs?.[0] ?? null;
}

export async function payloadGetMe(token: string): Promise<PayloadUser | null> {
	const res = await fetch(`${CMS_BASE_URL}/api/app-users/me`, {
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
	const res = await fetch(`${CMS_BASE_URL}/api/app-users/logout`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `JWT ${token}`
		}
	});
	return res.ok;
}
