import { API_URL } from '$env/static/private';
import type { LoginLogResponse } from '$lib/types/auth-logs-types';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
	const token = cookies.get('access_token');

	// Build query string from URL params
	const searchParams = new URLSearchParams();
	const params = ['search', 'ip', 'start_date', 'end_date', 'sort', 'page'];

	params.forEach((param) => {
		const value = url.searchParams.get(param);
		if (value) {
			searchParams.set(param, value);
		}
	});

	const queryString = searchParams.toString();
	const apiUrl = `${API_URL}/admin/logs/auth${queryString ? `?${queryString}` : ''}`;

	try {
		// Fetch dokumen publik data
		const response = await fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error('Failed to fetch dokumen publik');
		}

		const result: LoginLogResponse = await response.json();

		return {
			data: result.data,
			filters: {
				search: url.searchParams.get('search') || '',
				start_date: url.searchParams.get('start_date') || '',
				end_date: url.searchParams.get('end_date') || '',
				sort: url.searchParams.get('sort') || 'newest'
			}
		};
	} catch (error) {
		console.error('Error loading dokumen publik:', error);
		return {
			data: {
				current_page: 1,
				data: [],
				first_page_url: '',
				from: 0,
				last_page: 1,
				last_page_url: '',
				links: [],
				next_page_url: null,
				path: '',
				per_page: 10,
				prev_page_url: null,
				to: 0,
				total: 0
			},
			filters: {
				search: '',
				start_date: '',
				ip: '',
				end_date: '',
				sort: 'newest'
			}
		};
	}
};
