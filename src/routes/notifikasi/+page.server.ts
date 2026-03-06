import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
	const token = cookies.get('access_token');
	// Ambil halaman dari URL, default ke 1
	const page = url.searchParams.get('page') || '1';

	try {
		const response = await fetch(`${API_URL}/admin/notifications?page=${page}`, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			return { notifications: null, error: 'Gagal mengambil data' };
		}

		const result = await response.json();

		return {
			notifications: result.data
		};
	} catch (err) {
		return { notifications: null, error: 'Terjadi kesalahan koneksi' };
	}
};
