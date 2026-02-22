import { API_URL } from '$env/static/private';
import type {
	DokumenPublikApiResponse,
	KategoriInformasi,
	Skpd
} from '$lib/types/DokumenPublikTypes';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, cookies, url, params: dynamicParams }) => {
	const { kategori } = dynamicParams;

	const token = cookies.get('access_token');

	// Build query string from URL params
	const searchParams = new URLSearchParams();
	const params = [
		'search',
		'id_kat_info',
		'id_skpd',
		'verify',
		'start_date',
		'end_date',
		'sort',
		'page'
	];

	params.forEach((param) => {
		const value = url.searchParams.get(param);
		if (value) {
			searchParams.set(param, value);
		}
	});

	if (kategori) {
		searchParams.set('kategori_slug', kategori);
	}

	const queryString = searchParams.toString();
	const apiUrl = `${API_URL}/admin/dokumen-publik${queryString ? `?${queryString}` : ''}`;

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

		const result: DokumenPublikApiResponse = await response.json();

		// Fetch kategori list for filter
		const kategoriResponse = await fetch(`${API_URL}/admin/master-data/kategori-informasi`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json'
			}
		});

		let kategoriList: KategoriInformasi[] = [];
		if (kategoriResponse.ok) {
			const kategoriData = await kategoriResponse.json();
			kategoriList = kategoriData.data || [];
		}

		// Fetch SKPD list for admin users
		const skpdResponse = await fetch(`${API_URL}/admin/skpd`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json'
			}
		});

		let skpdList: Skpd[] = [];
		if (skpdResponse.ok) {
			const skpdData = await skpdResponse.json();
			skpdList = skpdData.data || [];
		}

		return {
			informasi: result.data,
			kategoriList,
			skpdList,
			filters: {
				search: url.searchParams.get('search') || '',
				id_kat_info: url.searchParams.get('id_kat_info') || '',
				id_skpd: url.searchParams.get('id_skpd') || '',
				verify: url.searchParams.get('verify') || '',
				start_date: url.searchParams.get('start_date') || '',
				end_date: url.searchParams.get('end_date') || '',
				sort: url.searchParams.get('sort') || 'newest'
			}
		};
	} catch (error) {
		console.error('Error loading dokumen publik:', error);
		return {
			informasi: {
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
			kategoriList: [],
			skpdList: [],
			filters: {
				search: '',
				id_kat_info: '',
				id_skpd: '',
				verify: '',
				start_date: '',
				end_date: '',
				sort: 'newest'
			}
		};
	}
};
