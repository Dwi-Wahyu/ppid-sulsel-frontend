<script>
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages.js';

	// Get error details
	$: status = $page.status;
	$: message = $page.error?.message || 'An error occurred';

	// Detect language from URL path - same pattern as other components
	$: currentLang = $page.url.pathname.startsWith('/en') ? 'en' : 'id';

	// Error content based on status
	$: errorContent = getErrorContent(status, currentLang);

	function getErrorContent(code, lang) {
		const isId = lang === 'id';

		switch (code) {
			case 403:
				return {
					title: '403',
					subtitle: isId ? 'Akses Ditolak' : 'Access Forbidden',
					description: isId
						? 'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.'
						: "Sorry, you don't have permission to access this page. Please contact the administrator if you believe this is an error.",
					icon: `<svg class="w-full h-full text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>`,
					primaryButton: { text: isId ? 'Kembali ke Beranda' : 'Back to Home', href: '/' },
					secondaryButton: { text: isId ? 'Minta Akses' : 'Request Access', href: '/kontak' },
					showInfo: false
				};

			case 404:
				return {
					title: 'Oops!',
					subtitle: isId ? 'Halaman Tidak Ditemukan' : 'Page Not Found',
					description: isId
						? 'Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.'
						: 'The page you are looking for might have been moved, removed, or never existed.',
					image: '/images/errors/404.png',
					primaryButton: { text: isId ? 'Kembali ke Beranda' : 'Back to Home', href: '/' },
					secondaryButton: { text: isId ? 'Hubungi Kami' : 'Contact Us', href: '/kontak' },
					showSearch: true,
					showInfo: false
				};

			case 503:
				return {
					title: '503',
					subtitle: isId ? 'Layanan Tidak Tersedia' : 'Service Unavailable',
					description: isId
						? 'Situs sedang dalam pemeliharaan untuk meningkatkan layanan kami. Kami akan segera kembali. Terima kasih atas kesabaran Anda.'
						: "The site is under maintenance to improve our services. We'll be back soon. Thank you for your patience.",
					icon: `<svg class="w-full h-full text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>`,
					primaryButton: { text: isId ? 'Coba Lagi' : 'Try Again', action: 'reload' },
					secondaryButton: {
						text: isId ? 'Cek Update' : 'Check Updates',
						href: 'https://twitter.com/pemprov_sulsel',
						external: true
					},
					showInfo: true,
					infoTitle: isId ? 'Status: Sedang Pemeliharaan' : 'Status: Under Maintenance',
					infoText: isId
						? 'Kami sedang melakukan peningkatan sistem untuk memberikan pengalaman yang lebih baik. Silakan kembali dalam beberapa saat.'
						: "We're performing system upgrades to provide you with a better experience. Please check back in a few moments."
				};

			default:
				// 500 or other errors
				return {
					title: '500',
					subtitle: isId ? 'Kesalahan Server Internal' : 'Internal Server Error',
					description: isId
						? 'Maaf, terjadi kesalahan pada server kami. Tim teknis kami telah diberi tahu dan sedang bekerja untuk memperbaikinya. Silakan coba lagi nanti.'
						: 'Sorry, something went wrong on our server. Our technical team has been notified and is working to fix it. Please try again later.',
					icon: `<svg class="w-full h-full text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>`,
					primaryButton: { text: isId ? 'Muat Ulang' : 'Reload Page', action: 'reload' },
					secondaryButton: { text: isId ? 'Kembali ke Beranda' : 'Back to Home', href: '/' },
					showInfo: true,
					infoTitle: null,
					infoText: isId
						? '<strong>Saran:</strong> Tunggu beberapa saat dan muat ulang halaman. Jika masalah berlanjut, hubungi dukungan teknis kami.'
						: '<strong>Suggestion:</strong> Wait a moment and reload the page. If the problem persists, contact our technical support.'
				};
		}
	}

	function handlePrimaryAction() {
		if (errorContent.primaryButton.action === 'reload') {
			window.location.reload();
		}
	}
</script>

<svelte:head>
	<title>{status} - {errorContent.subtitle} | PPID Provinsi Sulawesi Selatan</title>
</svelte:head>

<!-- Background with Burgundy gradient -->
<div
	class="relative min-h-screen overflow-hidden bg-gradient-to-br from-ppid-primary via-[#5e091e] to-[#2a000a]"
>
	<!-- Decorative Elements -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<!-- Animated Blobs -->
		<div
			class="absolute -top-40 -right-40 h-96 w-96 animate-pulse rounded-full bg-ppid-accent opacity-20 blur-3xl"
		></div>
		<div
			class="absolute -bottom-40 -left-40 h-96 w-96 animate-pulse rounded-full bg-red-600 opacity-20 blur-3xl"
			style="animation-delay: 1s;"
		></div>

		<!-- Grid Pattern -->
		<div
			class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ij48cGF0aCBkPSJNMzYgMzR2MmgtMnYtMmgydm0wLTR2MmgtMnYtMmgydm0wLTR2MmgtMnYtMmgydm0wLTR2MmgtMnYtMmgydm0wLTR2MmgtMnYtMmgydm0tNCAwdjJoLTJ2LTJoMnptLTQgMHYyaC0ydi0yaDJ6bS00IDB2MmgtMnYtMmgydm0tNCAwdjJoLTJ2LTJoMnptLTQgMHYyaC0ydi0yaDJ6bS00IDB2MmgtMnYtMmgydm0tNCAwdjJoLTJ2LTJoMnptLTQgMHYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"
		></div>
	</div>

	<!-- Main Content -->
	<div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
		<div class="w-full max-w-4xl text-center">
			<!-- 3D Illustration or Icon -->
			<div class="mb-8 animate-[float_6s_ease-in-out_infinite]">
				{#if errorContent.image}
					<img
						src={errorContent.image}
						alt="{status} Illustration"
						class="mx-auto w-full max-w-md drop-shadow-2xl"
						onerror={(e) => {
							e.currentTarget.style.display = 'none';
						}}
					/>
				{:else if errorContent.icon}
					<div class="mx-auto h-48 w-48 opacity-90 drop-shadow-2xl">
						{@html errorContent.icon}
					</div>
				{/if}
			</div>

			<!-- Error Content -->
			<div class="space-y-6">
				<!-- Title -->
				<h1 class="mb-4 text-5xl font-bold text-white md:text-7xl">
					{errorContent.title}
				</h1>

				<!-- Subtitle -->
				<h2 class="text-2xl font-semibold text-ppid-accent md:text-3xl">
					{errorContent.subtitle}
				</h2>

				<!-- Description -->
				<p class="mx-auto max-w-2xl text-base text-slate-200 md:text-lg">
					{errorContent.description}
				</p>

				<!-- Search Box (for 404) -->
				{#if errorContent.showSearch}
					<div class="mx-auto mt-8 max-w-xl">
						<form action="/berita" method="GET" class="relative">
							<input
								type="text"
								name="search"
								placeholder={currentLang === 'id' ? 'Cari berita...' : 'Search news...'}
								class="w-full rounded-2xl border-2 border-white/20 bg-white/10 px-6 py-4 pr-14 text-white placeholder-slate-300 backdrop-blur-md transition-all focus:border-ppid-accent focus:ring-4 focus:ring-ppid-accent/30 focus:outline-none"
							/>
							<button
								type="submit"
								class="absolute top-1/2 right-2 -translate-y-1/2 rounded-xl bg-ppid-accent p-3 text-ppid-primary transition-colors hover:bg-white hover:text-ppid-primary"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

				<!-- Info Box -->
				{#if errorContent.showInfo}
					<div
						class="mx-auto mt-6 max-w-xl rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md"
					>
						{#if errorContent.infoTitle}
							<div class="mb-3 flex items-center justify-center gap-3">
								<div class="h-3 w-3 animate-pulse rounded-full bg-ppid-accent"></div>
								<p class="text-sm font-medium text-white">
									{errorContent.infoTitle}
								</p>
							</div>
						{/if}
						<p class="text-sm text-slate-200">
							{@html errorContent.infoText}
						</p>
					</div>
				{/if}

				<!-- Action Buttons -->
				<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<!-- Primary Button -->
					{#if errorContent.primaryButton.action === 'reload'}
						<button
							onclick={handlePrimaryAction}
							class="group transform rounded-2xl bg-white px-8 py-4 font-semibold text-ppid-primary shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-ppid-accent hover:text-white hover:shadow-xl"
						>
							<span class="flex items-center gap-2">
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									/>
								</svg>
								{errorContent.primaryButton.text}
							</span>
						</button>
					{:else}
						<a
							href={errorContent.primaryButton.href}
							class="group transform rounded-2xl bg-white px-8 py-4 font-semibold text-ppid-primary shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-ppid-accent hover:text-white hover:shadow-xl"
						>
							<span class="flex items-center gap-2">
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
									/>
								</svg>
								{errorContent.primaryButton.text}
							</span>
						</a>
					{/if}

					<!-- Secondary Button -->
					<a
						href={errorContent.secondaryButton.href}
						target={errorContent.secondaryButton.external ? '_blank' : undefined}
						rel={errorContent.secondaryButton.external ? 'noopener noreferrer' : undefined}
						class="transform rounded-2xl border-2 border-white/40 bg-transparent px-8 py-4 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white/10"
					>
						<span class="flex items-center gap-2">
							{#if errorContent.secondaryButton.external}
								<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
									/>
								</svg>
							{:else}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							{/if}
							{errorContent.secondaryButton.text}
						</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-20px);
		}
	}
</style>
