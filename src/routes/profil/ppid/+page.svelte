<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	interface ProfilData {
		deskripsi: string;
	}

	let profil = $state<ProfilData>({
		deskripsi: ''
	});
	let isLoading = $state(true);

	onMount(async () => {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/public/profil/ppid`);
			const result = await response.json();
			if (result.success) {
				profil.deskripsi = result.data.deskripsi;
			}
		} catch (error) {
			console.error('Error fetching PPID profile:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<!-- Breadcrumb + Title Section -->
<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-6">
		<Breadcrumb
			items={[{ label: 'breadcrumb.profile', href: '#' }, { label: 'profile.ppid_title' }]}
		/>

		<div class="mt-4">
			<PageTitle title={m['profile.ppid_title']()} />
		</div>
	</div>
</div>

<!-- Main Content -->
<main class="bg-gray-50 py-10 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<!-- Intro Section with Sidebar Layout -->
		<div class="mx-auto mb-12 grid max-w-6xl gap-8 lg:grid-cols-2">
			<!-- Dynamic Content -->
			<div
				class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="prose max-w-none prose-slate dark:prose-invert">
					{@html profil.deskripsi}
				</div>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Feature Cards -->
				<div
					class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<h3
						class="mb-4 text-sm font-bold tracking-wide text-ppid-primary uppercase dark:text-white"
					>
						Prinsip Layanan
					</h3>
					<div class="space-y-4">
						<div class="flex items-start gap-3">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ppid-primary/10"
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
									class="h-5 w-5 text-ppid-primary dark:text-white"
								>
									<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
									<path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
									<path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
									<path d="M10 6h4" />
									<path d="M10 10h4" />
									<path d="M10 14h4" />
									<path d="M10 18h4" />
								</svg>
							</div>
							<div>
								<h4 class="mb-0.5 text-sm font-semibold text-gray-900 dark:text-white">
									Transparansi
								</h4>
								<p class="text-xs text-gray-600 dark:text-gray-300">
									Keterbukaan informasi publik untuk masyarakat
								</p>
							</div>
						</div>
						<div class="flex items-start gap-3">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ppid-text/10"
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
									class="h-5 w-5 text-ppid-text"
								>
									<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
								</svg>
							</div>
							<div>
								<h4 class="mb-0.5 text-sm font-semibold text-gray-900 dark:text-white">
									Akuntabilitas
								</h4>
								<p class="text-xs text-gray-600 dark:text-gray-300">
									Pengelolaan informasi yang bertanggung jawab
								</p>
							</div>
						</div>
						<div class="flex items-start gap-3">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ppid-accent/10"
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
									class="h-5 w-5 text-ppid-accent"
								>
									<circle cx="12" cy="8" r="7" />
									<polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
								</svg>
							</div>
							<div>
								<h4 class="mb-0.5 text-sm font-semibold text-gray-900 dark:text-white">
									Profesional
								</h4>
								<p class="text-xs text-gray-600 dark:text-gray-300">
									Layanan prima untuk seluruh masyarakat
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Landasan Hukum -->
				<div class="rounded-xl bg-ppid-primary p-6 text-white shadow-sm">
					<h3 class="mb-4 text-sm font-bold tracking-wide uppercase">Landasan Hukum</h3>
					<div class="space-y-3 text-sm">
						<div class="flex items-start gap-2">
							<div class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ppid-accent"></div>
							<p class="text-white/90">UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik</p>
						</div>
						<div class="flex items-start gap-2">
							<div class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ppid-accent"></div>
							<p class="text-white/90">PP No. 61 Tahun 2010 tentang Pelaksanaan UU KIP</p>
						</div>
						<div class="flex items-start gap-2">
							<div class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ppid-accent"></div>
							<p class="text-white/90">Peraturan Komisi Informasi No. 1 Tahun 2010</p>
						</div>
						<div class="flex items-start gap-2">
							<div class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ppid-accent"></div>
							<p class="text-white/90">Peraturan Gubernur Sulawesi Selatan</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<Footer />
