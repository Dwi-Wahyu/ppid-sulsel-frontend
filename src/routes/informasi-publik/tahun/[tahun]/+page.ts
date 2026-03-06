import type { PageLoad } from './$types';
import type { TahunResponse } from '$lib/types/informasi';
import { env } from '$env/dynamic/public';

export const load: PageLoad = async ({ fetch, url, params }) => {
	const page = url.searchParams.get('page') || '1';
	const search = url.searchParams.get('search') || '';
	const tahun = params.tahun;

	const API_BASE = env.PUBLIC_API_URL || 'http://localhost:8000/api';
	let endpoint = `${API_BASE}/public/informasi/tahun/${tahun}?page=${page}`;
	if (search) {
		endpoint += `&search=${encodeURIComponent(search)}`;
	}

	const res = await fetch(endpoint);
	const result: TahunResponse = await res.json();

	return {
		informasiData: result,
		tahun,
		filters: { search, page }
	};
};
