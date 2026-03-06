import type { PageLoad } from './$types';
import type { KategoriResponse } from '$lib/types/informasi';
import { env } from '$env/dynamic/public';

export const load: PageLoad = async ({ fetch, url }) => {
	const page = url.searchParams.get('page') || '1';
	const search = url.searchParams.get('search') || '';

	const API_BASE = env.PUBLIC_API_URL || 'http://localhost:8000/api';
	let endpoint = `${API_BASE}/public/informasi/kategori/daftar-informasi-publik?page=${page}`;
	if (search) {
		endpoint += `&search=${encodeURIComponent(search)}`;
	}

	const res = await fetch(endpoint);
	const result: KategoriResponse = await res.json();

	return {
		informasiData: result,
		filters: { search, page }
	};
};
