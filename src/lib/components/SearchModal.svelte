<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { env } from '$env/dynamic/public';

	// Props
	interface SearchResult {
		id_informasi: number;
		judul: string;
		ket: string | null;
		nm_kat_info: string;
	}

	let { isOpen = $bindable(false) } = $props<{ isOpen: boolean }>();

	// State
	let searchQuery = $state('');
	let results = $state<SearchResult[]>([]);
	let isLoading = $state(false);
	let searchInputRef: HTMLInputElement | undefined = $state(undefined);
	let debounceTimer: ReturnType<typeof setTimeout>;

	const BACKEND_URL = env.PUBLIC_BACKEND_URL || 'http://localhost:8000';

	// Effects
	$effect(() => {
		if (isOpen && searchInputRef) {
			searchInputRef.focus();
		}
	});

	$effect(() => {
		if (searchQuery.length < 2) {
			results = [];
			return;
		}

		// Debounce search
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			fetchSuggestions();
		}, 300);
	});

	async function fetchSuggestions() {
		if (searchQuery.length < 2) {
			results = [];
			return;
		}

		isLoading = true;
		try {
			const response = await fetch(
				`${BACKEND_URL}/api/dokumen-publik/search-suggestions?query=${encodeURIComponent(searchQuery)}`
			);
			const data = await response.json();

			if (data.success) {
				results = data.data || [];
			} else {
				results = [];
			}
		} catch (error) {
			console.error('Search error:', error);
			results = [];
		} finally {
			isLoading = false;
		}
	}

	function closeSearch() {
		isOpen = false;
		searchQuery = '';
		results = [];
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeSearch();
		}
	}

	function setQuickSearch(query: string) {
		searchQuery = query;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<!-- Backdrop -->
	<div
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-100 bg-gray-900/50 backdrop-blur-sm"
		onclick={closeSearch}
		role="presentation"
	></div>

	<!-- Modal Panel -->
	<div
		transition:fly={{ y: -20, duration: 300 }}
		class="fixed top-20 left-1/2 z-101 mx-auto w-full max-w-2xl -translate-x-1/2 transform p-4"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="relative overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-slate-800"
		>
			<!-- Search Input Area -->
			<div class="relative border-b border-gray-100 dark:border-slate-700">
				<div class="flex items-center px-4 py-4 sm:px-6">
					<div class="mr-4">
						<svg
							class="h-6 w-6 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
					<form action="/informasi-publik" method="GET" class="w-full flex-1">
						<input
							bind:this={searchInputRef}
							type="text"
							name="query"
							class="w-full border-none bg-transparent text-lg text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none dark:text-white"
							placeholder="Cari informasi (misal: RKA, Izin...)"
							bind:value={searchQuery}
							autocomplete="off"
						/>
					</form>
					<button
						onclick={closeSearch}
						class="ml-4 rounded-full bg-gray-100 p-2 text-gray-400 transition-colors hover:text-gray-500 dark:bg-slate-700"
					>
						<span class="sr-only">Close</span>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			</div>

			<!-- Results Area -->
			{#if results.length > 0 || isLoading}
				<div class="custom-scrollbar max-h-[60vh] overflow-y-auto">
					{#if isLoading}
						<div class="p-8 text-center text-gray-500 dark:text-gray-400">
							<div class="flex flex-col items-center justify-center">
								<svg
									class="mb-2 h-8 w-8 animate-spin text-ppid-accent"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								<span class="text-sm">Mencari informasi...</span>
							</div>
						</div>
					{:else if results.length > 0}
						<div class="py-2">
							<div class="px-4 pb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
								Hasil Pencarian
							</div>
							{#each results as item (item.id_informasi)}
								<a
									href="/informasi-publik/detail/{item.id_informasi}"
									class="group mx-2 block rounded-xl px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/50"
								>
									<div class="flex items-start gap-3">
										<div class="mt-1 shrink-0">
											<div
												class="flex h-8 w-8 items-center justify-center rounded-lg bg-ppid-primary/10 text-ppid-primary transition-colors group-hover:bg-ppid-primary group-hover:text-white dark:bg-white/5 dark:text-gray-300"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
													/>
												</svg>
											</div>
										</div>
										<div class="min-w-0 flex-1">
											<div class="mb-0.5 flex items-center gap-2">
												<h4
													class="truncate text-sm font-semibold text-gray-900 group-hover:text-ppid-primary dark:text-white dark:group-hover:text-ppid-accent"
												>
													{item.judul}
												</h4>
												<span
													class="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
												>
													{item.nm_kat_info}
												</span>
											</div>
											<p class="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
												{item.ket || 'Tidak ada keterangan'}
											</p>
										</div>
									</div>
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{:else if !searchQuery}
				<!-- Footer suggestions/help -->
				<div class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
					<svg
						class="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-slate-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<p class="text-sm">Ketik kata kunci untuk mulai mencari dokumen publik.</p>
					<div class="mt-4 flex flex-wrap justify-center gap-2">
						<button
							onclick={() => setQuickSearch('RKA')}
							class="rounded-full border border-gray-200 px-3 py-1 text-xs transition-colors hover:border-ppid-accent hover:text-ppid-accent dark:border-slate-700"
						>
							#RKA
						</button>
						<button
							onclick={() => setQuickSearch('Anggaran')}
							class="rounded-full border border-gray-200 px-3 py-1 text-xs transition-colors hover:border-ppid-accent hover:text-ppid-accent dark:border-slate-700"
						>
							#Anggaran
						</button>
						<button
							onclick={() => setQuickSearch('Laporan')}
							class="rounded-full border border-gray-200 px-3 py-1 text-xs transition-colors hover:border-ppid-accent hover:text-ppid-accent dark:border-slate-700"
						>
							#Laporan
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 3px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}

	:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
		background: #475569;
	}

	:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #64748b;
	}
</style>
