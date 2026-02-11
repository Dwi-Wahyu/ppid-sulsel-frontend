import type { PageLoad } from './$types';
import type { MatriksDipResponse } from '$lib/types/matriks-dip';
import { env } from '$env/dynamic/public';

export const load: PageLoad = async ({ fetch, url, params }) => {
	const page = url.searchParams.get('page') || '1';
	const search = url.searchParams.get('search') || '';
	const tahun = params.tahun; // Extract year from route parameter

	// Menggunakan API_URL dari env
	const API_BASE = env.PUBLIC_API_URL || 'http://localhost:8000/api';
	// Call the year-specific endpoint
	const endpoint = `${API_BASE}/public/informasi/tahun/${tahun}?page=${page}&search=${search}`;

	const res = await fetch(endpoint);
	const result: MatriksDipResponse = await res.json();

	return {
		matriksData: result,
		tahun // Pass the year to the page component
	};
};
