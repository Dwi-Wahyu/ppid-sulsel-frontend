import { fail, redirect, isRedirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { yup } from 'sveltekit-superforms/adapters';
import { object, string, boolean } from 'yup';
import type { PageServerLoad, Actions } from './$types';
import { RECAPTCHA_SECRET_KEY } from '$env/static/private';
import { dev } from '$app/environment';

// Schema validasi form
const schema = object({
	username: string().required('Username wajib diisi').min(4, 'Username minimal 4 karakter'),
	password: string().required('Password wajib diisi').min(4, 'Password minimal 4 karakter'),
	remember: boolean().default(false)
});

// Set true untuk melewati verifikasi reCAPTCHA saat development
const SKIP_RECAPTCHA_IN_DEV = true;

export const load: PageServerLoad = async () => {
	const form = await superValidate(yup(schema));
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

			// Debugging log (bisa dihapus di production)
			if (dev) {
				console.log('=== LOGIN ATTEMPT ===');
				console.log('User:', form.data.username);
				console.log('Skip reCAPTCHA:', SKIP_RECAPTCHA_IN_DEV);
			}

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

			// === 2. Proses Login ke API Backend ===
			// Pastikan URL API backend benar sesuai konfigurasi Laravel Anda
			const loginRes = await fetch('http://localhost:8000/api/auth/login', {
				method: 'POST',
				body: JSON.stringify({
					username: form.data.username,
					password: form.data.password
				}),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			});

			const result = await loginRes.json();

			// Jika login gagal (status tidak 200-299)
			if (!loginRes.ok || !result.token) {
				console.error('Login API Error:', result);
				form.errors._errors = [result.message || 'Username atau password salah'];
				// Hapus password dari form yang dikembalikan untuk keamanan
				form.data.password = '';
				return fail(401, { form });
			}

			// === 3. Set Cookie & Redirect ===
			const maxAge = form.data.remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

			cookies.set('access_token', result.token, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: !dev, // False di localhost, True di production (HTTPS)
				maxAge
			});

			// Cek role/skpd user untuk redirect
			const user = result.user;

			// === PENTING: Throw Redirect di sini ===
			if (user.id_skpd === null) {
				throw redirect(303, '/admin/dashboard');
			} else {
				throw redirect(303, '/opd/dashboard');
			}

		} catch (error) {
			// === PERBAIKAN KRUSIAL DI SINI ===
			// SvelteKit menggunakan throw untuk redirect. 
			// Kita harus menangkapnya dan melemparnya kembali agar navigasi terjadi.
			if (isRedirect(error)) {
				throw error;
			}

			console.error('System Error during login:', error);
			form.errors._errors = ['Terjadi kesalahan sistem. Silakan coba lagi nanti.'];
			return fail(500, { form });
		}
	}
};