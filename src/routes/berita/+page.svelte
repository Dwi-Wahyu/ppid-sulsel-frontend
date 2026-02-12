<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import * as m from '$lib/paraglide/messages.js';

	// --- Type Definitions ---
	interface Category {
		id: string;
		name: string;
		count: number;
	}

	interface NewsItem {
		id: number;
		title: string;
		slug: string;
		content: string;
		image: string | null;
		viewers: number;
		date: string;
		category: string | null;
	}

	interface Pagination {
		current_page: number;
		last_page: number;
		total: number;
		per_page: number;
	}

	// --- States (Svelte 5) ---
	let view = $state<'grid' | 'list'>('grid');
	let loading = $state(true);
	let berita = $state<NewsItem[]>([]);
	let categories = $state<Category[]>([]);
	let pagination = $state<Pagination>({
		current_page: 1,
		last_page: 1,
		total: 0,
		per_page: 9
	});

	let params = $state({
		search: '',
		category: '',
		page: 1
	});

	// Fungsi untuk berpindah halaman
	function changePage(newPage: number | string) {
		if (typeof newPage !== 'number') return;

		params.page = newPage;
		fetchBerita();

		// Scroll ke atas dengan halus saat ganti halaman
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	// Hitung Paginasi yang muncul
	const visiblePages = $derived(() => {
		const current = pagination.current_page || 1;
		const last = pagination.last_page || 1;
		const delta = 2; // Jumlah halaman di sekitar halaman aktif

		const range: (number | string)[] = [];
		const rangeWithDots: (number | string)[] = [];
		let l: number | undefined;

		// Tentukan rentang angka yang muncul
		for (let i = 1; i <= last; i++) {
			if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
				range.push(i);
			}
		}

		// Tambahkan titik-titik (...) jika ada lompatan angka
		for (let i of range) {
			if (typeof i === 'number') {
				if (l) {
					if (i - l === 2) {
						rangeWithDots.push(l + 1);
					} else if (i - l !== 1) {
						rangeWithDots.push('...');
					}
				}
				rangeWithDots.push(i);
				l = i;
			}
		}

		return rangeWithDots;
	});

	// --- Actions ---
	async function fetchBerita() {
		loading = true;
		try {
			const query = new URLSearchParams({
				page: params.page.toString(),
				search: params.search,
				category: params.category
			});

			const response = await fetch(`${PUBLIC_API_URL}/public/berita?${query.toString()}`);
			if (!response.ok) throw new Error('Network response was not ok');

			const res = await response.json();

			if (res.success) {
				berita = res.data;
				pagination = res.meta;
				categories = res.categories || [];

				// Update URL tanpa reload untuk history
				const url = new URL(window.location.href);
				url.searchParams.set('page', params.page.toString());
				if (params.search) url.searchParams.set('search', params.search);
				else url.searchParams.delete('search');
				window.history.pushState({}, '', url);
			}
		} catch (error) {
			console.error('Fetch error:', error);
		} finally {
			loading = false;
		}
	}

	function handleSearch(e: SubmitEvent) {
		e.preventDefault();
		params.page = 1;
		fetchBerita();
	}

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	};

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		params.page = Number(urlParams.get('page')) || 1;
		params.search = urlParams.get('search') || '';
		params.category = urlParams.get('category') || '';
		fetchBerita();
	});
</script>

<div class="bg-slate-50 py-12 font-sans transition-colors dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<section
			aria-label="Filter Berita"
			class="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800"
		>
			<form onsubmit={handleSearch} class="flex flex-col gap-4 md:flex-row">
				<div class="relative flex-1">
					<label for="search-news" class="sr-only">Cari Berita</label>
					<input
						id="search-news"
						type="text"
						bind:value={params.search}
						placeholder={m['common.search_news']()}
						class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-slate-700 ring-ppid-accent/20 outline-hidden transition-all focus:border-ppid-accent focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
					/>
					<span class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" aria-hidden="true">
						<svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/></svg
						>
					</span>
				</div>

				<div class="w-full md:w-72">
					<label for="category-filter" class="sr-only">Filter Kategori</label>
					<select
						id="category-filter"
						bind:value={params.category}
						onchange={() => {
							params.page = 1;
							fetchBerita();
						}}
						class="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-hidden focus:border-ppid-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
					>
						<option value="">{m['common.categories']()}</option>
						{#each categories as cat}
							<option value={cat.id}>{cat.name}</option>
						{/each}
					</select>
				</div>

				<button
					type="submit"
					class="cursor-pointer rounded-xl bg-ppid-primary px-8 py-3 font-bold text-white transition-transform hover:bg-ppid-primary/90 active:scale-95"
				>
					{m['news.search_btn']()}
				</button>
			</form>
		</section>

		<div class="grid grid-cols-1 gap-10 lg:grid-cols-4">
			<main class="lg:col-span-3">
				{#if loading}
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
						{#each Array(6) as _}
							<div class="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
						{/each}
					</div>
				{:else if berita.length === 0}
					<div class="flex flex-col items-center justify-center py-20 text-center">
						<p class="text-xl font-medium text-slate-500">Tidak ada berita ditemukan.</p>
					</div>
				{:else}
					<div
						class={view === 'grid'
							? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
							: 'flex flex-col space-y-6'}
					>
						{#each berita as item (item.id)}
							<article
								class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-800"
							>
								<div class="relative aspect-video overflow-hidden">
									{#if item.image}
										<img
											src={item.image}
											alt=""
											role="presentation"
											class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
										/>
									{:else}
										<div
											class="flex size-full items-center justify-center bg-slate-100 dark:bg-slate-700"
										>
											<svg class="size-12 text-slate-300" fill="currentColor" viewBox="0 0 24 24"
												><path
													d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
												/></svg
											>
										</div>
									{/if}
								</div>

								<div class="flex flex-1 flex-col p-5">
									<header
										class="mb-3 flex items-center justify-between text-xs font-medium text-slate-500"
									>
										<time datetime={item.date}>{formatDate(item.date)}</time>
										<span class="flex items-center gap-1">
											<svg class="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/></svg
											>
											{item.viewers}
										</span>
									</header>

									<h3 class="mb-2 line-clamp-2 text-lg font-bold text-slate-900 dark:text-white">
										<a
											href="/berita/{item.slug}"
											class="after:absolute after:inset-0 focus:outline-none"
										>
											{item.title}
										</a>
									</h3>

									<p
										class="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400"
									>
										{item.content.replace(/<[^>]*>?/gm, '')}
									</p>

									<div
										class="mt-auto flex items-center text-sm font-bold text-ppid-accent group-hover:underline"
									>
										{m['news.read_more']()}
										<svg class="ml-1 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
											><path d="M9 5l7 7-7 7" /></svg
										>
									</div>
								</div>
							</article>
						{/each}
					</div>

					{#if pagination.last_page > 1}
						<nav
							aria-label="Pagination"
							class="mt-12 flex items-center justify-center gap-1 sm:gap-2"
						>
							<button
								onclick={() => changePage(pagination.current_page - 1)}
								disabled={pagination.current_page === 1}
								class="flex size-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800"
								title="Previous Page"
							>
								<svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									><path d="M15 19l-7-7 7-7" /></svg
								>
							</button>

							{#each visiblePages() as p}
								{#if p === '...'}
									<span class="px-2 text-slate-400">...</span>
								{:else}
									<button
										onclick={() => changePage(p)}
										aria-current={pagination.current_page === p ? 'page' : undefined}
										class="size-10 cursor-pointer rounded-lg font-bold transition-all
                    {pagination.current_page === p
											? 'bg-ppid-primary text-white shadow-md shadow-ppid-primary/20'
											: 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400'}"
									>
										{p}
									</button>
								{/if}
							{/each}

							<button
								onclick={() => changePage(pagination.current_page + 1)}
								disabled={pagination.current_page === pagination.last_page}
								class="flex size-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800"
								title="Next Page"
							>
								<svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									><path d="M9 5l7 7-7 7" /></svg
								>
							</button>
						</nav>
					{/if}
				{/if}
			</main>

			<aside class="space-y-8">
				<div
					class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800"
				>
					<h2
						class="mb-5 flex items-center border-l-4 border-ppid-accent pl-3 text-lg font-bold text-ppid-primary dark:text-white"
					>
						{m['common.categories']()}
					</h2>
					<nav class="flex flex-col gap-1">
						{#each categories as cat}
							<button
								onclick={() => {
									params.category = cat.id;
									params.page = 1;
									fetchBerita();
								}}
								class="group flex w-full items-center justify-between rounded-xl p-3 text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 {params.category ===
								cat.id
									? 'bg-slate-50 text-ppid-primary dark:bg-slate-700'
									: 'text-slate-600 dark:text-slate-400'}"
							>
								<span class="truncate pr-4">{cat.name}</span>
								<span
									class="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-bold dark:bg-slate-900"
									>{cat.count}</span
								>
							</button>
						{/each}
					</nav>
				</div>
			</aside>
		</div>
	</div>
</div>
