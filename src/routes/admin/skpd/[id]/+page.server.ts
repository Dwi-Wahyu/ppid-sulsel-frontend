import type { PageServerLoad, Actions } from './$types';
import { API_URL } from '$env/static/private';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
	const token = cookies.get('access_token');

	const headers = {
		Authorization: `Bearer ${token}`,
		Accept: 'application/json'
	};

	try {
		const response = await fetch(`${API_URL}/admin/skpd/${params.id}`, {
			headers
		});

		if (response.ok) {
			const result = await response.json();
			const skpd = result.data;

			if (!skpd) {
				throw error(404, 'SKPD tidak ditemukan');
			}

			return {
				skpd
			};
		}

		throw error(500, 'Gagal memuat data SKPD');
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Terjadi kesalahan pada server');
	}
};

export const actions: Actions = {
	changePassword: async ({ request, fetch, cookies }) => {
		const data = await request.formData();
		const userId = data.get('user_id');
		const new_password = data.get('new_password');
		const new_password_confirmation = data.get('new_password_confirmation');

		const token = cookies.get('access_token');
		const headers = {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json',
			'Content-Type': 'application/json'
		};

		const response = await fetch(`${API_URL}/admin/users/${userId}/change-password`, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				new_password,
				new_password_confirmation
			})
		});

		const result = await response.json();

		if (!response.ok) {
			return fail(response.status, {
				error: true,
				message: result.message || 'Gagal mengubah password',
				errors: result.errors
			});
		}

		return { success: true, message: result.message };
	}
};
