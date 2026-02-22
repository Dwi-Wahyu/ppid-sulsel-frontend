<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import { dev } from '$app/environment';
	import { page } from '$app/state';

	const error = $derived(page.url.searchParams.get('error'));

	let { data }: { data: PageData } = $props();

	// State untuk UI
	let showPassword = $state(false);
	let recaptchaError = $state<string | null>(null);
	let recaptchaLoaded = $state(false);

	const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

	import toast, { Toaster } from 'svelte-5-french-toast';

	// Setup Superforms
	const { form, errors, enhance, delayed, message } = superForm(data.form, {
		onUpdate: async ({ result }) => {
			if (result.type === 'success') {
				toast.success('Login Berhasil! Mengalihkan...');

				await delay(2000);

				location.href = result.data.form.message;
			}
		},

		onSubmit: ({ cancel }) => {
			recaptchaError = null;

			// Validasi reCAPTCHA hanya dilakukan jika BUKAN mode dev
			if (!dev) {
				const recaptchaResponse = (window as any).grecaptcha?.getResponse();
				if (!recaptchaResponse) {
					cancel();
					recaptchaError = 'Silakan selesaikan verifikasi reCAPTCHA terlebih dahulu';
					return;
				}
			}
		}
	});

	onMount(() => {
		// Daftarkan callback global agar bisa dipanggil oleh script reCAPTCHA
		(window as any).onRecaptchaLoad = () => {
			recaptchaLoaded = true;
		};

		if ((window as any).grecaptcha) {
			recaptchaLoaded = true;
		}
	});
</script>

<Toaster />

<svelte:head>
	<title>Login - PPID Sulsel</title>
	<meta name="description" content="Portal Login PPID Provinsi Sulawesi Selatan" />
	<script src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad" async defer></script>
</svelte:head>

<div class="relative flex min-h-screen items-center justify-center p-4 font-sans lg:p-0">
	<div class="absolute inset-0 z-0">
		<img
			src="/images/kantor.jpeg"
			alt=""
			class="h-full w-full object-cover object-center opacity-30"
			aria-hidden="true"
		/>
		<div
			class="absolute inset-0 bg-linear-to-br from-ppid-primary/95 via-ppid-primary/85 to-ppid-primary-hover/95 mix-blend-multiply"
			aria-hidden="true"
		></div>
		<div
			class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-5"
			aria-hidden="true"
		></div>
	</div>

	<main
		class="relative z-10 flex h-auto w-full max-w-275 flex-col overflow-hidden rounded-3xl border border-white/40 bg-white shadow-2xl lg:h-162.5 lg:flex-row"
	>
		<div
			class="group relative hidden flex-col items-center justify-between overflow-hidden border-r border-white/10 bg-linear-to-b from-ppid-primary to-ppid-primary-dark p-12 text-center lg:flex lg:w-5/12"
		>
			<div class="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden">
				<div class="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
				<div
					class="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-ppid-accent/10 blur-3xl"
				></div>
			</div>

			<div class="relative z-10 w-full text-left">
				<a
					href="/"
					class="inline-flex items-center gap-2 font-medium text-white/90 transition-all duration-300 group-hover:-translate-x-1 hover:text-white"
				>
					<div
						class="rounded-lg border border-white/20 bg-white/10 p-1.5 backdrop-blur-sm transition-colors group-hover:bg-white/20"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="m15 18-6-6 6-6" />
						</svg>
					</div>
					<span>Kembali ke Beranda</span>
				</a>
			</div>

			<div class="relative z-10 mt-8 flex flex-col items-center">
				<div
					class="relative mb-6 h-auto w-full transform drop-shadow-2xl transition-transform duration-500 hover:scale-105"
				>
					<img
						src="/images/ppid-5.png"
						alt="Logo PPID Sulsel"
						class="h-auto w-full object-contain drop-shadow-lg"
					/>
				</div>
				<h2 class="mb-2 text-2xl leading-tight font-bold tracking-tight text-white">
					Pejabat Pengelola Informasi dan Dokumentasi<br /><span class="text-ppid-accent"
						>Sulawesi Selatan</span
					>
				</h2>
				<div class="my-4 h-1 w-20 rounded-full bg-ppid-accent"></div>
				<p class="mx-auto max-w-[80%] text-sm leading-relaxed font-light text-blue-50 opacity-90">
					Transparansi untuk Partisipasi. Akses informasi publik dengan mudah, cepat, dan akurat.
				</p>
			</div>

			<div class="relative z-10 mt-auto w-full">
				<div class="flex items-center justify-center gap-2 opacity-60">
					<span class="h-2 w-2 rounded-full bg-ppid-accent"></span>
					<p class="text-[10px] tracking-widest text-white uppercase">Official Portal</p>
					<span class="h-2 w-2 rounded-full bg-ppid-accent"></span>
				</div>
			</div>
		</div>

		<div class="relative flex h-full w-full flex-col justify-center bg-white lg:w-7/12">
			<div
				class="absolute top-0 left-0 flex w-full items-start justify-between border-b border-gray-100/50 bg-linear-to-b from-gray-50 to-white p-6 lg:hidden"
			>
				<img src="/images/ppid-3.png" alt="Logo PPID Sulsel" class="h-12 w-auto" />
				<a
					title="Kembali ke beranda"
					href="/"
					class="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M18 6 6 18" /><path d="m6 6 12 12" />
					</svg>
				</a>
			</div>

			<div
				class="mx-auto flex h-full w-full max-w-lg flex-col justify-center p-8 md:p-14 lg:mt-0 lg:p-16"
			>
				<div class="mb-4 text-center lg:text-left">
					<h1 class="mb-1 text-3xl font-extrabold tracking-tight text-ppid-primary md:text-4xl">
						Selamat Datang
					</h1>
					<p class="text-lg font-medium text-gray-500">Silakan masuk untuk melanjutkan.</p>
				</div>

				<form method="POST" use:enhance class="space-y-6">
					<div class="space-y-2">
						<label
							for="username"
							class="ml-1 block text-sm font-bold tracking-wider text-ppid-primary uppercase"
							>Username</label
						>
						<div class="group relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
								<svg
									class="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-ppid-primary"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<input
								name="username"
								id="username"
								type="text"
								autocomplete="username"
								bind:value={$form.username}
								class="block w-full rounded-xl border-2 border-gray-200 bg-gray-50/50 py-4 pr-4 pl-11 font-medium text-gray-900 placeholder-gray-400 transition-all duration-200 ease-out focus:border-ppid-primary focus:bg-white focus:ring-4 focus:ring-ppid-primary/10 focus:outline-none"
								placeholder="Masukkan username Anda"
								aria-invalid={$errors.username ? 'true' : 'false'}
							/>
						</div>
						{#if $errors.username}
							<p class="mt-2 text-sm text-ppid-error">{$errors.username}</p>
						{/if}
					</div>

					<div class="space-y-1">
						<label for="password" class="ml-1 text-sm font-semibold text-gray-700">KATA SANDI</label
						>
						<div class="group relative">
							<input
								type={showPassword ? 'text' : 'password'}
								id="password"
								name="password"
								autocomplete="current-password"
								bind:value={$form.password}
								class="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-4 pl-12 text-gray-900 transition-all duration-300 placeholder:text-gray-400 focus:border-ppid-primary focus:ring-4 focus:ring-ppid-primary/10 focus:outline-none"
								placeholder="••••••••"
								aria-invalid={$errors.password ? 'true' : 'false'}
							/>
							<div
								class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors group-focus-within:text-ppid-primary"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
							</div>
							<button
								type="button"
								onclick={() => (showPassword = !showPassword)}
								class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors hover:text-ppid-primary focus:outline-none"
							>
								{#if !showPassword}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="25"
										height="25"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path
											d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
										/><circle cx="12" cy="12" r="3" /></svg
									>
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="25"
										height="25"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path d="m15 18-.722-3.25" /><path d="M2 8a10.645 10.645 0 0 0 20 0" /><path
											d="m20 15-1.726-2.05"
										/><path d="m4 15 1.726-2.05" /><path d="m9 18 .722-3.25" /></svg
									>
								{/if}
							</button>
						</div>
						{#if $errors.password}
							<p class="mt-2 text-sm text-ppid-error">{$errors.password}</p>
						{/if}
					</div>

					{#if !dev}
						<div class="space-y-2">
							<div
								class="g-recaptcha flex justify-center"
								data-sitekey={PUBLIC_RECAPTCHA_SITE_KEY}
							></div>
							{#if recaptchaError}
								<p class="text-center text-sm text-ppid-error">{recaptchaError}</p>
							{/if}
						</div>
					{/if}

					<label class="group flex cursor-pointer items-center">
						<input
							id="remember"
							name="remember"
							type="checkbox"
							class="h-5 w-5 rounded border-gray-300 bg-gray-100 text-ppid-primary transition duration-150 ease-in-out focus:ring-2 focus:ring-ppid-primary"
						/>
						<span
							class="ml-3 block text-sm font-medium text-gray-600 transition-colors group-hover:text-ppid-primary"
							>Ingat Saya</span
						>
					</label>

					{#if $errors._errors}
						<div
							class="rounded-lg border border-red-100 bg-red-50 p-4 text-center text-sm text-red-600"
						>
							{$errors._errors}
						</div>
					{/if}

					<button
						type="submit"
						disabled={$delayed}
						class="mt-4 flex w-full transform justify-center rounded-xl border border-transparent bg-linear-to-r from-ppid-primary to-ppid-primary-dark px-6 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-ppid-primary-hover hover:to-ppid-primary hover:shadow-xl focus:ring-4 focus:ring-ppid-primary/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						{$delayed ? 'MEMPROSES...' : 'MASUK SEKARANG'}
					</button>

					{#if error === 'session_expired'}
						<p class="text-red-500">Session kamu sudah expired, silakan login kembali.</p>
					{/if}

					<div class="mt-8 border-t border-gray-100 pt-6 text-center lg:hidden">
						<p class="text-xs text-gray-400">
							&copy; {new Date().getFullYear()} PPID Provinsi Sulawesi Selatan
						</p>
					</div>
				</form>
			</div>

			<div class="absolute bottom-2 hidden w-full px-8 text-center lg:block">
				<p class="text-xs font-medium text-gray-400">
					&copy; {new Date().getFullYear()} Pemerintah Provinsi Sulawesi Selatan.
				</p>
			</div>
		</div>
	</main>
</div>
