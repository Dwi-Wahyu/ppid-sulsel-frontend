import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async (event) => fallback(event);
export const POST: RequestHandler = async (event) => fallback(event);
export const PUT: RequestHandler = async (event) => fallback(event);
export const DELETE: RequestHandler = async (event) => fallback(event);

export const fallback: RequestHandler = async ({ url, params, request, locals }) => {
	// Ambil API_URL dari dynamic env
	const API_URL = env.API_URL;

	if (!API_URL) {
		console.error('Proxy Error: API_URL is not defined in environment variables');
		throw error(500, 'Konfigurasi API_URL tidak ditemukan');
	}

	// Ambil token dari locals (yang diisi oleh hooks.server.ts)
	const token = locals.token;

	// Siapkan Header
	const headers = new Headers();

	// Hanya teruskan header yang memang diperlukan
	if (request.headers.get('content-type')) {
		headers.set('content-type', request.headers.get('content-type')!);
	}

	headers.delete('host'); // Keamanan: hapus host agar tidak bentrok
	headers.set('Accept', 'application/json');

	// Injeksi Token Bearer secara aman di sisi server
	if (token) {
		headers.set('Authorization', `Bearer ${token}`);
	}

	// Bangun URL target (menggunakan url.search untuk query params)
	const targetUrl = `${API_URL}/${params.path}${url.search}`;

	// console.log(`Proxying ${request.method} ${url.pathname} -> ${targetUrl}`);

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

		// Buat response baru untuk membersihkan header yang bermasalah
		const responseHeaders = new Headers(response.headers);
		responseHeaders.delete('content-encoding'); // Hapus ini untuk mencegah ERR_CONTENT_DECODING_FAILED
		responseHeaders.delete('content-length'); // Biarkan SvelteKit menghitung ulang panjang data
		responseHeaders.delete('access-control-allow-origin');
		responseHeaders.delete('access-control-allow-credentials');

		return new Response(response.body, {
			status: response.status,
			headers: responseHeaders
		});
	} catch (err) {
		console.error('Proxy Fetch Error:', err);
		throw error(500, 'Koneksi ke server API gagal');
	}
};
