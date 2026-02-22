import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
	const token = cookies.get('access_token');

	const headers = {
		Authorization: `Bearer ${token}`,
		Accept: 'application/json'
	};

	try {
		// Get query parameters for search and filters
		const search = url.searchParams.get('search') || '';
		const sort = url.searchParams.get('sort') || '';
		const startDate = url.searchParams.get('start_date') || '';
		const endDate = url.searchParams.get('end_date') || '';
		const page = url.searchParams.get('page') || '1';

		// Build query string
		const queryParams = new URLSearchParams();
		if (search) queryParams.append('search', search);
		if (sort) queryParams.append('sort', sort);
		if (startDate) queryParams.append('start_date', startDate);
		if (endDate) queryParams.append('end_date', endDate);
		queryParams.append('page', page);

		const response = await fetch(`${API_URL}/admin/ikphn?${queryParams.toString()}`, {
			headers
		});

		if (response.ok) {
			const result = await response.json();
			return {
				ikphns: result.data || {},
				search,
				sort,
				startDate,
				endDate
			};
		}

		return {
			ikphns: { data: [], total: 0, current_page: 1, last_page: 1 },
			search: '',
			sort: '',
			startDate: '',
			endDate: ''
		};
	} catch (error) {
		console.error('Error loading IKPHN data:', error);
		return {
			ikphns: { data: [], total: 0, current_page: 1, last_page: 1 },
			search: '',
			sort: '',
			startDate: '',
			endDate: ''
		};
	}
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const formData = await request.formData();

		const response = await fetch(`${API_URL}/admin/ikphn`, {
			method: 'POST',
			body: formData
		});

		const result = await response.json();
		if (!response.ok)
			return fail(response.status, { error: result.message, errors: result.errors });

		return { success: true, message: result.message };
	},

	update: async ({ request, fetch }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		formData.append('_method', 'PUT');

		const response = await fetch(`${API_URL}/admin/ikphn/${id}`, {
			method: 'POST',
			body: formData
		});

		const result = await response.json();
		if (!response.ok)
			return fail(response.status, { error: result.message, errors: result.errors });

		return { success: true, message: result.message };
	},

	delete: async ({ request, fetch }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		const response = await fetch(`${API_URL}/admin/ikphn/${id}`, {
			method: 'DELETE'
		});

		const result = await response.json();
		if (!response.ok) return fail(response.status, { error: result.message });

		return { success: true, message: result.message };
	}
};
