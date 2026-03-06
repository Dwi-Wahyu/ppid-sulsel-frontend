import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch, cookies, locals }) => {
	const token = cookies.get('access_token');

	if (!token) {
		throw error(401, 'Unauthorized');
	}

	const headers = {
		Authorization: `Bearer ${token}`,
		Accept: 'application/json'
	};

	// Mengambil data pengajuan berdasarkan ID
	const response = await fetch(`${API_URL}/admin/pengajuan-keberatan/${params.id}`, {
		headers
	});

	if (!response.ok) {
		throw error(response.status, 'Gagal mengambil data pengajuan');
	}

	const result = await response.json();

	console.log(result);

	return {
		pengajuan: result.data,
		extra: result.extra
	};
};
