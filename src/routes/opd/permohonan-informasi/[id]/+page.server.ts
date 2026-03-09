import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies, fetch }) => {
	const token = cookies.get('access_token');
	const { id } = params;

	try {
		// Fetch permohonan detail
		const permohonanResponse = await fetch(`${API_URL}/admin/permohonan-informasi/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json'
			}
		});

		if (!permohonanResponse.ok) {
			throw new Error('Failed to fetch permohonan detail');
		}

		const permohonanResult = await permohonanResponse.json();

		console.log(permohonanResult);

		return {
			permohonan: permohonanResult.data
		};
	} catch (error) {
		console.error('Error loading permohonan detail:', error);
		throw error;
	}
};
