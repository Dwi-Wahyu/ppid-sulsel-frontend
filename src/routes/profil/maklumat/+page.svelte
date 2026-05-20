<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getImageUrl } from '$lib/get-image-url';

	interface ProfilData {
		deskripsi: string;
		file_banner: string | null;
	}

	let profil = $state<ProfilData>({
		deskripsi: '',
		file_banner: null
	});

	let isLoading = $state(true);

	onMount(async () => {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/public/profil/maklumat`);
			const result = await response.json();
			if (result.success && result.data) {
				profil.deskripsi = result.data.deskripsi || '';
				if (result.data.file_banner) {
					profil.file_banner = getImageUrl(result.data.file_banner);
				}
			}
		} catch (error) {
			console.error('Error fetching Maklumat:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>{m['maklumat.title']()} - PPID Provinsi Sulawesi Selatan</title>
</svelte:head>

<main class="min-h-screen bg-white transition-colors dark:bg-slate-900">
	<PageTitle title={m['maklumat.title']()} />

	<div class="container mx-auto px-4 py-12">
		<div class="mx-auto max-w-4xl">
			<Breadcrumb
				items={[{ label: m['common.home'](), href: '/' }, { label: m['maklumat.title']() }]}
				class="mb-10"
			/>

			<!-- Maklumat Banner -->
			<div class="mb-12 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
				{#if isLoading}
					<div class="flex aspect-video items-center justify-center">
						<div class="h-10 w-10 animate-spin rounded-full border-4 border-ppid-primary border-t-transparent"></div>
					</div>
				{:else if profil.file_banner}
					{#if profil.file_banner.toLowerCase().endsWith('.pdf')}
						<iframe
							src={profil.file_banner}
							title="Maklumat Pelayanan"
							class="h-[800px] w-full"
						></iframe>
					{:else}
						<img
							src={profil.file_banner}
							alt="Maklumat Pelayanan"
							class="h-full w-full object-contain"
						/>
					{/if}
				{:else}
					<div class="flex aspect-video flex-col items-center justify-center p-12 text-center">
						<div class="mb-4 text-slate-300">
							<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
						</div>
						<p class="font-medium text-slate-400">Gambar maklumat belum tersedia.</p>
					</div>
				{/if}
			</div>

			<!-- Maklumat Content -->
			<div class="prose prose-lg mb-12 max-w-none dark:prose-invert prose-headings:font-black prose-headings:text-ppid-primary prose-a:text-ppid-primary">
				{#if isLoading}
					<div class="space-y-4">
						<div class="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
						<div class="h-4 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
						<div class="h-4 w-4/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
					</div>
				{:else}
					{@html profil.deskripsi || '<p class="text-slate-400">Deskripsi belum ditambahkan.</p>'}
				{/if}
			</div>

			<!-- Additional Info/Notice -->
			<div
				class="rounded-xl bg-linear-to-br from-ppid-primary to-ppid-text p-6 text-center text-white md:p-8"
			>
				<h3 class="mb-2 text-lg font-bold">{m['maklumat.info_complaint_title']()}</h3>
				<p class="text-sm text-white/90">
					{m['maklumat.info_complaint_desc']()}
				</p>
			</div>
		</div>
	</div>
</main>

<Footer />
