// src/routes/admin/profil-ppid/+page.server.ts
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	try {
		const response = await fetch(`${API_URL}/admin/profil-ppid`, {
			headers: {
				Authorization: `Bearer ${locals.token}`,
				Accept: 'application/json'
			}
		});

		const result = await response.json();

		return {
			profil: result.data || { nm_profil: 'Profil PPID', deskripsi: '' }
		};
	} catch (error) {
		console.error('Error loading profil:', error);
		return {
			profil: { nm_profil: 'Profil PPID', deskripsi: '' }
		};
	}
};

export const actions: Actions = {
	default: async ({ request, fetch, locals }) => {
		const formData = await request.formData();
		const nm_profil = formData.get('nm_profil');
		const deskripsi = formData.get('deskripsi');

		try {
			const response = await fetch(`${API_URL}/admin/profil-ppid`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${locals.token}`,
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({ nm_profil, deskripsi })
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
				message: 'Data berhasil disimpan!',
				data: result.data
			};
		} catch (error) {
			return fail(500, {
				message: 'Terjadi kesalahan pada server',
				success: false
			});
		}
	}
};
