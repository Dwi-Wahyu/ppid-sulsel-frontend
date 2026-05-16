import { superValidate } from 'sveltekit-superforms/server';
import { yup } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import { PUBLIC_API_URL } from '$env/static/public';
import { permohonanSchema } from '$lib/schemas/permohonan.js';
import { setError } from 'sveltekit-superforms/server';

export const load = async ({ fetch }) => {
	const form = await superValidate(yup(permohonanSchema));

	try {
		const [reqDomisili, reqPekerjaan, reqBentukInfo] = await Promise.all([
			fetch(`${API_URL}/public/domisili`).then((res) => res.json()),
			fetch(`${API_URL}/public/pekerjaan`).then((res) => res.json()),
			fetch(`${API_URL}/public/bentuk-informasi`).then((res) => res.json())
		]);

		const domisiliOptions = reqDomisili.data.map(
			(item: { id: number; nama_daerah: string; provinsi: string }) => ({
				value: String(item.id),
				label: item.nama_daerah,
				provinsi: item.provinsi
			})
		);

		const pekerjaanOptions = reqPekerjaan.data.map(
			(item: { id: number; nama_pekerjaan: string }) => ({
				value: String(item.id),
				label: item.nama_pekerjaan
			})
		);

		const bentukInfoOptions = reqBentukInfo.data.map(
			(item: { id: number; judul: string }) => ({
				value: String(item.id),
				label: item.judul
			})
		);

		return { form, domisiliOptions, pekerjaanOptions, bentukInfoOptions };
	} catch (error) {
		console.error('Failed to load master data:', error);
		return { form, domisiliOptions: [], pekerjaanOptions: [], bentukInfoOptions: [] };
	}
};

export const actions = {
	default: async ({ request, fetch }) => {
		// Kita butuh formData asli untuk mengekstrak file
		const formData = await request.formData();
		
		// Validasi data non-file menggunakan schema
		const form = await superValidate(formData, yup(permohonanSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Validasi file manual (karena Superforms schema validation dengan FormData + file cukup rumit)
		const fotoKtp = formData.get('foto_ktp');
		if (!fotoKtp || (fotoKtp as File).size === 0) {
			setError(form, 'foto_ktp', 'Foto KTP wajib diupload');
			return fail(400, { form });
		}

		try {
			// Kirim FormData langsung ke Laravel Backend (karena mengandung file multipart/form-data)
			const response = await fetch(`${PUBLIC_API_URL}/public/permohonan-informasi`, {
				method: 'POST',
				headers: {
					Accept: 'application/json'
					// JANGAN set Content-Type ke application/json atau multipart/form-data.
					// Biarkan fetch yang mengatur boundary secara otomatis.
				},
				body: formData
			});

			const result = await response.json();

			if (!response.ok) {
				if (response.status === 422 && result.errors) {
					// Gunakan setError agar Superforms tahu ini error resmi
					Object.entries(result.errors).forEach(([key, messages]) => {
						const field = key.split('.')[0];
						// @ts-ignore
						setError(form, field, messages[0]);
					});
					return fail(422, { form });
				}
				// Jika ada pesan error umum dari backend
				return fail(400, { form, message: result.message || 'Gagal menyimpan data' });
			}

			return { form, success: true, message: result.message };
		} catch (error) {
			console.error('API Error:', error);
			return fail(500, { form, message: 'Gagal menghubungi server.' });
		}
	}
};