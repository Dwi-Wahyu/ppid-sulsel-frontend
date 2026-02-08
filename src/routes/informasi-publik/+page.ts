import type { PageLoad } from './$types';
import type { MatriksDipResponse } from '$lib/types/matriks-dip';
import { env } from '$env/dynamic/public';

export const load: PageLoad = async ({ fetch, url }) => {
	const page = url.searchParams.get('page') || '1';
	const search = url.searchParams.get('search') || '';

	// Menggunakan API_URL dari env
	const API_BASE = env.PUBLIC_API_URL || 'http://localhost:8000/api';
	const endpoint = `${API_BASE}/public/matriks-dip?page=${page}&search=${search}`;

	const res = await fetch(endpoint);
	const result: MatriksDipResponse = await res.json();

	return {
		matriksData: result
	};
};
