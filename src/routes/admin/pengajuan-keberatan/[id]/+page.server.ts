import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
	const token = cookies.get('access_token');

	const headers = {
		Authorization: `Bearer ${token}`,
		Accept: 'application/json'
	};

	const response = await fetch(`${API_URL}/admin/pengajuan-keberatan/${params.id}`, {
		headers
	});

	if (!response.ok) {
		throw error(response.status, 'Gagal mengambil data pengajuan');
	}

	const result = await response.json();

	return {
		pengajuan: result.data,
		extra: result.extra
	};
};
