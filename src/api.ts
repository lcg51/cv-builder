const CMS_API_BASE = '/cms-api';

class PayloadAPI {
	private token: string | null = null;
	private cache = new Map<string, { data: unknown; timestamp: number }>();
	private readonly cacheTTL = 5 * 60 * 1000; // 5 minutes

	private getHeaders(extra?: Record<string, string>): Record<string, string> {
		const headers: Record<string, string> = { 'Content-Type': 'application/json', ...extra };
		if (this.token) {
			headers['Authorization'] = `JWT ${this.token}`;
		}
		return headers;
	}

	setToken(token: string): void {
		this.token = token;
	}

	async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
		const query = params ? `?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]))}` : '';
		const url = `${endpoint}${query}`;

		const cached = this.cache.get(url);
		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			return cached.data as T;
		}

		const response = await fetch(`${CMS_API_BASE}${url}`, {
			headers: this.getHeaders()
		});
		if (!response.ok) {
			throw new Error(`GET ${url} failed: ${response.status}`);
		}
		const data = await response.json();
		this.cache.set(url, { data, timestamp: Date.now() });
		return data;
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
