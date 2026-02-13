import { fail, redirect, isRedirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { yup } from 'sveltekit-superforms/adapters';
import { object, string, boolean } from 'yup';
import type { PageServerLoad, Actions } from './$types';
import { API_URL, RECAPTCHA_SECRET_KEY } from '$env/static/private';
import { dev } from '$app/environment';

// Schema validasi form
const schema = object({
	username: string().required('Username wajib diisi').min(4, 'Username minimal 4 karakter'),
	password: string().required('Password wajib diisi').min(4, 'Password minimal 4 karakter'),
	remember: boolean().default(false)
});

// Set true untuk melewati verifikasi reCAPTCHA saat development
const SKIP_RECAPTCHA_IN_DEV = true;

export const load: PageServerLoad = async ({ locals }) => {
	const form = await superValidate(yup(schema));

	// if (locals.user) {
	// 	if (locals.user.id_skpd === null) {
	// 		throw redirect(303, '/admin/dashboard');
	// 	} else {
	// 		throw redirect(303, '/opd/dashboard');
	// 	}
	// }

	return { form };
};

export const actions: Actions = {
	default: async ({ request, fetch, cookies }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, yup(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// === 1. Verifikasi reCAPTCHA ===
			const recaptchaResponse = formData.get('g-recaptcha-response');

			if (dev && SKIP_RECAPTCHA_IN_DEV) {
				console.warn('⚠️ reCAPTCHA verification SKIPPED in development mode');
			} else {
				if (!recaptchaResponse) {
					form.errors._errors = ['Silakan selesaikan verifikasi reCAPTCHA'];
					return fail(400, { form });
				}

				const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
				const verifyRes = await fetch(verifyUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: new URLSearchParams({
						secret: RECAPTCHA_SECRET_KEY,
						response: recaptchaResponse.toString()
					})
				});

				const verifyData = await verifyRes.json();

				if (!verifyData.success) {
					console.error('reCAPTCHA failed:', verifyData['error-codes']);
					return fail(400, {
						form,
						error: 'Verifikasi reCAPTCHA gagal. Silakan refresh halaman.'
					});
				}
			}

			const loginRes = await fetch(`${API_URL}/auth/login`, {
				method: 'POST',
				body: JSON.stringify({
					username: form.data.username,
					password: form.data.password
				}),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			});

			// Sesuaikan destructuring dengan format JSON dari Laravel Anda
			const result = await loginRes.json();

			if (!loginRes.ok || !result.token) {
				form.errors._errors = [result.message || 'Username atau password salah'];
				form.data.password = '';
				return fail(401, { form });
			}

			const { access_token, refresh_token } = result.token;
			const user = result.user;

			// Simpan Access Token
			cookies.set('access_token', access_token, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: !dev,
				maxAge: 60 * 60
			});

			// Simpan Refresh Token
			cookies.set('refresh_token', refresh_token, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: !dev,
				maxAge: 60 * 60 * 24 * 7
			});

			// Simpan data user agar Hooks tidak perlu fetch di setiap klik
			cookies.set('user_data', JSON.stringify(user), {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: !dev,
				maxAge: 60 * 60 * 8
			});

			// Redirect berdasarkan Role
			if (user.id_skpd === null) {
				throw redirect(303, '/admin/dashboard');
			} else {
				throw redirect(303, '/opd/dashboard');
			}
		} catch (error) {
			if (isRedirect(error)) {
				throw error;
			}

			console.error('System Error during login:', error);
			form.errors._errors = ['Terjadi kesalahan sistem. Silakan coba lagi nanti.'];
			return fail(500, { form });
		}
	}
};
