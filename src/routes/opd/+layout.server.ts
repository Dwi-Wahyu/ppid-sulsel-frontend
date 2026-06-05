import { API_URL } from '$env/static/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, locals, cookies }) => {
	const user = locals.user;
	const token = cookies.get('access_token');
	const id_skpd = user?.id_skpd || user?.skpd?.id_skpd;

	let skpd = null;

	if (id_skpd && token) {
		try {
			const response = await fetch(`${API_URL}/admin/skpd/${id_skpd}`, {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				}
			});
			if (response.ok) {
				const result = await response.json();
				skpd = result.data || null;
			} else {
				console.error(`Failed to fetch SKPD ${id_skpd}:`, response.status);
			}
		} catch (e) {
			console.error('Error fetching SKPD details in layout:', e);
		}
	}

	return {
		user,
		skpd
	};
};

