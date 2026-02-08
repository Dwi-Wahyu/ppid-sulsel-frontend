import type { PageLoad } from './$types';
import { env } from '$env/dynamic/public';
import type { KategoriResponse } from '$lib/types/informasi';

export const load: PageLoad = async ({ fetch, params, url }) => {
	const API_BASE = env.PUBLIC_API_URL || 'http://localhost:8000/api';
	const page = url.searchParams.get('page') || '1';
	const search = url.searchParams.get('search') || '';
	const tahun = url.searchParams.get('tahun') || '';

	const endpoint = `${API_BASE}/public/informasi/kategori/${params.kategori}?page=${page}&search=${search}&tahun=${tahun}`;

	const res = await fetch(endpoint);
	const result: KategoriResponse = await res.json();

	return {
		kategoriData: result
	};
};
