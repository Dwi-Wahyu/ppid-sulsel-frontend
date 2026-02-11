const PROXY_PATH = '/api/proxy';

export const apiFetch = async (endpoint: string, options: any = {}) => {
	let url = `${PROXY_PATH}${endpoint}`;

	// Handle Object Params (Query Strings)
	if (options.params) {
		const cleanParams = Object.fromEntries(
			Object.entries(options.params).filter(([_, v]) => v != null)
		);
		const queryString = new URLSearchParams(cleanParams as any).toString();
		if (queryString) url += `?${queryString}`;
	}

	const headers = new Headers(options.headers || {});

	// PENTING: Jangan set Content-Type JSON jika mengirim FormData (unggahan file)
	// Browser akan otomatis menyetel boundary yang benar untuk multipart/form-data
	if (!(options.body instanceof FormData)) {
		headers.set('Accept', 'application/json');
		headers.set('Content-Type', 'application/json');
	} else {
		// Pastikan tetap menerima JSON dari server
		headers.set('Accept', 'application/json');
	}

	try {
		const response = await fetch(url, {
			...options,
			headers
		});

		// Tangani sesi expired secara global
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

	// Modifikasi post dan put agar mendukung FormData secara cerdas
	post: (url: string, body: any) => {
		const isFormData = body instanceof FormData;
		return apiFetch(url, {
			method: 'POST',
			body: isFormData ? body : JSON.stringify(body)
		});
	},

	put: (url: string, body: any) => {
		const isFormData = body instanceof FormData;
		return apiFetch(url, {
			method: 'PUT',
			body: isFormData ? body : JSON.stringify(body)
		});
	},

	delete: (url: string) => apiFetch(url, { method: 'DELETE' })
};
