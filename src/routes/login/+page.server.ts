import { fail, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms';
import { yup } from 'sveltekit-superforms/adapters';
import { object, string } from 'yup';

const schema = object({
	username: string().required('Username wajib diisi').min(4, 'Username minimal 4 karakter'),
	password: string().required('Password wajib diisi').min(4, 'Password minimal 4 karakter')
});

export const load = async () => {
	const form = await superValidate(yup(schema));

	return { form };
};

export const actions = {
	default: async ({ request, fetch, cookies }) => {
		const form = await superValidate(request, yup(schema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const loginRes = await fetch('http://localhost:8000/api/auth/login', {
			method: 'POST',
			body: JSON.stringify(form.data),
			headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
		});

		const result = await loginRes.json();

		console.log(result);

		if (loginRes.ok && result.token) {
			// Simpan token ke cookie agar bisa dibaca oleh hooks.server.ts
			cookies.set('access_token', result.token, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 // 1 hari
			});

			// Redirect berdasarkan data user dari result login
			const user = result.user;
			if (user.id_skpd === null) throw redirect(303, '/admin/dashboard');
			throw redirect(303, '/opd/dashboard');
		}

		return fail(401, { message: 'Login gagal' });
	}
};
