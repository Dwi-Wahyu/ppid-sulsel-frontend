import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';

export const fallback: RequestHandler = async ({ url, params, request, locals }) => {
	// Ambil token dari locals (yang diisi oleh hooks.server.ts)
	const token = locals.token;

	// Siapkan Header
	const headers = new Headers(request.headers);
	headers.delete('host'); // Keamanan: hapus host agar tidak bentrok
	headers.set('Accept', 'application/json');

	// Injeksi Token Bearer secara aman di sisi server
	if (token) {
		headers.set('Authorization', `Bearer ${token}`);
	}

	// Bangun URL target (menggunakan url.search untuk query params)
	const targetUrl = `${PUBLIC_API_URL}/${params.path}${url.search}`;

	try {
		// Lakukan Request ke Laravel
		const response = await fetch(targetUrl, {
			method: request.method,
			headers,
			// Body hanya dikirim jika bukan metode GET/HEAD
			body:
				request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : undefined,
			// @ts-ignore - duplex diperlukan untuk streaming body di Node/Undici
			duplex: 'half'
		});

		// Teruskan response apa adanya
		return response;
	} catch (err) {
		console.error('Proxy Fetch Error:', err);
		throw error(500, 'Koneksi ke server API gagal');
	}
};
