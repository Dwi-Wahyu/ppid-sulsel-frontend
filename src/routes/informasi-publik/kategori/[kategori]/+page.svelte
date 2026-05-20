<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { getImageUrl } from '$lib/get-image-url';

	// Mengambil props dari load function
	let { data } = $props();

	// State untuk form input
	let searchQuery = $state('');

	// Reaktif terhadap perubahan data filter
	$effect(() => {
		searchQuery = data.filters.search || '';
	});

	// Data informasi dari hasil fetch SSR
	let informasi = $derived(data.informasiData.data.data);
	let pagination = $derived(data.informasiData.data);
	let category = $derived(data.informasiData.category);

	// Fungsi untuk memperbarui pencarian
	function handleSearch(e: Event) {
		e.preventDefault();
		const url = new URL(page.url);
		url.searchParams.set('search', searchQuery);
		url.searchParams.set('page', '1'); // Reset ke halaman pertama saat mencari
		goto(url.toString());
	}

	// Fungsi untuk berpindah halaman
	function changePage(pageNumber: number | string) {
		if (typeof pageNumber === 'string' && pageNumber === '...') return;

		const url = new URL(page.url);
		url.searchParams.set('page', pageNumber.toString());
		goto(url.toString());
	}

	// Helper untuk format ekstensi file
	function getFileExt(file: string) {
		if (!file) return '-';
		return file.split('.').pop()?.toUpperCase() ?? '-';
	}
</script>

<svelte:head>
	<title>{category?.nm_kat_info || 'Informasi Publik'} - PPID Provinsi Sulawesi Selatan</title>
</svelte:head>

<main class="min-h-screen bg-gray-50 py-12 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<!-- Header Kategori -->
		<div class="mb-10 text-center">
			<span
				class="mb-3 inline-block rounded-full bg-ppid-primary/10 px-4 py-1.5 text-xs font-bold text-ppid-primary uppercase tracking-widest"
			>
				{m['public_info.category_title']()}
			</span>
			<h1 class="text-3xl font-black text-gray-900 md:text-4xl dark:text-white">
				{category?.nm_kat_info}
			</h1>
		</div>

		<!-- Search Bar -->
		<div class="mx-auto mb-10 max-w-2xl">
			<form onsubmit={handleSearch} class="relative">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder={m['public_info.search_placeholder']()}
					class="w-full rounded-2xl border-none bg-white py-4 pr-32 pl-6 shadow-lg shadow-gray-200/50 ring-2 ring-transparent transition-all focus:ring-ppid-primary/20 dark:bg-slate-800 dark:text-white dark:shadow-none"
				/>
				<button
					type="submit"
					class="absolute top-2 right-2 rounded-xl bg-ppid-primary px-6 py-2.5 font-bold text-white transition-transform hover:bg-ppid-primary/90 active:scale-95"
				>
					{m['public_info.search_button']()}
				</button>
			</form>
		</div>

		<!-- Dokumen Grid/List -->
		<div class="mx-auto max-w-5xl space-y-4">
			{#if informasi.length === 0}
				<div class="rounded-3xl bg-white py-20 text-center dark:bg-slate-800">
					<p class="text-lg font-medium text-gray-400">
						{m['public_info.no_data']()}
					</p>
				</div>
			{:else}
				{#each informasi as item}
					<div
						class="group flex flex-col items-start justify-between gap-4 rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:border-ppid-primary/20 hover:shadow-xl hover:shadow-gray-200/40 md:flex-row md:items-center dark:border-slate-800 dark:bg-slate-800 dark:hover:shadow-none"
					>
						<div class="flex flex-1 items-start gap-4 overflow-hidden">
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 transition-colors group-hover:bg-ppid-primary/10 group-hover:text-ppid-primary dark:bg-slate-900"
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
									<polyline points="14 2 14 8 20 8" />
									<line x1="16" y1="13" x2="8" y2="13" />
									<line x1="16" y1="17" x2="8" y2="17" />
									<polyline points="10 9 9 9 8 9" />
								</svg>
							</div>
							<div class="min-w-0 flex-1">
								<h3
									class="mb-1 truncate text-lg font-bold text-gray-900 transition-colors group-hover:text-ppid-primary dark:text-white"
								>
									{item.judul}
								</h3>
								<div class="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-400">
									<span class="flex items-center gap-1">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
											<line x1="16" y1="2" x2="16" y2="6" />
											<line x1="8" y1="2" x2="8" y2="6" />
											<line x1="3" y1="10" x2="21" y2="10" />
										</svg>
										{new Date(item.tgl_upload).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
									</span>
									<span class="flex items-center gap-1">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
											<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
										</svg>
										{item.skpd.nm_skpd}
									</span>
									<span class="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-black uppercase dark:bg-slate-900">
										{getFileExt(item.file)}
									</span>
								</div>
							</div>
						</div>

						<div class="flex w-full items-center justify-end gap-2 md:w-auto">
							<a
								href="/informasi-publik/detail/{item.id_informasi}"
								class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-50 px-5 py-2.5 text-sm font-bold text-gray-600 transition-all hover:bg-gray-100 md:flex-none dark:bg-slate-900 dark:text-gray-400 dark:hover:bg-slate-700"
							>
								{m['public_info.view_details']()}
							</a>
							{#if item.file}
								<a
									href={item.file.startsWith('http') ? item.file : getImageUrl(item.file)}
									aria-label={m['public_info.download']()}
									download
									class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ppid-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-ppid-primary/20 transition-all hover:bg-ppid-primary/90 md:flex-none"
								>
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
										<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
										<polyline points="7 10 12 15 17 10" />
										<line x1="12" y1="15" x2="12" y2="3" />
									</svg>
									{m['public_info.download']()}
								</a>
							{/if}
						</div>
					</div>
				{/each}
			{/if}

			<!-- Paginasi -->
			{#if pagination.last_page > 1}
				<div class="mt-12 flex justify-center">
					<div class="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-2 shadow-lg dark:bg-slate-800">
						{#each pagination.links as link}
							<button
								onclick={() => changePage(link.url ? new URL(link.url).searchParams.get('page') || 1 : '...')}
								disabled={!link.url || link.active}
								class="flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl px-3 text-sm font-bold transition-all
                {link.active 
									? 'bg-ppid-primary text-white shadow-md shadow-ppid-primary/20' 
									: 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-slate-800 dark:text-gray-200'}"
							>
								{@html link.label}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</main>
