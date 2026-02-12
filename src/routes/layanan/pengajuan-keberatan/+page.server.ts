import { superValidate } from 'sveltekit-superforms/server';
import { yup, zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { keberatanSchema } from '$lib/schemas/keberatan';
import { API_URL } from '$env/static/private';
import { PUBLIC_API_URL } from '$env/static/public';

export const load = async ({ fetch }) => {
	const form = await superValidate(yup(keberatanSchema));

	const reqPekerjaan = await fetch(`${API_URL}/public/pekerjaan`).then((res) => res.json());
	const pekerjaanOptions = reqPekerjaan.data.map(
		(item: { id: number; nama_pekerjaan: string }) => ({
			value: item.id,
			label: item.nama_pekerjaan
		})
	);

	const alasanOptions = [
		{ id: 'not_responded', label: 'Permohonan Informasi tidak ditanggapi' },
		{ id: 'not_fulfilled', label: 'Permohonan Informasi tidak dipenuhi' },
		{ id: 'not_provided', label: 'Informasi berkala tidak disediakan' },
		{ id: 'deferred', label: 'Penundaan pemberian Informasi' },
		{ id: 'high_cost', label: 'Biaya yang dipungut tidak wajar' },
		{ id: 'exceeding_time', label: 'Penyampaian Informasi melebihi waktu yang ditentukan' },
		{ id: 'request_rejected', label: 'Permohonan Informasi ditolak' }
	];

	const reqDomisili = await fetch(`${API_URL}/public/domisili`).then((res) => res.json());
	const domisiliOptions = reqDomisili.data.map(
		(item: { id: number; nama_daerah: string; provinsi: string }) => ({
			value: item.id,
			label: item.nama_daerah,
			provinsi: item.provinsi
		})
	);

	return { form, pekerjaanOptions, domisiliOptions, alasanOptions };
};

export const actions = {
	default: async ({ request, fetch }) => {
		const form = await superValidate(request, yup(keberatanSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// Kirim data ke Laravel Backend
			const response = await fetch(`${PUBLIC_API_URL}/public/pengajuan-keberatan`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify(form.data)
			});

			const result = await response.json();

			console.log(response);

			if (!response.ok) {
				// Jika Laravel mengembalikan error validasi 422
				if (response.status === 422 && result.errors) {
					// Mapping error Laravel ke field form
					Object.keys(result.errors).forEach((key) => {
						// Handle array errors seperti alasan.0 -> alasan
						const fieldName = key.split('.')[0] as keyof typeof form.data;
						form.errors[fieldName] = result.errors[key];
					});
					return fail(422, { form });
				}
				return fail(response.status, { form, message: result.message || 'Terjadi kesalahan' });
			}

			return { form, success: true, message: result.message };
		} catch (error) {
			console.error('API Error:', error);
			return fail(500, { form, message: 'Gagal menghubungi server.' });
		}
	}
};
