import { redirect, type Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sequence } from '@sveltejs/kit/hooks';
import { API_URL } from '$env/static/private';

// Middleware Paraglide (Tetap)
const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

// Middleware Auth & Route Guard
export const handleAuth: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('access_token');

	if (token) {
		const response = await event.fetch(`${API_URL}/admin/user`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json'
			}
		});

		if (response.ok) {
			event.locals.user = await response.json();
		}
	} else {
		event.locals.user = null;
	}

	// Route Guard tetap sama fungsinya
	const path = event.url.pathname;
	if (path.startsWith('/admin') && (!event.locals.user || event.locals.user.id_skpd !== null)) {
		throw redirect(303, '/login');
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth);
