<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { onMount } from 'svelte';

	let { data } = $props();

	// Scroll to top button
	let showScrollTop = $state(false);

	onMount(() => {
		const handleScroll = () => {
			showScrollTop = window.scrollY > 300;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>{data.skpd.nm_skpd} - PPID Pelaksana</title>
</svelte:head>

<div class="relative min-h-screen overflow-x-hidden bg-gray-50 pb-20 dark:bg-slate-900">
	<!-- Hero Header with Pattern  -->
	<div class="relative h-[400px] overflow-hidden bg-ppid-primary">
		<!-- Modern Geometric Pattern Overlay -->
		<div class="absolute inset-0 opacity-10">
			<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
				<pattern id="motif" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
					<path
						d="M0 40L40 0H20L0 20M40 40V20L20 40"
						class="stroke-ppid-accent"
						stroke-width="2"
						fill="none"
					/>
				</pattern>
				<rect width="100%" height="100%" fill="url(#motif)" />
			</svg>
		</div>

		<!-- Gradient Overlay -->
		<div
			class="absolute inset-0 bg-gradient-to-b from-ppid-primary/80 via-ppid-primary/90 to-ppid-primary"
		></div>

		<!-- Breadcrumb & Title Area -->
		<div class="relative mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
			<!-- Breadcrumb -->
			<nav
				class="mb-6 inline-flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 backdrop-blur-sm"
			>
				<a href="/" class="transition-colors hover:text-ppid-accent">Beranda</a>
				<span class="text-gray-500">/</span>
				<a href="/ppid-pelaksana" class="transition-colors hover:text-ppid-accent">PPID Pelaksana</a
				>
				<span class="text-gray-500">/</span>
				<span class="font-medium text-ppid-accent">Detail</span>
			</nav>

			<h1 class="mb-3 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
				Profil <span class="text-ppid-accent">SKPD</span>
			</h1>
			<p class="mx-auto max-w-2xl text-base leading-relaxed text-gray-200 md:text-lg">
				Informasi detail mengenai Pejabat Pengelola Informasi dan Dokumentasi Pelaksana
			</p>
		</div>
	</div>

	<!-- Floating Profile Card -->
	<div class="relative z-10 mx-auto -mt-40 max-w-7xl px-4 sm:px-6 lg:px-8">
		<div
			class="overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-800"
		>
			<div class="relative overflow-hidden p-10 md:p-14">
				<!-- Decorative Blur -->
				<div
					class="pointer-events-none absolute top-0 right-0 -mt-24 -mr-24 h-48 w-48 rounded-full bg-ppid-accent/5 blur-2xl"
				></div>

				<div class="relative z-10 flex flex-col items-center gap-8 md:flex-row md:items-center">
					<!-- Logo -->
					<div class="relative flex-shrink-0">
						<div
							class="relative flex h-32 w-32 items-center justify-center rounded-3xl border-2 border-gray-100 bg-white shadow-xl md:h-40 md:w-40 dark:border-slate-600 dark:bg-slate-700"
						>
							<img
								src={data.skpd.logo
									? `${PUBLIC_API_URL}/storage/logo-skpd/${data.skpd.logo}`
									: '/images/logo-sulsel.png'}
								alt="Logo {data.skpd.nm_skpd}"
								class="h-28 w-28 object-contain p-2 md:h-32 md:w-32"
							/>
						</div>
					</div>

					<!-- Info -->
					<div class="flex-1 text-center md:text-left">
						<div
							class="mb-4 inline-flex items-center gap-2 rounded-full border border-ppid-accent/30 bg-gradient-to-r from-ppid-accent/15 to-ppid-accent/5 px-3 py-1.5 text-xs font-bold text-[#C4941F]"
						>
							<span class="h-2 w-2 rounded-full bg-ppid-accent"></span>
							PPID PELAKSANA PROVINSI SULSEL
						</div>
						<h2
							class="mb-5 text-2xl leading-tight font-bold text-ppid-primary md:text-3xl lg:text-4xl dark:text-white"
						>
							{data.skpd.nm_skpd}
						</h2>
						<div class="flex flex-wrap justify-center gap-4 md:justify-start">
							{#if data.skpd.alamat}
								<div class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
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
										class="flex-shrink-0 text-ppid-accent"
									>
										<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
										<circle cx="12" cy="10" r="3" />
									</svg>
									<span class="line-clamp-1 text-left text-base">{data.skpd.alamat}</span>
								</div>
							{/if}
							{#if data.skpd.website}
								<a
									href={data.skpd.website}
									target="_blank"
									class="flex items-center gap-2 text-gray-600 transition-colors hover:text-ppid-primary dark:text-gray-300 dark:hover:text-ppid-accent"
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
										class="flex-shrink-0 text-ppid-accent"
									>
										<circle cx="12" cy="12" r="10" />
										<line x1="2" x2="22" y1="12" y2="12" />
										<path
											d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"
										/>
									</svg>
									<span class="text-base font-medium">Kunjungi Website</span>
								</a>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content Grid -->
	<div class="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Left Content (2 Cols) -->
			<div class="space-y-10 lg:col-span-2">
				<!-- Leadership Cards -->
				{#if data.skpd.kadis || data.skpd.sek}
					<section>
						<div class="mb-6 flex items-center gap-4">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-xl bg-ppid-primary text-white shadow-lg shadow-ppid-primary/20"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
									<circle cx="9" cy="7" r="4" />
									<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
									<path d="M16 3.13a4 4 0 0 1 0 7.75" />
								</svg>
							</div>
							<h3 class="text-2xl font-bold text-ppid-primary md:text-3xl dark:text-white">
								Pimpinan SKPD
							</h3>
						</div>

						<div class="grid gap-6 md:grid-cols-2">
							{#if data.skpd.kadis}
								<div
									class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-shadow hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
								>
									<div
										class="absolute top-0 right-0 h-20 w-20 rounded-bl-[3rem] bg-gradient-to-br from-ppid-primary/3 to-ppid-accent/3 transition-transform group-hover:scale-110"
									></div>
									<p class="mb-3 text-sm font-bold tracking-wider text-ppid-accent uppercase">
										Kepala Dinas
									</p>
									<h4
										class="text-xl leading-relaxed font-bold text-ppid-primary md:text-2xl dark:text-white"
									>
										{data.skpd.kadis}
									</h4>
								</div>
							{/if}

							{#if data.skpd.sek}
								<div
									class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-shadow hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
								>
									<div
										class="absolute top-0 right-0 h-20 w-20 rounded-bl-[3rem] bg-gradient-to-br from-ppid-primary/3 to-ppid-accent/3 transition-transform group-hover:scale-110"
									></div>
									<p class="mb-3 text-sm font-bold tracking-wider text-ppid-accent uppercase">
										Sekretaris
									</p>
									<h4
										class="text-xl leading-relaxed font-bold text-ppid-primary md:text-2xl dark:text-white"
									>
										{data.skpd.sek}
									</h4>
								</div>
							{/if}
						</div>
					</section>
				{/if}

				<!-- Visi Misi Section -->
				{#if data.skpd.visimisi}
					<section
						class="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800"
					>
						<!-- Decorative -->
						<div
							class="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-ppid-primary to-ppid-accent"
						></div>

						<div class="mb-6 flex items-center gap-4">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg bg-ppid-accent/10 text-ppid-accent"
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
									<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
									<circle cx="12" cy="12" r="3" />
								</svg>
							</div>
							<h3 class="text-2xl font-bold text-ppid-primary md:text-3xl dark:text-white">
								Visi & Misi
							</h3>
						</div>

						<div class="prose prose-lg max-w-none prose-slate dark:prose-invert">
							<div class="text-base leading-relaxed text-gray-700 md:text-lg dark:text-gray-200">
								{@html data.skpd.visimisi}
							</div>
						</div>
					</section>
				{/if}

				<!-- Content Sections -->
				<div class="space-y-6">
					<!-- Tupoksi -->
					{#if data.skpd.tupoksi}
						<div
							class="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800"
						>
							<div class="mb-6 flex items-center gap-4">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-lg bg-ppid-primary/10 text-ppid-primary"
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
										<path
											d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
										/>
										<polyline points="14 2 14 8 20 8" />
									</svg>
								</div>
								<h3 class="text-2xl font-bold text-ppid-primary md:text-3xl dark:text-white">
									Tugas Pokok & Fungsi
								</h3>
							</div>
							<div class="prose prose-lg max-w-none prose-slate dark:prose-invert">
								<div class="text-base leading-relaxed text-gray-700 md:text-lg dark:text-gray-200">
									{@html data.skpd.tupoksi}
								</div>
							</div>
						</div>
					{/if}

					<!-- Tujuan -->
					{#if data.skpd.tujuan}
						<div
							class="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800"
						>
							<div class="mb-6 flex items-center gap-4">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-lg bg-ppid-primary/10 text-ppid-primary"
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
										<circle cx="12" cy="12" r="10" />
										<polyline points="12 6 12 12 16 14" />
									</svg>
								</div>
								<h3 class="text-2xl font-bold text-ppid-primary md:text-3xl dark:text-white">
									Tujuan
								</h3>
							</div>
							<div class="prose prose-lg max-w-none prose-slate dark:prose-invert">
								<div class="text-base leading-relaxed text-gray-700 md:text-lg dark:text-gray-200">
									{@html data.skpd.tujuan}
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Right Sidebar (1 Col) -->
			<div class="lg:col-span-1">
				<!-- Sticky Contact Card -->
				<div class="lg:sticky lg:top-24">
					<div
						class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ppid-primary to-[#2d4a8f] p-8 text-white shadow-2xl"
					>
						<!-- Pattern Overlay -->
						<div class="absolute inset-0 opacity-10">
							<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
								<circle cx="100%" cy="0" r="100" class="fill-ppid-accent" />
								<circle cx="0" cy="100%" r="80" class="fill-ppid-accent" />
							</svg>
						</div>

						<h3 class="relative z-10 mb-6 flex items-center gap-2 text-xl font-bold">
							<span class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path
										d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
									/>
								</svg>
							</span>
							Kontak Kami
						</h3>

						<div class="relative z-10 space-y-6">
							<!-- Phone -->
							{#if data.skpd.no_tlp}
								<div>
									<p class="mb-1.5 text-sm font-bold tracking-wider text-white/70 uppercase">
										Telepon
									</p>
									<a
										href="tel:{data.skpd.no_tlp}"
										class="text-xl font-bold transition-colors hover:text-ppid-accent"
									>
										{data.skpd.no_tlp}
									</a>
								</div>
							{/if}

							<!-- Email -->
							{#if data.skpd.email}
								<div>
									<p class="mb-1.5 text-sm font-bold tracking-wider text-white/70 uppercase">
										Email
									</p>
									<a
										href="mailto:{data.skpd.email}"
										class="text-lg font-medium break-all transition-colors hover:text-ppid-accent"
									>
										{data.skpd.email}
									</a>
								</div>
							{/if}

							<!-- Address -->
							{#if data.skpd.alamat}
								<div>
									<p class="mb-1.5 text-sm font-bold tracking-wider text-white/70 uppercase">
										Alamat
									</p>
									<p class="text-base leading-relaxed text-white/95">{data.skpd.alamat}</p>
								</div>
							{/if}
						</div>

						<!-- Divider -->
						<div class="my-8 h-px bg-white/20"></div>

						<!-- Back Button -->
						<a
							href="/ppid-pelaksana"
							class="block w-full transform rounded-xl bg-ppid-accent py-4 text-center font-bold text-ppid-primary shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#bfa035]"
						>
							Kembali ke Daftar
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Scroll to Top Button -->
{#if showScrollTop}
	<button
		onclick={scrollToTop}
		class="fixed right-8 bottom-8 z-50 rounded-full bg-ppid-primary p-4 text-white shadow-2xl transition-all duration-300 hover:bg-[#2d4a8f]"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m18 15-6-6-6 6" />
		</svg>
	</button>
{/if}
