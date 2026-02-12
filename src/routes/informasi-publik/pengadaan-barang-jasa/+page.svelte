<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { PUBLIC_API_URL } from '$env/static/public';
	import * as m from '$lib/paraglide/messages.js';

	// Interface Data
	interface ProcurementItem {
		id: number;
		nama_jabatan: string;
		file: string;
		jumlah_download: number;
		updated_at: string | null;
	}

	interface YearOption {
		id: number;
		waktu: string;
	}

	interface PaginationData {
		current_page: number;
		last_page: number;
		from: number;
		to: number;
		total: number;
		next_page_url: string | null;
		prev_page_url: string | null;
	}

	// State Management (Svelte 5 Runes)
	let items = $state<ProcurementItem[]>([]);
	let availableYears = $state<YearOption[]>([]);
	let pagination = $state<Partial<PaginationData>>({});
	let isLoading = $state(true);

	// Filters State
	let searchQuery = $state('');
	let selectedYear = $state('');
	let currentPage = $state(1);

	/**
	 * Mengambil data dari API
	 */
	async function fetchData(page = 1) {
		isLoading = true;
		currentPage = page;

		try {
			// Membangun URL dengan query params
			const params = new URLSearchParams({
				page: page.toString(),
				search: searchQuery,
				year: selectedYear
			});

			const response = await fetch(`${PUBLIC_API_URL}/public/informasi/pengadaan?${params}`);
			const result = await response.json();

			if (result.success) {
				items = result.data.data;
				availableYears = result.available_years;
				pagination = {
					current_page: result.data.current_page,
					last_page: result.data.last_page,
					from: result.data.from,
					to: result.data.to,
					total: result.data.total,
					next_page_url: result.data.next_page_url,
					prev_page_url: result.data.prev_page_url
				};
			}
		} catch (error) {
			console.error('Error fetching procurement data:', error);
		} finally {
			isLoading = false;
		}
	}

	function handleSearch(e: Event) {
		e.preventDefault();
		fetchData(1);
	}

	function clearFilters() {
		searchQuery = '';
		selectedYear = '';
		fetchData(1);
	}

	function changePage(url: string | null) {
		if (!url) return;
		const urlParams = new URL(url);
		const page = urlParams.searchParams.get('page');
		if (page) fetchData(parseInt(page));
	}

	onMount(() => {
		fetchData();
	});

	// Helper: URL Storage
	const getFileUrl = (fileName: string) => {
		return `${PUBLIC_API_URL.replace('/api', '')}/storage/${fileName}`;
	};
</script>

<svelte:head>
	<title>{m['pengadaan.title']()} - PPID Provinsi Sulawesi Selatan</title>
</svelte:head>

<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-8">
		<nav class="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
			<a
				title="Kembali ke beranda"
				href="/"
				class="transition-colors hover:text-ppid-primary dark:text-white"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline
						points="9 22 9 12 15 12 15 22"
					/></svg
				>
			</a>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4 text-gray-400"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"><path d="m9 18 6-6-6-6" /></svg
			>
			<a href="/informasi-publik" class="transition-colors hover:text-ppid-primary dark:text-white"
				>{m['public_info.title']()}</a
			>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4 text-gray-400"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"><path d="m9 18 6-6-6-6" /></svg
			>
			<span class="font-medium text-ppid-primary dark:text-white">{m['pengadaan.title']()}</span>
		</nav>

		<div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
			<div>
				<h1
					class="mb-2 text-3xl font-black tracking-tight text-ppid-primary uppercase md:text-5xl dark:text-white"
				>
					{m['pengadaan.title']()}
				</h1>
				<p class="font-medium text-gray-500 dark:text-gray-400">
					{m['pengadaan.desc']()}
				</p>
			</div>
			<div class="hidden md:block">
				<div class="h-1.5 w-24 rounded-full bg-linear-to-r from-ppid-primary to-transparent"></div>
			</div>
		</div>
	</div>
</div>

<main class="bg-gray-50 py-10 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-7xl">
			<div class="mb-8 flex flex-col gap-4 lg:flex-row">
				<form onsubmit={handleSearch} class="flex flex-1 gap-2">
					<div class="relative flex-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
						>
						<input
							type="text"
							bind:value={searchQuery}
							placeholder={m['pengadaan.search_placeholder']()}
							class="w-full rounded-xl border border-gray-300 bg-white py-3 pr-4 pl-10 text-sm focus:ring-2 focus:ring-ppid-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
						/>
					</div>
					<button
						type="submit"
						class="rounded-xl bg-ppid-accent px-8 py-3 text-sm font-bold text-white shadow-lg shadow-ppid-accent/20 transition-all hover:bg-[#B08D26] active:scale-95"
					>
						{m['public_info.search_btn']()}
					</button>
				</form>

				<div class="flex gap-2">
					<select
						bind:value={selectedYear}
						onchange={() => fetchData(1)}
						class="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-ppid-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
					>
						<option value="">{m['pengadaan.all_years']()}</option>
						{#each availableYears as year}
							<option value={year.waktu}>{year.waktu}</option>
						{/each}
					</select>

					{#if searchQuery || selectedYear}
						<button
							onclick={clearFilters}
							class="rounded-xl bg-gray-200 px-6 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-200"
						>
							{m['common.reset']()}
						</button>
					{/if}
				</div>
			</div>

			<div
				class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none"
			>
				<div class="overflow-x-auto">
					<table class="w-full text-left">
						<thead>
							<tr class="bg-ppid-primary text-xs font-black tracking-widest text-white uppercase">
								<th class="px-6 py-5">NO</th>
								<th class="px-6 py-5">{m['pengadaan.table.doc_name']()}</th>
								<th class="px-6 py-5 text-center">AKSI</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100 dark:divide-slate-700">
							{#if isLoading}
								{#each Array(5) as _}
									<tr class="animate-pulse">
										<td class="px-6 py-4"
											><div class="h-4 w-4 rounded bg-gray-200 dark:bg-slate-700"></div></td
										>
										<td class="px-6 py-4"
											><div class="h-4 w-3/4 rounded bg-gray-200 dark:bg-slate-700"></div></td
										>
										<td class="px-6 py-4"
											><div
												class="mx-auto h-8 w-24 rounded bg-gray-200 dark:bg-slate-700"
											></div></td
										>
									</tr>
								{/each}
							{:else if items.length > 0}
								{#each items as item, i (item.id)}
									<tr
										in:fade
										class="transition-colors hover:bg-ppid-primary/5 dark:hover:bg-slate-700/50"
									>
										<td class="px-6 py-5 text-sm font-bold text-gray-500 dark:text-slate-400">
											{(pagination.from || 0) + i}
										</td>
										<td class="px-6 py-5">
											<div
												class="text-sm leading-relaxed font-bold text-gray-800 dark:text-gray-200"
											>
												{item.nama_jabatan}
											</div>
											<div
												class="mt-1 flex items-center gap-3 text-[10px] font-black tracking-tighter text-gray-400 uppercase"
											>
												<span>{m['pengadaan.meta.viewed']()}: {item.jumlah_download}x</span>
												<span class="h-1 w-1 rounded-full bg-gray-300"></span>
												<span
													>{m['pengadaan.meta.update']()}: {item.updated_at
														? new Date(item.updated_at).toLocaleDateString('id-ID')
														: '-'}</span
												>
											</div>
										</td>
										<td class="px-6 py-5 text-center">
											<a
												href={getFileUrl(item.file)}
												target="_blank"
												class="inline-flex items-center gap-2 rounded-xl bg-ppid-primary px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-ppid-primary/20 transition-all hover:bg-[#142344] active:scale-95"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-4 w-4"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2.5"
													stroke-linecap="round"
													stroke-linejoin="round"
													><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
														points="7 10 12 15 17 10"
													/><line x1="12" y1="15" x2="12" y2="3" /></svg
												>
												DOWNLOAD
											</a>
										</td>
									</tr>
								{/each}
							{:else}
								<tr>
									<td
										colspan="3"
										class="px-6 py-20 text-center text-gray-500 italic dark:text-gray-400"
									>
										{m['pengadaan.no_data']()}
									</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>

				{#if !isLoading && items.length > 0}
					<div
						class="flex flex-col items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/50 px-8 py-6 md:flex-row dark:border-slate-700 dark:bg-slate-900/50"
					>
						<div class="text-xs font-black tracking-widest text-gray-400 uppercase">
							{m['common.showing']()}
							<span class="text-gray-900 dark:text-white">{pagination.from} - {pagination.to}</span>
							{m['common.from']()}
							<span class="text-gray-900 dark:text-white">{pagination.total}</span>
							{m['common.data']()}
						</div>
						<div class="flex items-center gap-2">
							<button
								onclick={() => changePage(pagination.prev_page_url)}
								disabled={!pagination.prev_page_url}
								class="rounded-xl border-2 border-gray-200 bg-white px-6 py-2 text-xs font-black tracking-widest text-gray-600 transition-all hover:border-ppid-primary hover:text-ppid-primary disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300"
							>
								{m['common.prev']()}
							</button>
							<button
								onclick={() => changePage(pagination.next_page_url)}
								disabled={!pagination.next_page_url}
								class="rounded-xl border-2 border-gray-200 bg-white px-6 py-2 text-xs font-black tracking-widest text-gray-600 transition-all hover:border-ppid-primary hover:text-ppid-primary disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300"
							>
								{m['common.next']()}
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>
