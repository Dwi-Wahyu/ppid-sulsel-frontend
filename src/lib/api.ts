const PROXY_PATH = '/api/proxy';

export const apiFetch = async (endpoint: string, options: any = {}) => {
	let url = `${PROXY_PATH}${endpoint}`;

	// Handle Object Params
	if (options.params) {
		// Filter params yang bernilai null atau undefined agar tidak terkirim
		const cleanParams = Object.fromEntries(
			Object.entries(options.params).filter(([_, v]) => v != null)
		);

		const queryString = new URLSearchParams(cleanParams as any).toString();
		if (queryString) {
			url += `?${queryString}`;
		}
	}

	const defaultHeaders = {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	};

	try {
		const response = await fetch(url, {
			...options,
			headers: {
				...defaultHeaders,
				...options.headers
			}
		});

		if (response.status === 401) {
			window.location.href = '/auth/login?error=session_expired';
			return;
		}

		const result = await response.json();
		if (!response.ok) throw result;
		return result;
	} catch (error) {
		console.error('API Error:', error);
		throw error;
	}
};

export const api = {
	get: (url: string, params?: Record<string, any>) => apiFetch(url, { method: 'GET', params }),

	post: (url: string, body: any) => apiFetch(url, { method: 'POST', body: JSON.stringify(body) }),

	put: (url: string, body: any) => apiFetch(url, { method: 'PUT', body: JSON.stringify(body) }),

	delete: (url: string) => apiFetch(url, { method: 'DELETE' })
};
