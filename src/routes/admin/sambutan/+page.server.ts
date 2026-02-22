import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	try {
		const response = await fetch(`${API_URL}/admin/sambutan`, {
			headers: {
				Authorization: `Bearer ${locals.token}`,
				Accept: 'application/json'
			}
		});

		const result = await response.json();

		return {
			sambutan: result.data || { nm_profil: 'Sambutan', deskripsi: '', foto_kepala: null }
		};
	} catch (error) {
		console.error('Error fetching sambutan:', error);
		return {
			sambutan: { nm_profil: 'Sambutan', deskripsi: '', foto_kepala: null }
		};
	}
};

export const actions: Actions = {
	default: async ({ request, fetch, locals }) => {
		const formData = await request.formData();

		try {
			const response = await fetch(`${API_URL}/admin/sambutan`, {
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
				message: 'Sambutan berhasil diperbarui!',
				data: result.data
			};
		} catch (error) {
			return fail(500, {
				message: 'Terjadi kesalahan saat menyimpan data',
				success: false
			});
		}
	}
};
