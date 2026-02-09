import { redirect, type Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sequence } from '@sveltejs/kit/hooks';
import { API_URL } from '$env/static/private';

// Middleware Paraglide
const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

// Middleware Autentikasi
export const handleAuth: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('access_token');
	const path = event.url.pathname;

	// Simpan token ke locals agar Proxy API bisa menggunakannya
	event.locals.token = token || null;

	// Hanya ambil data user jika ada token DAN sedang mengakses rute terproteksi
	if (token && (path.startsWith('/admin') || path.startsWith('/opd'))) {
		try {
			const response = await event.fetch(`${API_URL}/admin/user`, {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				}
			});

			if (response.ok) {
				const userData = await response.json();
				event.locals.user = userData;
			} else {
				// Jika token tidak valid (expired), hapus cookie dan locals
				event.cookies.delete('access_token', { path: '/' });
				event.locals.user = null;
				event.locals.token = null;
			}
		} catch (err) {
			console.error('Hooks Error:', err);
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	// Pastikan user tidak bisa masuk /admin jika id_skpd tidak null (bukan Super Admin)
	if (path.startsWith('/admin')) {
		if (!event.locals.user) throw redirect(303, '/login');

		if (event.locals.user.id_skpd !== null) {
			throw redirect(303, '/opd/dashboard'); // Lempar ke dashboard OPD jika dia bukan pusat
		}
	}

	// Guard untuk rute OPD
	if (path.startsWith('/opd')) {
		if (!event.locals.user) throw redirect(303, '/login');

		if (event.locals.user.id_skpd === null) {
			throw redirect(303, '/admin/dashboard'); // Lempar ke admin pusat jika dia superadmin
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth);
