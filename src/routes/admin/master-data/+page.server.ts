import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
	const token = cookies.get('access_token');

	const headers = {
		Authorization: `Bearer ${token}`,
		Accept: 'application/json'
	};

	try {
		// Fetch all master data in parallel
		const [
			kategoriResponse,
			tahunResponse,
			domisiliResponse,
			pekerjaanResponse,
			alasanResponse,
			bentukInformasiResponse
		] = await Promise.all([
			fetch(`${API_URL}/admin/master-data/kategori-informasi`, { headers }),
			fetch(`${API_URL}/admin/master-data/tahun`, { headers }),
			fetch(`${API_URL}/admin/master-data/domisili`, { headers }),
			fetch(`${API_URL}/admin/master-data/pekerjaan`, { headers }),
			fetch(`${API_URL}/admin/master-data/alasan-pengajuan`, { headers }),
			fetch(`${API_URL}/admin/master-data/bentuk-informasi`, { headers })
		]);

		// Parse responses
		const [kategoriData, tahunData, domisiliData, pekerjaanData, alasanData, bentukInformasiData] =
			await Promise.all([
				kategoriResponse.ok ? kategoriResponse.json() : { data: [] },
				tahunResponse.ok ? tahunResponse.json() : { data: [] },
				domisiliResponse.ok ? domisiliResponse.json() : { data: [] },
				pekerjaanResponse.ok ? pekerjaanResponse.json() : { data: [] },
				alasanResponse.ok ? alasanResponse.json() : { data: [] },
				bentukInformasiResponse.ok ? bentukInformasiResponse.json() : { data: [] }
			]);

		// Get active tab from URL or default to 'kategori'
		const activeTab = url.searchParams.get('tab') || 'kategori';

		return {
			kategoris: kategoriData.data.data || [],
			tahuns: tahunData.data || [],
			domisilis: domisiliData.data || [],
			pekerjaans: pekerjaanData.data || [],
			alasanPengajuans: alasanData.data || [],
			bentukInformasis: bentukInformasiData.data || [],
			activeTab
		};
	} catch (error) {
		console.error('Error loading master data:', error);
		return {
			kategoris: [],
			tahuns: [],
			domisilis: [],
			pekerjaans: [],
			alasanPengajuans: [],
			bentukInformasis: [],
			activeTab: 'kategori'
		};
	}
};
