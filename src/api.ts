// Strapi API configuration
const STRAPI_CONFIG = {
	baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337',
	token: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN,
	defaultHeaders: {
		'Content-Type': 'application/json'
	},
	defaultOptions: {
		next: { revalidate: 60 }
	}
};

// Query parameter types
export interface StrapiQueryParams {
	populate?: string | string[];
	filters?: Record<string, any>;
	sort?: string | string[];
	pagination?: {
		page?: number;
		pageSize?: number;
		start?: number;
		limit?: number;
	};
	fields?: string | string[];
	publicationState?: 'live' | 'preview';
	locale?: string | string[];
	[key: string]: any;
}

// Request options interface
export interface StrapiRequestOptions extends RequestInit {
	queryParams?: StrapiQueryParams;
}

// Generic Strapi API wrapper
export class StrapiAPI {
	private baseURL: string;
	private token: string | undefined;
	private defaultHeaders: Record<string, string>;
	private defaultOptions: RequestInit;

	constructor(config = STRAPI_CONFIG) {
		this.baseURL = config.baseURL;
		this.token = config.token;
		this.defaultHeaders = config.defaultHeaders;
		this.defaultOptions = config.defaultOptions;
	}

	/**
	 * Build the full URL with query parameters
	 */
	private buildURL(endpoint: string, queryParams?: StrapiQueryParams): string {
		const url = new URL(`${this.baseURL}/api${endpoint}`);

		if (queryParams) {
			this.addQueryParams(url, queryParams);
		}

		return url.toString();
	}

	/**
	 * Recursively add query parameters, handling nested objects for Strapi
	 */
	private addQueryParams(url: URL, params: Record<string, any>, prefix: string = ''): void {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				const paramKey = prefix ? `${prefix}[${key}]` : key;

				if (Array.isArray(value)) {
					value.forEach(item => url.searchParams.append(paramKey, String(item)));
				} else if (typeof value === 'object' && value !== null) {
					// Recursively handle nested objects
					this.addQueryParams(url, value, paramKey);
				} else {
					url.searchParams.append(paramKey, String(value));
				}
			}
		});
	}

	/**
	 * Merge headers with authentication
	 */
	private getHeaders(customHeaders?: HeadersInit): Record<string, string> {
		const headers = { ...this.defaultHeaders };

		// Handle custom headers
		if (customHeaders) {
			if (Array.isArray(customHeaders)) {
				customHeaders.forEach(([key, value]) => {
					headers[key] = value;
				});
			} else if (customHeaders instanceof Headers) {
				customHeaders.forEach((value, key) => {
					headers[key] = value;
				});
			} else {
				Object.assign(headers, customHeaders);
			}
		}

		if (this.token) {
			headers['Authorization'] = `Bearer ${this.token}`;
		}

		return headers;
	}

	/**
	 * Generic fetch method
	 */
	async fetch<T = any>(endpoint: string, options: StrapiRequestOptions = {}): Promise<T> {
		const { queryParams, headers: customHeaders, ...fetchOptions } = options;

		try {
			const url = this.buildURL(endpoint, queryParams);
			const headers = this.getHeaders(customHeaders);

			const mergedOptions: RequestInit = {
				...this.defaultOptions,
				headers,
				...fetchOptions
			};

			const response = await fetch(url, mergedOptions);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error(`Failed to fetch from ${endpoint}:`, error);
			throw new Error(`Failed to fetch data from ${endpoint}`);
		}
	}

	/**
	 * GET request
	 */
	async get<T = any>(endpoint: string, queryParams?: StrapiQueryParams): Promise<T> {
		return this.fetch<T>(endpoint, { method: 'GET', queryParams });
	}

	/**
	 * POST request
	 */
	async post<T = any>(endpoint: string, data: any, queryParams?: StrapiQueryParams): Promise<T> {
		return this.fetch<T>(endpoint, {
			method: 'POST',
			body: JSON.stringify(data),
			queryParams
		});
	}

	/**
	 * PUT request
	 */
	async put<T = any>(endpoint: string, data: any, queryParams?: StrapiQueryParams): Promise<T> {
		return this.fetch<T>(endpoint, {
			method: 'PUT',
			body: JSON.stringify(data),
			queryParams
		});
	}

	/**
	 * PATCH request
	 */
	async patch<T = any>(endpoint: string, data: any, queryParams?: StrapiQueryParams): Promise<T> {
		return this.fetch<T>(endpoint, {
			method: 'PATCH',
			body: JSON.stringify(data),
			queryParams
		});
	}

	/**
	 * DELETE request
	 */
	async delete<T = any>(endpoint: string, queryParams?: StrapiQueryParams): Promise<T> {
		return this.fetch<T>(endpoint, { method: 'DELETE', queryParams });
	}
}

// Create a default instance
export const strapiAPI = new StrapiAPI();

// Example usage functions
export const templatesAPI = {
	getAll: (queryParams?: StrapiQueryParams) => strapiAPI.get('/templates', queryParams),
	getById: (id: string | number, queryParams?: StrapiQueryParams) => strapiAPI.get(`/templates/${id}`, queryParams)
};
