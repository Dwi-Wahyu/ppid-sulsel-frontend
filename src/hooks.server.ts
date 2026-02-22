import { redirect, type Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sequence } from '@sveltejs/kit/hooks';
import { ACCESS_TOKEN_MAX_AGE, API_URL, REFRESH_TOKEN_MAX_AGE } from '$env/static/private';
import { dev } from '$app/environment'; // Tambahkan impor ini

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

export const handleAuth: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('access_token');
	const refreshToken = event.cookies.get('refresh_token');
	const userDataCookie = event.cookies.get('user_data');
	const path = event.url.pathname;

	// Inisialisasi locals
	event.locals.token = token || null;
	event.locals.refresh_token = refreshToken || null;

	try {
		event.locals.user = userDataCookie ? JSON.parse(userDataCookie) : null;
	} catch {
		event.locals.user = null;
	}

	const isProtectedRoute = path.startsWith('/admin') || path.startsWith('/opd');

	// Mekanisme Refresh Token jika Access Token hilang/expired tapi sedang di rute terproteksi
	if (isProtectedRoute && !event.locals.token && refreshToken) {
		try {
			const refreshRes = await event.fetch(`${API_URL}/refresh-token`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refresh_token: refreshToken })
			});

			console.log('------');

			console.log(refreshRes);

			if (refreshRes.ok) {
				const { data, user } = await refreshRes.json();

				event.locals.user = user;
				event.locals.token = data.access_token;

				console.log(data);

				console.log('------');

				// Simpan Access Token baru
				event.cookies.set('access_token', data.access_token, {
					path: '/',
					httpOnly: true,
					sameSite: 'lax',
					secure: !dev,
					maxAge: parseInt(ACCESS_TOKEN_MAX_AGE)
				});

				// Simpan Refresh Token baru (Rotation)
				event.cookies.set('refresh_token', data.refresh_token, {
					path: '/',
					httpOnly: true,
					sameSite: 'lax',
					secure: !dev,
					maxAge: parseInt(REFRESH_TOKEN_MAX_AGE)
				});

				// Simpan kembali ke cookie user_data agar request berikutnya tidak fetch lagi
				event.cookies.set('user_data', JSON.stringify(user), {
					path: '/',
					httpOnly: true,
					sameSite: 'lax',
					secure: !dev,
					maxAge: 60 * 60 * 8
				});
			} else {
				// Jika refresh token juga tidak valid, bersihkan cookies dan redirect ke login
				event.cookies.delete('access_token', { path: '/' });
				event.cookies.delete('refresh_token', { path: '/' });
				event.cookies.delete('user_data', { path: '/' });
				event.locals.user = null;
				throw redirect(303, '/login?error=session_expired');
			}
		} catch (err) {
			console.error('Refresh Token Error:', err);
		}
	}

	// Guard: Proteksi Rute
	if (isProtectedRoute && !event.locals.user) {
		event.cookies.delete('access_token', { path: '/' });
		event.cookies.delete('refresh_token', { path: '/' });
		event.cookies.delete('user_data', { path: '/' });
		event.locals.user = null;
		throw redirect(303, '/login?error=session_expired');
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth);
