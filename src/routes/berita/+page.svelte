<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let view = $state('grid');
	let loading = $state(true);
	let berita = $state([]);
	let pagination = $state({});

	let params = $state({
		search: '',
		category: '',
		page: 1
	});

	// Mock categories
	let categories = $state([
		{ id_skpd: '1', nm_skpd: 'Pemerintahan', berita_count: 25 },
		{ id_skpd: '2', nm_skpd: 'Kesehatan', berita_count: 18 },
		{ id_skpd: '3', nm_skpd: 'Pendidikan', berita_count: 32 },
		{ id_skpd: '4', nm_skpd: 'Infrastruktur', berita_count: 15 }
	]);

	// Mock news data
	const mockNews = Array.from({ length: 18 }, (_, i) => ({
		id_berita: i + 1,
		slug: `berita-${i + 1}`,
		judul: `Berita Terbaru ${i + 1}: Perkembangan Terkini di Sulawesi Selatan`,
		deskripsi:
			'<p>Ini adalah deskripsi singkat berita yang menjelaskan isi dari artikel berita ini. Deskripsi ini akan ditampilkan sebagai preview di halaman index.</p>',
		img_berita: i % 3 === 0 ? null : 'placeholder.jpg',
		tgl_upload: new Date(2024, 0, i + 1).toISOString(),
		viewers: Math.floor(Math.random() * 1000),
		id_skpd: String((i % 4) + 1),
		skpd: { nm_skpd: categories[i % 4].nm_skpd }
	}));

	function fetchBerita() {
		loading = true;

		// Simulate API delay
		setTimeout(() => {
			let filtered = [...mockNews];

			// Filter by search
			if (params.search) {
				filtered = filtered.filter((b) =>
					b.judul.toLowerCase().includes(params.search.toLowerCase())
				);
			}

			// Filter by category
			if (params.category) {
				filtered = filtered.filter((b) => b.id_skpd === params.category);
			}

			// Pagination
			const perPage = 6;
			const total = filtered.length;
			const lastPage = Math.ceil(total / perPage);
			const start = (params.page - 1) * perPage;
			const end = start + perPage;

			berita = filtered.slice(start, end);
			pagination = {
				current_page: params.page,
				last_page: lastPage,
				total: total,
				per_page: perPage
			};

			loading = false;

			// Update URL
			const url = new URL(window.location.href);
			url.searchParams.set('page', String(params.page));
			if (params.search) url.searchParams.set('search', params.search);
			else url.searchParams.delete('search');
			if (params.category) url.searchParams.set('category', params.category);
			else url.searchParams.delete('category');
			window.history.pushState({}, '', url);
		}, 500);
	}

	function changePage(p) {
		params.page = p;
		fetchBerita();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function handleSearch(e) {
		e.preventDefault();
		params.page = 1;
		fetchBerita();
	}

	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
	}

	onMount(() => {
		fetchBerita();
	});
</script>

<Header />

<!-- Breadcrumb + Title Section -->
<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-transparent dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-8">
		<div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
			<div>
				<div class="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
					<a
						href="/"
						class="flex items-center gap-1.5 transition-colors hover:text-ppid-primary dark:hover:text-ppid-accent"
					>
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"
							><path
								d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
							></path></svg
						>
						{m['common.home']()}
					</a>
					<svg
						class="h-4 w-4 text-gray-400 dark:text-gray-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path></svg
					>
					<span class="font-semibold text-ppid-primary dark:text-ppid-accent"
						>{m['common.news']()}</span
					>
				</div>
				<h1 class="text-3xl font-bold text-ppid-primary md:text-4xl dark:text-white">
					{m['news.title']()}
				</h1>
			</div>
			<div class="hidden md:block">
				<div class="flex gap-2">
					<button
						onclick={() => (view = 'grid')}
						class="rounded p-2 transition-colors {view === 'grid'
							? 'bg-gray-100 text-ppid-primary dark:bg-slate-700 dark:text-white'
							: 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}"
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
							><rect width="7" height="7" x="3" y="3" rx="1" /><rect
								width="7"
								height="7"
								x="14"
								y="3"
								rx="1"
							/><rect width="7" height="7" x="14" y="14" rx="1" /><rect
								width="7"
								height="7"
								x="3"
								y="14"
								rx="1"
							/></svg
						>
					</button>
					<button
						onclick={() => (view = 'list')}
						class="rounded p-2 transition-colors {view === 'list'
							? 'bg-gray-100 text-ppid-primary dark:bg-slate-700 dark:text-white'
							: 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}"
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
							><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line
								x1="8"
								x2="21"
								y1="18"
								y2="18"
							/><line x1="3" x2="3.01" y1="6" y2="6" /><line
								x1="3"
								x2="3.01"
								y1="12"
								y2="12"
							/><line x1="3" x2="3.01" y1="18" y2="18" /></svg
						>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Main Content -->
<div class="bg-gray-50 py-12 font-['Plus_Jakarta_Sans'] dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<!-- Search & Filter Section -->
		<div
			class="mb-8 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<form onsubmit={handleSearch} class="flex flex-col gap-4 md:flex-row">
				<div class="relative flex-1">
					<input
						type="text"
						bind:value={params.search}
						placeholder={m['common.search_news']()}
						class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-gray-700 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-ppid-accent dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200"
					/>
					<svg
						class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						></path></svg
					>
				</div>
				<div class="w-full md:w-64">
					<select
						bind:value={params.category}
						onchange={() => {
							params.page = 1;
							fetchBerita();
						}}
						class="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-700 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-ppid-accent dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200"
					>
						<option value="">{m['common.categories']()}</option>
						{#each categories as cat}
							<option value={cat.id_skpd}>{cat.nm_skpd}</option>
						{/each}
					</select>
				</div>
				<button
					type="submit"
					class="rounded-lg bg-ppid-primary px-6 py-2.5 font-semibold text-white shadow-md transition-colors hover:bg-[#152649]"
				>
					{m['news.search_btn']()}
				</button>
			</form>
		</div>

		<div class="grid grid-cols-1 gap-10 lg:grid-cols-4">
			<div class="lg:col-span-3">
				<!-- Skeleton Loader -->
				{#if loading}
					<div
						class={view === 'grid'
							? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
							: 'flex flex-col space-y-6'}
					>
						{#each Array(6) as _, i}
							<div
								class="animate-pulse rounded-2xl border border-gray-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
							>
								<div class="mb-4 h-48 w-full rounded-xl bg-slate-200 dark:bg-slate-700"></div>
								<div class="mb-3 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
								<div class="mb-2 h-3 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
								<div class="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-700"></div>
							</div>
						{/each}
					</div>
				{/if}

				<!-- News Content -->
				{#if !loading && berita.length > 0}
					<div
						class={view === 'grid'
							? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
							: 'flex flex-col space-y-6'}
					>
						{#each berita as news}
							<article
								class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 {view ===
								'grid'
									? 'flex h-full flex-col hover:-translate-y-1'
									: 'flex flex-col items-stretch hover:translate-x-1 md:flex-row'}"
							>
								<div
									class="relative shrink-0 overflow-hidden {view === 'grid'
										? 'h-48 w-full'
										: 'h-48 w-full md:h-auto md:w-64'}"
								>
									{#if news.img_berita}
										<img
											src="/storage/img_berita/{news.img_berita}"
											class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
											alt={news.judul}
										/>
									{:else}
										<div
											class="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-slate-700"
										>
											<svg
												class="h-12 w-12 text-gray-400"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												><path
													d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
												/></svg
											>
										</div>
									{/if}
									<div
										class="absolute top-3 left-3 rounded bg-ppid-primary px-2.5 py-1 text-[10px] font-bold text-white shadow-sm"
									>
										{news.skpd?.nm_skpd || 'General'}
									</div>
									<a href="/berita/{news.slug}" class="absolute inset-0"></a>
								</div>

								<div class="flex flex-1 flex-col p-5">
									<div class="mb-3 flex items-center gap-2 text-xs text-gray-500">
										<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
											><path
												d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
											/></svg
										>
										<span>{formatDate(news.tgl_upload)}</span>
									</div>
									<h3
										class="mb-3 text-lg font-bold text-gray-900 {view === 'grid'
											? 'line-clamp-2'
											: ''} dark:text-white"
									>
										{news.judul}
									</h3>
									<p
										class="mb-4 flex-1 text-sm text-gray-600 {view === 'grid'
											? 'line-clamp-3'
											: 'line-clamp-2'} dark:text-gray-300"
									>
										{news.deskripsi.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
									</p>
									<a
										href="/berita/{news.slug}"
										class="inline-flex items-center text-sm font-semibold text-ppid-accent"
									>
										{m['news.read_more']()}
										<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
											><path d="M9 5l7 7-7 7" /></svg
										>
									</a>
								</div>
							</article>
						{/each}
					</div>
				{/if}

				<!-- Empty State -->
				{#if !loading && berita.length === 0}
					<div
						class="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center dark:bg-slate-800"
					>
						<h3 class="text-lg font-medium text-gray-900 dark:text-white">{m['news.no_news']()}</h3>
						<p class="text-gray-500">{m['news.no_news_desc']()}</p>
					</div>
				{/if}

				<!-- Pagination -->
				{#if !loading && pagination.last_page > 1}
					<div class="mt-12 flex justify-center gap-2">
						<button
							onclick={() => changePage(params.page - 1)}
							disabled={params.page <= 1}
							class="rounded-lg border bg-white px-4 py-2 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800"
							>Prev</button
						>

						<div class="flex items-center gap-2">
							{#each Array(pagination.last_page)
								.fill(0)
								.map((_, i) => i + 1) as p}
								{#if p > params.page - 3 && p < params.page + 3}
									<button
										onclick={() => changePage(p)}
										class="h-10 w-10 rounded-lg border font-semibold transition-all {params.page ===
										p
											? 'border-ppid-primary bg-ppid-primary text-white'
											: 'border bg-white text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800'}"
									>
										{p}
									</button>
								{/if}
							{/each}
						</div>

						<button
							onclick={() => changePage(params.page + 1)}
							disabled={params.page >= pagination.last_page}
							class="rounded-lg border bg-white px-4 py-2 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800"
							>Next</button
						>
					</div>
				{/if}
			</div>

			<!-- Sidebar -->
			<aside class="space-y-8 lg:col-span-1">
				<!-- Widget Magazine -->
				<div
					class="relative overflow-hidden rounded-2xl bg-ppid-primary p-6 text-center text-white shadow-lg"
				>
					<h3 class="mb-4 text-lg font-bold text-ppid-accent">{m['news.recent_posts']()}</h3>
					<div class="relative mb-4 aspect-[4/5] overflow-hidden rounded-lg bg-slate-700">
						<img
							src="https://images.unsplash.com/photo-1620912189868-3b178608d0ac?q=80&w=1000&auto=format&fit=crop"
							class="absolute inset-0 h-full w-full object-cover opacity-60"
							alt="Magazine"
						/>
						<div class="absolute bottom-0 bg-gradient-to-t from-black to-transparent p-4 text-left">
							<h4 class="text-xs font-bold">Optimisme Ekonomi Sulsel Tahun 2026</h4>
						</div>
					</div>
					<a
						href="#"
						class="inline-block rounded-full border border-ppid-accent px-4 py-2 text-xs font-bold text-ppid-accent transition-all hover:bg-ppid-accent hover:text-ppid-primary"
						>{m['news.digital_edition']()}</a
					>
				</div>

				<!-- Categories Widget -->
				<div
					class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<h3
						class="mb-4 border-l-4 border-ppid-accent pl-3 font-bold text-ppid-primary dark:text-white"
					>
						{m['common.categories']()}
					</h3>
					<div class="space-y-2">
						{#each categories as cat}
							<button
								onclick={() => {
									params.category = cat.id_skpd;
									params.page = 1;
									fetchBerita();
								}}
								class="group flex w-full items-center justify-between rounded-lg p-2.5 transition-colors hover:bg-gray-50 {params.category ==
								cat.id_skpd
									? 'bg-gray-50 dark:bg-slate-700'
									: ''} dark:hover:bg-slate-700"
							>
								<span
									class="line-clamp-1 text-sm font-medium text-gray-700 group-hover:text-ppid-primary dark:text-gray-300"
									>{cat.nm_skpd}</span
								>
								<span
									class="rounded-full bg-ppid-primary/5 px-2 py-0.5 text-xs font-bold text-ppid-primary transition-colors group-hover:bg-ppid-primary group-hover:text-white dark:text-white"
									>{cat.berita_count}</span
								>
							</button>
						{/each}
					</div>
				</div>
			</aside>
		</div>
	</div>
</div>

<Footer />
