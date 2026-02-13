import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';
import type { PengajuanKeberatanApiResponse } from '$lib/types/PengajuanKeberatanTypes';

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
	const token = cookies.get('access_token');

	// Build query string from URL params
	const searchParams = new URLSearchParams();
	const params = ['search', 'page'];

	params.forEach((param) => {
		const value = url.searchParams.get(param);
		if (value) {
			searchParams.set(param, value);
		}
	});

	const queryString = searchParams.toString();
	const apiUrl = `${API_URL}/admin/pengajuan-keberatan${queryString ? `?${queryString}` : ''}`;

	try {
		// Fetch pengajuan keberatan data
		const response = await fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error('Failed to fetch pengajuan keberatan');
		}

		const result: PengajuanKeberatanApiResponse = await response.json();

		console.log(result);

		return {
			pengajuan: result.data,
			filters: {
				search: url.searchParams.get('search') || ''
			}
		};
	} catch (error) {
		console.error('Error loading pengajuan keberatan:', error);
		return {
			pengajuan: {
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
				search: ''
			}
		};
	}
};
