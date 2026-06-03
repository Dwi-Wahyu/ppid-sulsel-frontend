import type { PageLoad } from './$types';
import type { KategoriResponse } from '$lib/types/informasi';

export const load: PageLoad = async ({ fetch, params, url }) => {
	const page = url.searchParams.get('page') || '1';
	const search = url.searchParams.get('search') || '';
	const tahun = url.searchParams.get('tahun') || '';

	// Gunakan proxy path untuk menghindari CORS
	const endpoint = `/api/proxy/public/informasi/kategori/${params.kategori}?page=${page}&search=${search}&tahun=${tahun}`;

	const res = await fetch(endpoint);
	const result: KategoriResponse = await res.json();

	return {
		informasiData: result,
		filters: { page, search, tahun }
	};
};
