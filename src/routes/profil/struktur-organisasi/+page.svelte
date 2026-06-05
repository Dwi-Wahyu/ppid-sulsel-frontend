<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getImageUrl } from '$lib/get-image-url';
	import { api } from '$lib/api';

	interface ProfilData {
		struktur_organisasi_path: string | null;
	}

	let profil = $state<ProfilData>({
		struktur_organisasi_path: null
	});

	let isLoading = $state(true);

	onMount(async () => {
		try {
			const result = await api.get('/public/profil/struktur-organisasi');

			if (result.success && result.data) {
				const path = result.data.struktur_organisasi_path;
				if (path) {
					profil.struktur_organisasi_path = getImageUrl(path);
				}
			}
		} catch (error) {
			console.error('Error fetching Struktur Organisasi:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>{m['profile.org_structure']()} - PPID Provinsi Sulawesi Selatan</title>
</svelte:head>

<!-- Breadcrumb + Title Section -->
<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-6">
		<Breadcrumb
			items={[{ label: m['common.home'](), href: '/' }, { label: m['profile.org_structure']() }]}
		/>

		<div class="mt-4">
			<PageTitle title={m['profile.org_structure']()} />
		</div>
	</div>
</div>

<!-- Main Content -->
<main class="bg-gray-50 py-10 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-5xl">
			<!-- Organization Chart Viewer -->
			<div
				class="mb-12 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-800"
			>
				<div
					class="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-700"
				>
					<h2 class="font-bold text-ppid-primary dark:text-white">
						{m['org_struct.chart_title']()}
					</h2>
					{#if profil.struktur_organisasi_path}
						<a
							href={profil.struktur_organisasi_path}
							target="_blank"
							class="flex items-center gap-2 text-sm font-bold text-ppid-primary hover:underline"
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
								<polyline points="15 3 21 3 21 9" />
								<line x1="10" y1="14" x2="21" y2="3" />
							</svg>
							Buka di Tab Baru
						</a>
					{/if}
				</div>

				<div class="bg-slate-100 dark:bg-slate-900">
					{#if isLoading}
						<div class="flex h-150 items-center justify-center">
							<div
								class="h-10 w-10 animate-spin rounded-full border-4 border-ppid-primary border-t-transparent"
							></div>
						</div>
					{:else if profil.struktur_organisasi_path}
						{#if profil.struktur_organisasi_path.toLowerCase().endsWith('.pdf')}
							<iframe
								src={profil.struktur_organisasi_path}
								title="Struktur Organisasi"
								class="h-200 w-full"
							></iframe>
						{:else}
							<div class="p-8">
								<img
									src={profil.struktur_organisasi_path}
									alt="Struktur Organisasi"
									class="mx-auto max-w-full rounded-xl shadow-sm"
								/>
							</div>
						{/if}
					{:else}
						<div class="flex h-80 flex-col items-center justify-center p-12 text-center">
							<div class="mb-4 text-slate-300">
								<svg
									width="64"
									height="64"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
								>
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
									<polyline points="14 2 14 8 20 8" />
								</svg>
							</div>
							<p class="font-medium text-slate-400">Dokumen struktur organisasi belum tersedia.</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Additional Details -->
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<div
					class="rounded-3xl border border-slate-100 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-800"
				>
					<div class="mb-6 flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-ppid-primary/10">
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
								<circle cx="12" cy="12" r="10" />
								<path d="M12 16v-4" />
								<path d="M12 8h.01" />
							</svg>
						</div>
						<h3 class="font-bold text-gray-900 dark:text-white">
							{m['org_struct.components_title']()}
						</h3>
					</div>
					<div class="space-y-3 text-sm text-gray-700">
						<div class="flex gap-3">
							<span class="mt-1 text-ppid-primary dark:text-white">•</span>
							<div>
								<strong class="text-gray-900 dark:text-white"
									>{m['org_struct.main_ppid_label']()}</strong
								>
								{m['org_struct.main_ppid_desc']()}
							</div>
						</div>
						<div class="flex gap-3">
							<span class="mt-1 text-ppid-primary dark:text-white">•</span>
							<div>
								<strong class="text-gray-900 dark:text-white"
									>{m['org_struct.asst_ppid_label']()}</strong
								>
								{m['org_struct.asst_ppid_desc']()}
							</div>
						</div>
						<div class="flex gap-3">
							<span class="mt-1 text-ppid-primary dark:text-white">•</span>
							<div>
								<strong class="text-gray-900 dark:text-white"
									>{m['org_struct.impl_ppid_label']()}</strong
								>
								{m['org_struct.impl_ppid_desc']()}
							</div>
						</div>
					</div>
				</div>

				<div class="rounded-lg border border-ppid-primary/10 bg-ppid-primary/5 p-6">
					<div class="mb-4 flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-ppid-primary">
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
								class="h-5 w-5 text-white"
							>
								<circle cx="12" cy="12" r="10" />
								<path d="M12 16v-4" />
								<path d="M12 8h.01" />
							</svg>
						</div>
						<h3 class="font-bold text-ppid-primary dark:text-white">
							{m['org_struct.coord_supervision_title']()}
						</h3>
					</div>
					<p class="mb-3 text-sm text-gray-700">
						{m['org_struct.coord_desc']()}
					</p>
					<div class="space-y-2 text-sm text-gray-700">
						<div class="flex gap-2">
							<span class="text-ppid-primary dark:text-white">•</span>
							<span>{m['org_struct.coord_points.p1']()}</span>
						</div>
						<div class="flex gap-2">
							<span class="text-ppid-primary dark:text-white">•</span>
							<span>{m['org_struct.coord_points.p2']()}</span>
						</div>
						<div class="flex gap-2">
							<span class="text-ppid-primary dark:text-white">•</span>
							<span>{m['org_struct.coord_points.p3']()}</span>
						</div>
						<div class="flex gap-2">
							<span class="text-ppid-primary dark:text-white">•</span>
							<span>{m['org_struct.coord_points.p4']()}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<Footer />
