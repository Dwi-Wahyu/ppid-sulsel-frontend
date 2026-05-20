<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { onMount } from 'svelte';
	import { getImageUrl } from '$lib/get-image-url';
	import * as m from '$lib/paraglide/messages.js';
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';

	// Types
	interface SopItem {
		id: number;
		judul: string;
		file: string;
		jumlah_download: number;
		id_skpd: number;
		created_at: string;
		skpd: {
			nm_skpd: string;
		};
	}

	interface Pagination {
		current_page: number;
		last_page: number;
		total: number;
	}

	// State
	let sopList = $state<SopItem[]>([]);
	let isLoading = $state(true);
	let currentPage = $state(1);
	let totalPages = $state(1);
	let searchTerm = $state('');
	let debounceTimer: any;

	async function fetchSop(page = 1, search = '') {
		isLoading = true;
		try {
			const query = new URLSearchParams({
				page: page.toString(),
				search: search
			});

			const response = await fetch(`${env.PUBLIC_API_URL}/public/sop?${query.toString()}`);
			const result = await response.json();

			if (result.success) {
				sopList = result.data.data;
				currentPage = result.data.current_page;
				totalPages = result.data.last_page;
			}
		} catch (error) {
			console.error('Failed to fetch SOP:', error);
		} finally {
			isLoading = false;
		}
	}

	function handleSearch() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			fetchSop(1, searchTerm);
		}, 500);
	}

	async function handleDownload(id: number, filename: string) {
		try {
			// Trigger download counter in Laravel
			await fetch(`${env.PUBLIC_API_URL}/public/sop/download/${id}`);

			// Open file in new tab
			window.open(getImageUrl(`sop/${filename}`), '_blank');

			// Refresh data to update download count locally
			fetchSop(currentPage, searchTerm);
		} catch (error) {
			console.error('Download failed:', error);
		}
	}

	function goToDetail(id: number) {
		goto(`/layanan/sop/${id}`);
	}

	onMount(() => {
		fetchSop();
	});
</script>

<svelte:head>
	<title>{m['sop.title']()} - PPID Provinsi Sulawesi Selatan</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 dark:bg-slate-900">
	<div class="relative overflow-hidden bg-ppid-primary py-20 text-white">
		<div class="container relative z-10 mx-auto px-4">
			<Breadcrumb
				items={[
					{ label: m['common.home'](), href: '/' },
					{ label: m['common.services']() },
					{ label: 'SOP' }
				]}
				class="mb-6 text-white/80"
			/>
			<h1 class="text-4xl font-black md:text-5xl">{m['sop.title']()}</h1>
			<p class="mt-4 max-w-2xl text-lg text-white/80">
				{m['sop.description']()}
			</p>
		</div>
		<div
			class="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"
			aria-hidden="true"
		></div>
	</div>

	<div class="container mx-auto -mt-10 px-4 pb-20">
		<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-800">
			<!-- Search Bar -->
			<div class="mb-8">
				<div class="relative mx-auto max-w-2xl">
					<input
						type="text"
						bind:value={searchTerm}
						oninput={handleSearch}
						placeholder={m['sop.search_placeholder']()}
						class="w-full rounded-2xl border-none bg-slate-50 py-4 pr-4 pl-12 shadow-inner ring-2 ring-transparent transition-all focus:ring-ppid-primary/20 dark:bg-slate-900 dark:text-white"
					/>
					<svg
						class="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
			</div>

			{#if isLoading}
				<div class="flex flex-col items-center justify-center py-20">
					<div class="h-12 w-12 animate-spin rounded-full border-4 border-ppid-primary border-t-transparent"></div>
					<p class="mt-4 font-medium text-slate-500">{m['common.loading']()}</p>
				</div>
			{:else if sopList.length === 0}
				<div class="py-20 text-center">
					<div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900">
						<svg class="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
					</div>
					<p class="text-lg font-medium text-slate-400">{m['sop.no_data']()}</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each sopList as item}
						<div
							class="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 transition-all hover:border-ppid-primary/20 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900/50"
						>
							<div>
								<div class="mb-4 flex items-start justify-between">
									<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-ppid-primary/10 text-ppid-primary group-hover:bg-ppid-primary group-hover:text-white transition-colors">
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
										</svg>
									</div>
									<span class="text-xs font-bold text-slate-400 uppercase tracking-tighter">SOP</span>
								</div>
								<h3 class="mb-2 line-clamp-2 text-lg font-bold text-slate-800 dark:text-white group-hover:text-ppid-primary transition-colors">
									{item.judul}
								</h3>
								<p class="mb-4 text-xs font-medium text-slate-500 dark:text-slate-400">
									{item.skpd.nm_skpd}
								</p>
							</div>

							<div class="flex items-center justify-between border-t border-slate-50 pt-4 dark:border-slate-800">
								<div class="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
									<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
									</svg>
									{item.jumlah_download} {m['sop.downloads']()}
								</div>
								<div class="flex gap-2">
									<button
										onclick={() => handleDownload(item.id, item.file)}
										class="rounded-lg bg-ppid-primary/10 p-2 text-ppid-primary transition-colors hover:bg-ppid-primary hover:text-white"
										title={m['common.download']()}
									>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
										</svg>
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Pagination -->
				{#if totalPages > 1}
					<nav class="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
						<div class="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-lg dark:bg-slate-800">
							<button
								onclick={() => fetchSop(currentPage - 1, searchTerm)}
								disabled={currentPage === 1}
								class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
							>
								{m['common.previous']()}
							</button>
							<span class="px-4 text-sm font-bold text-slate-600 dark:text-slate-300">
								{currentPage} / {totalPages}
							</span>
							<button
								onclick={() => fetchSop(currentPage + 1, searchTerm)}
								disabled={currentPage === totalPages}
								class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
							>
								{m['common.next']()}
							</button>
						</div>
					</nav>
				{/if}
			{/if}
		</div>
	</div>
</main>

<Footer />
