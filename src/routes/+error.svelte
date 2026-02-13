<script lang="ts">
	import { page } from '$app/state'; // SvelteKit 5 menggunakan $app/state
	import { browser } from '$app/environment';

	// 1. Typesafety: Definisi Interface untuk Konten Error
	interface ErrorButton {
		text: string;
		href?: string;
		action?: 'reload';
		external?: boolean;
	}

	interface ErrorUIContent {
		title: string;
		subtitle: string;
		description: string;
		image?: string;
		icon?: string;
		primaryButton: ErrorButton;
		secondaryButton: ErrorButton;
		showSearch: boolean;
		showInfo: boolean;
		infoTitle?: string | null;
		infoText?: string;
	}

	// 2. Svelte 5 Runes: Menggunakan $derived untuk reaktivitas yang lebih efisien
	const status = $derived(page.status);
	const message = $derived(page.error?.message || 'An error occurred');
	const currentLang = $derived(page.url.pathname.startsWith('/en') ? 'en' : 'id');

	const errorContent = $derived(getErrorContent(status, currentLang));

	function getErrorContent(code: number, lang: string): ErrorUIContent {
		const isId = lang === 'id';

		switch (code) {
			case 403:
				return {
					title: '403',
					subtitle: isId ? 'Akses Ditolak' : 'Access Forbidden',
					description: isId
						? 'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.'
						: "Sorry, you don't have permission to access this page.",
					icon: `<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>`,
					primaryButton: { text: isId ? 'Kembali ke Beranda' : 'Back to Home', href: '/' },
					secondaryButton: { text: isId ? 'Minta Akses' : 'Request Access', href: '/kontak' },
					showSearch: false,
					showInfo: false
				};

			case 404:
				return {
					title: 'Oops!',
					subtitle: isId ? 'Halaman Tidak Ditemukan' : 'Page Not Found',
					description: isId
						? 'Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.'
						: 'The page you are looking for might have been moved or never existed.',
					image: '/images/errors/404.png',
					primaryButton: { text: isId ? 'Kembali ke Beranda' : 'Back to Home', href: '/' },
					secondaryButton: { text: isId ? 'Hubungi Kami' : 'Contact Us', href: '/kontak' },
					showSearch: true,
					showInfo: false
				};

			default:
				return {
					title: code.toString(),
					subtitle: isId ? 'Kesalahan Server' : 'Server Error',
					description: isId
						? 'Maaf, terjadi kesalahan pada server kami. Silakan coba lagi nanti.'
						: 'Sorry, something went wrong on our server. Please try again later.',
					icon: `<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>`,
					primaryButton: { text: isId ? 'Muat Ulang' : 'Reload Page', action: 'reload' },
					secondaryButton: { text: isId ? 'Kembali ke Beranda' : 'Back to Home', href: '/' },
					showSearch: false,
					showInfo: true,
					infoText: isId
						? 'Saran: Tunggu beberapa saat dan muat ulang halaman.'
						: 'Suggestion: Wait a moment and reload the page.'
				};
		}
	}

	function handlePrimaryAction() {
		if (browser && errorContent.primaryButton.action === 'reload') {
			window.location.reload();
		}
	}
</script>

<svelte:head>
	<title>{errorContent.title} - {errorContent.subtitle} | PPID Provinsi Sulawesi Selatan</title>
</svelte:head>

<div
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-ppid-primary via-[#5e091e] to-ppid-accent px-4 py-12 text-white"
>
	<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
		<div
			class="absolute -top-40 -right-40 h-96 w-96 animate-pulse rounded-full bg-ppid-accent opacity-20 blur-3xl"
		></div>
	</div>

	<main class="relative z-10 w-full max-w-4xl text-center">
		<div class="animate-bounce-slow mb-8 flex justify-center">
			{#if errorContent.image}
				<img
					src={errorContent.image}
					alt="Ilustrasi error {status}"
					class="w-full max-w-md drop-shadow-2xl"
				/>
			{:else if errorContent.icon}
				<div class="h-48 w-48 opacity-90 drop-shadow-2xl">
					{@html errorContent.icon}
				</div>
			{/if}
		</div>

		<div class="space-y-6">
			<h1 class="text-5xl font-bold md:text-7xl">{errorContent.title}</h1>
			<h2 class="text-2xl font-semibold text-ppid-accent md:text-3xl" role="doc-subtitle">
				{errorContent.subtitle}
			</h2>
			<p class="mx-auto max-w-2xl text-base text-slate-200 md:text-lg">
				{errorContent.description}
			</p>

			{#if errorContent.showSearch}
				<div class="mx-auto mt-8 max-w-xl">
					<form action="/berita" method="GET" class="relative">
						<label for="error-search" class="sr-only">Cari berita</label>
						<input
							id="error-search"
							type="search"
							name="search"
							placeholder={currentLang === 'id' ? 'Cari berita...' : 'Search news...'}
							class="w-full rounded-2xl border-2 border-white/20 bg-white/10 px-6 py-4 pr-14 text-white outline-hidden backdrop-blur-md focus:border-ppid-accent focus:ring-4 focus:ring-ppid-accent/30"
						/>
						<button
							type="submit"
							aria-label="Cari"
							class="absolute top-1/2 right-2 -translate-y-1/2 rounded-xl bg-ppid-accent p-3 text-ppid-primary transition-colors hover:bg-white"
						>
							<svg
								class="h-5 w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</button>
					</form>
				</div>
			{/if}

			<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
				{#if errorContent.primaryButton.action === 'reload'}
					<button
						onclick={handlePrimaryAction}
						class="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-ppid-primary shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-ppid-accent hover:text-white"
					>
						<svg
							class="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						</svg>
						{errorContent.primaryButton.text}
					</button>
				{:else}
					<a
						href={errorContent.primaryButton.href}
						class="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-ppid-primary shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-ppid-accent hover:text-white"
					>
						{errorContent.primaryButton.text}
					</a>
				{/if}

				<a
					href={errorContent.secondaryButton.href}
					target={errorContent.secondaryButton.external ? '_blank' : undefined}
					rel={errorContent.secondaryButton.external ? 'noopener noreferrer' : undefined}
					class="rounded-2xl border-2 border-white/40 bg-transparent px-8 py-4 font-semibold transition-all duration-300 hover:border-white hover:bg-white/10"
				>
					{errorContent.secondaryButton.text}
				</a>
			</div>
		</div>
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
	}

	@keyframes bounce-slow {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-15px);
		}
	}

	.animate-bounce-slow {
		animation: bounce-slow 4s ease-in-out infinite;
	}
</style>
