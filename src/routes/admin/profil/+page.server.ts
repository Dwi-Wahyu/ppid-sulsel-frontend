import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get('access_token');
	const apiUrl = `${API_URL}/admin/user/profile`;

	try {
		const response = await fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error('Gagal mengambil data profil');
		}

		const result = await response.json();

		return {
			user: result
		};
	} catch (error) {
		console.error('Error loading profile:', error);
		return {
			user: null,
			error: 'Gagal memuat informasi profil.'
		};
	}
};
