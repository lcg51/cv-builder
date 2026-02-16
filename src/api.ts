const CMS_API_BASE = '/cms-api';

class PayloadAPI {
	private token: string | null = null;

	private getHeaders(extra?: Record<string, string>): Record<string, string> {
		const headers: Record<string, string> = { 'Content-Type': 'application/json', ...extra };
		if (this.token) {
			headers['Authorization'] = `JWT ${this.token}`;
		}
		return headers;
	}

	async login(): Promise<void> {
		const response = await fetch(`${CMS_API_BASE}/users/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: process.env.NEXT_PUBLIC_CMS_API_EMAIL,
				password: process.env.NEXT_PUBLIC_CMS_API_PASSWORD
			})
		});
		if (!response.ok) {
			throw new Error(`CMS login failed: ${response.status}`);
		}
		const data = await response.json();
		this.token = data.token;
	}

	async get<T>(endpoint: string): Promise<T> {
		const response = await fetch(`${CMS_API_BASE}${endpoint}`, {
			headers: this.getHeaders()
		});
		if (!response.ok) {
			throw new Error(`GET ${endpoint} failed: ${response.status}`);
		}
		return response.json();
	}

	async post<T>(endpoint: string, body: unknown): Promise<T> {
		const response = await fetch(`${CMS_API_BASE}${endpoint}`, {
			method: 'POST',
			headers: this.getHeaders(),
			body: JSON.stringify(body)
		});
		if (!response.ok) {
			throw new Error(`POST ${endpoint} failed: ${response.status}`);
		}
		return response.json();
	}

	async postRaw(endpoint: string, body: unknown): Promise<Blob> {
		const response = await fetch(`${CMS_API_BASE}${endpoint}`, {
			method: 'POST',
			headers: this.getHeaders(),
			body: JSON.stringify(body)
		});
		if (!response.ok) {
			throw new Error(`POST ${endpoint} failed: ${response.status}`);
		}
		return response.blob();
	}
}

export const cmsApi = new PayloadAPI();
