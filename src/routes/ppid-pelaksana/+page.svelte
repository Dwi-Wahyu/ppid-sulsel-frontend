<script>
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import * as m from '$lib/paraglide/messages.js';

	// State
	let search = $state('');
	let loading = $state(false);
	let currentPage = $state(1);
	const itemsPerPage = 9;

	// Mock SKPD data - replace with actual API
	const allSkpds = $state([
		{
			id_skpd: '1',
			nm_skpd: 'Dinas Komunikasi dan Informatika',
			alamat: 'Jl. A. P. Pettarani No. 1, Makassar',
			logo: null
		},
		{
			id_skpd: '2',
			nm_skpd: 'Dinas Pendidikan',
			alamat: 'Jl. Jenderal Sudirman No. 10, Makassar',
			logo: null
		},
		{
			id_skpd: '3',
			nm_skpd: 'Dinas Kesehatan',
			alamat: 'Jl. Perintis Kemerdekaan KM.10, Makassar',
			logo: null
		},
		{
			id_skpd: '4',
			nm_skpd: 'Dinas Pekerjaan Umum dan Penataan Ruang',
			alamat: 'Jl. A. P. Pettarani No. 5, Makassar',
			logo: null
		},
		{
			id_skpd: '5',
			nm_skpd: 'Dinas Sosial',
			alamat: 'Jl. Sultan Alauddin No. 25, Makassar',
			logo: null
		},
		{
			id_skpd: '6',
			nm_skpd: 'Dinas Perhubungan',
			alamat: 'Jl. Veteran Utara No. 1, Makassar',
			logo: null
		},
		{
			id_skpd: '7',
			nm_skpd: 'Dinas Tenaga Kerja dan Transmigrasi',
			alamat: 'Jl. Urip Sumoharjo KM.4, Makassar',
			logo: null
		},
		{
			id_skpd: '8',
			nm_skpd: 'Dinas Perindustrian dan Perdagangan',
			alamat: 'Jl. Boulevard No. 15, Makassar',
			logo: null
		},
		{
			id_skpd: '9',
			nm_skpd: 'Dinas Pertanian dan Ketahanan Pangan',
			alamat: 'Jl. Gunung Bawakaraeng No. 5, Makassar',
			logo: null
		},
		{
			id_skpd: '10',
			nm_skpd: 'Dinas Lingkungan Hidup',
			alamat: 'Jl. Andi Pangeran Pettarani No. 50, Makassar',
			logo: null
		},
		{
			id_skpd: '11',
			nm_skpd: 'Badan Perencanaan Pembangunan Daerah',
			alamat: 'Jl. Urip Sumoharjo No. 269, Makassar',
			logo: null
		},
		{
			id_skpd: '12',
			nm_skpd: 'Badan Kepegawaian Daerah',
			alamat: 'Jl. Jenderal Sudirman No. 5, Makassar',
			logo: null
		}
	]);

	// Filtered and paginated data
	let filteredSkpds = $derived(() => {
		if (!search.trim()) return allSkpds;
		const searchLower = search.toLowerCase();
		return allSkpds.filter(
			(skpd) =>
				skpd.nm_skpd.toLowerCase().includes(searchLower) ||
				(skpd.alamat && skpd.alamat.toLowerCase().includes(searchLower))
		);
	});

	let paginatedSkpds = $derived(() => {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return filteredSkpds().slice(start, end);
	});

	let totalPages = $derived(Math.ceil(filteredSkpds().length / itemsPerPage));
	let hasNextPage = $derived(currentPage < totalPages);
	let hasPrevPage = $derived(currentPage > 1);

	// Functions
	function handleSearch(/** @type {Event} */ e) {
		e.preventDefault();
		currentPage = 1; // Reset to first page on search
	}

	function nextPage() {
		if (hasNextPage) {
			currentPage++;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function prevPage() {
		if (hasPrevPage) {
			currentPage--;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
</script>

<!-- Breadcrumb + Title Section -->
<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-6">
		<Breadcrumb
			items={[{ label: 'breadcrumb.profile', href: '#' }, { label: 'ppid_pelaksana.title' }]}
		/>

		<div class="mt-4">
			<PageTitle title={m['ppid_pelaksana.title']()} subtitle={m['ppid_pelaksana.subtitle']()} />
		</div>
	</div>
</div>

<!-- Main Content -->
<main class="bg-gray-50 py-12 font-['Plus_Jakarta_Sans'] md:py-20 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-7xl">
			<!-- Search Bar -->
			<div class="mb-12">
				<form onsubmit={handleSearch} class="mx-auto max-w-2xl">
					<div
						class="relative rounded-xl border-2 border-ppid-primary/20 bg-white shadow-lg transition-all duration-300 hover:border-ppid-accent/50 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
					>
						<div class="flex items-center gap-2 p-2">
							<!-- Search Input -->
							<input
								type="text"
								bind:value={search}
								placeholder="Cari SKPD..."
								class="flex-1 border-0 bg-transparent px-4 py-3 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-500"
							/>

							<!-- Search Button -->
							<button
								type="submit"
								disabled={loading}
								class="flex items-center gap-2 rounded-lg bg-ppid-primary px-5 py-3 font-medium text-white shadow-md transition-all duration-300 hover:bg-ppid-accent hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
							>
								{#if !loading}
									<span>Cari</span>
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
										<circle cx="11" cy="11" r="8" />
										<path d="m21 21-4.3-4.3" />
									</svg>
								{:else}
									<span>...</span>
									<div
										class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
									></div>
								{/if}
							</button>
						</div>
					</div>
				</form>
			</div>

			<!-- Empty State -->
			{#if paginatedSkpds().length === 0 && !loading}
				<div
					class="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center dark:border-slate-600 dark:bg-slate-700/50"
				>
					<p class="mb-4 text-5xl">🔍</p>
					<p class="mb-1 font-medium text-gray-700 dark:text-gray-300">Tidak ada hasil ditemukan</p>
					<p class="text-sm text-gray-500 dark:text-gray-400">Coba kata kunci lain</p>
				</div>
			{/if}

			<!-- SKPD Cards Grid -->
			<div
				class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
				class:opacity-50={loading}
				class:pointer-events-none={loading}
			>
				{#each paginatedSkpds() as skpd (skpd.id_skpd)}
					<a
						href="/ppid-pelaksana/{skpd.id_skpd}"
						class="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-ppid-accent hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800"
					>
						<!-- Gradient Overlay -->
						<div
							class="pointer-events-none absolute inset-0 bg-gradient-to-br from-ppid-primary/0 via-transparent to-ppid-accent/0 transition-all duration-500 group-hover:from-ppid-primary/5 group-hover:to-ppid-accent/5"
						></div>

						<!-- Top Accent Line -->
						<div
							class="absolute top-0 right-0 left-0 h-1.5 origin-center scale-x-0 transform bg-gradient-to-r from-ppid-primary via-ppid-accent to-ppid-primary transition-transform duration-500 group-hover:scale-x-100"
						></div>

						<!-- Logo -->
						<div
							class="relative mx-auto mb-6 h-24 w-24 flex-shrink-0 transform transition-transform duration-500 group-hover:scale-105"
						>
							<div
								class="absolute inset-0 rounded-full bg-gradient-to-br from-ppid-primary to-ppid-accent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-10 dark:group-hover:opacity-30"
							></div>
							<div
								class="relative flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-white shadow-lg transition-colors duration-300 group-hover:border-ppid-accent/30 dark:border-slate-600 dark:bg-slate-700"
							>
								<img
									src={skpd.logo ? `/storage/logo-skpd/${skpd.logo}` : '/images/logo-sulsel.png'}
									alt="Logo {skpd.nm_skpd}"
									class="h-14 w-14 object-contain"
								/>
							</div>
						</div>

						<!-- Content -->
						<div class="flex flex-grow flex-col space-y-4 text-center">
							<!-- Name -->
							<div class="flex min-h-[3.5rem] items-center justify-center">
								<h3
									class="text-lg leading-tight font-bold text-ppid-primary transition-colors duration-300 group-hover:text-ppid-accent md:text-xl dark:text-white"
								>
									{skpd.nm_skpd}
								</h3>
							</div>

							<!-- Divider -->
							<div
								class="mx-auto h-1 w-12 flex-shrink-0 rounded-full bg-gradient-to-r from-ppid-primary to-ppid-accent opacity-50 transition-opacity group-hover:opacity-100"
							></div>

							<!-- Address -->
							<div class="grid flex-grow grid-cols-1 gap-3 pt-2">
								<div
									class="flex items-start justify-center gap-2 text-sm text-gray-600 dark:text-gray-300"
								>
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
										class="mt-0.5 flex-shrink-0 text-ppid-accent"
									>
										<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
										<circle cx="12" cy="10" r="3" />
									</svg>
									<span class="line-clamp-2 text-left"
										>{skpd.alamat ? skpd.alamat : 'Alamat belum tersedia'}</span
									>
								</div>
							</div>

							<!-- Call to Action -->
							<div class="mt-auto pt-4">
								<div
									class="inline-flex items-center gap-2 rounded-full bg-ppid-primary/5 px-4 py-2 text-sm font-bold text-ppid-primary transition-all duration-300 group-hover:bg-ppid-primary group-hover:text-white dark:bg-ppid-accent/10 dark:text-ppid-accent dark:group-hover:text-white"
								>
									Lihat Detail
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
										class="transition-transform group-hover:translate-x-1"
									>
										<path d="M5 12h14" />
										<path d="m12 5 7 7-7 7" />
									</svg>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="mt-12 flex justify-center gap-4">
					<button
						onclick={prevPage}
						disabled={!hasPrevPage}
						class="rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
					>
						&laquo; Sebelumnya
					</button>

					<span class="px-4 py-2 text-gray-600 dark:text-gray-300">
						Halaman {currentPage} dari {totalPages}
					</span>

					<button
						onclick={nextPage}
						disabled={!hasNextPage}
						class="rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
					>
						Selanjutnya &raquo;
					</button>
				</div>
			{/if}
		</div>
	</div>
</main>

<Footer />
