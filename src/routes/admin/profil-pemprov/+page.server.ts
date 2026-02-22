import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	try {
		const response = await fetch(`${API_URL}/admin/profil-pemprov`, {
			headers: {
				Authorization: `Bearer ${locals.token}`,
				Accept: 'application/json'
			}
		});

		const result = await response.json();

		return {
			profil: result.data || {}
		};
	} catch (error) {
		console.error('Error loading profil pemprov:', error);
		return { profil: {} };
	}
};

export const actions: Actions = {
	default: async ({ request, fetch, locals }) => {
		const formData = await request.formData();

		try {
			// SvelteKit fetch secara otomatis menangani Content-Type
			// multipart/form-data saat menerima objek FormData
			const response = await fetch(`${API_URL}/admin/profil-pemprov`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${locals.token}`,
					Accept: 'application/json'
				},
				body: formData
			});

			const result = await response.json();

			if (!response.ok) {
				return fail(response.status, {
					message: result.message || 'Gagal menyimpan data',
					success: false
				});
			}

			return {
				success: true,
				message: 'Profil Pemprov berhasil diperbarui!',
				data: result.data
			};
		} catch (error) {
			return fail(500, {
				message: 'Terjadi kesalahan koneksi ke server',
				success: false
			});
		}
	}
};
