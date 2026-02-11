<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	// Mengambil props dari load function
	let { data } = $props();

	// State untuk form input
	let searchQuery = $state('');
	let selectedYear = $state('');

	// Sinkronisasi state input dengan URL (untuk tombol Back/Forward browser)
	$effect(() => {
		searchQuery = page.url.searchParams.get('search') || '';
		selectedYear = page.url.searchParams.get('tahun') || '';
	});

	// Derived values untuk reaktivitas murni Svelte 5
	let kategori = $derived(data.kategoriData.category);
	let informasi = $derived(data.kategoriData.data.data);
	let pagination = $derived(data.kategoriData.data);
	let availableYears = $derived(data.kategoriData.available_years);

	// Fungsi Filter & Pencarian
	async function applyFilters() {
		const params = new URLSearchParams(page.url.searchParams);
		if (searchQuery) params.set('search', searchQuery);
		else params.delete('search');

		if (selectedYear) params.set('year', selectedYear);
		else params.delete('year');

		params.set('page', '1');
		await goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
	}

	function handlePageChange(url: string | null) {
		if (!url) return;
		const target = new URL(url);
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', target.searchParams.get('page') || '1');
		goto(`?${params.toString()}`);
	}
</script>

<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-6">
		<nav class="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
			<a
				href="/"
				aria-label="Kembali ke beranda"
				title="Kembali ke beranda"
				class="transition-colors hover:text-ppid-primary dark:text-white"
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
					class="h-4 w-4"
				>
					<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline
						points="9 22 9 12 15 12 15 22"
					/>
				</svg>
			</a>
			<span class="text-gray-400">/</span>
			<a href="/informasi-publik" class="transition-colors hover:text-ppid-primary dark:text-white"
				>Informasi Publik</a
			>
			<span class="text-gray-400">/</span>
			<span class="font-medium text-ppid-primary dark:text-white">{kategori.name}</span>
		</nav>

		<div class="flex items-end justify-between">
			<div>
				<h1 class="mb-2 text-3xl font-bold text-ppid-primary md:text-4xl dark:text-white">
					Informasi {kategori.name}
				</h1>
				<p class="text-gray-600 dark:text-gray-300">
					Daftar informasi kategori {kategori.name} Pemerintah Provinsi Sulawesi Selatan
				</p>
			</div>
			<div class="hidden md:block">
				<div class="h-1 w-20 rounded-full bg-linear-to-r from-ppid-primary to-transparent"></div>
			</div>
		</div>
	</div>
</div>

<main class="bg-gray-50 py-10 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-7xl">
			<form
				onsubmit={(e) => {
					e.preventDefault();
					applyFilters();
				}}
				class="mb-6 flex flex-col gap-4 md:flex-row"
			>
				<div class="relative flex-1">
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
						class="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
					>
						<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
					</svg>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Cari judul informasi..."
						class="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-ppid-primary focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
					/>
				</div>

				<select
					bind:value={selectedYear}
					onchange={applyFilters}
					class="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:ring-2 focus:ring-ppid-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white"
				>
					<option value="">Pilih Tahun</option>
					{#each availableYears as year}
						<option value={year.waktu}>{year.waktu}</option>
					{/each}
				</select>

				<div class="flex gap-2">
					<button
						type="submit"
						class="hover:bg-opacity-90 rounded-lg bg-ppid-accent px-6 py-2 font-semibold text-white transition-colors"
					>
						Cari
					</button>
					{#if page.url.searchParams.get('search') || page.url.searchParams.get('year')}
						<a
							href={page.url.pathname}
							class="flex items-center justify-center rounded-lg bg-gray-200 px-6 py-2 font-medium text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-200"
						>
							Clear
						</a>
					{/if}
				</div>
			</form>

			<div
				class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="overflow-x-auto">
					<table class="w-full border-collapse text-left">
						<thead class="bg-ppid-primary text-white">
							<tr>
								<th class="px-4 py-3 text-sm font-semibold">No</th>
								<th class="px-4 py-3 text-sm font-semibold">Judul Informasi</th>
								<th class="px-4 py-3 text-sm font-semibold">Tahun</th>
								<th class="px-4 py-3 text-sm font-semibold">OPD Pengelola</th>
								<th class="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100 dark:divide-slate-700">
							{#each informasi as item, i}
								<tr class="transition-colors hover:bg-ppid-primary/5 dark:hover:bg-slate-700/50">
									<td class="px-4 py-4 text-sm">{(pagination.current_page - 1) * 10 + i + 1}</td>
									<td
										class="px-4 py-4 text-sm leading-relaxed font-medium text-gray-900 dark:text-white"
									>
										{item.judul}
									</td>
									<td class="px-4 py-4 text-sm">
										{item.tgl_upload ? new Date(item.tgl_upload).getFullYear() : '-'}
									</td>
									<td class="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
										{item.skpd?.nm_skpd || '-'}
									</td>
									<td class="px-4 py-4 text-sm">
										<div class="flex items-center justify-center gap-3">
											<a
												href="/informasi-publik/detail/{item.id_informasi}"
												class="text-ppid-primary hover:text-ppid-accent dark:text-blue-400"
												title="Lihat Detail"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="18"
													height="18"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle
														cx="12"
														cy="12"
														r="3"
													/></svg
												>
											</a>
											{#if item.file}
												<a
<<<<<<< HEAD
													href={item.file.startsWith('http')
														? item.file
														: `http://localhost:8000/storage/${item.file}`}
=======
													href={item.file.startsWith('http') ? item.file : `/uploads/${item.file}`}
>>>>>>> a671b4e5aab697cf0824110f57582e30d269fd01
													aria-label="Download file"
													download
													class="text-ppid-primary hover:text-ppid-accent dark:text-blue-400"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="18"
														height="18"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
														><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
															points="7 10 12 15 17 10"
														/><line x1="12" x2="12" y1="15" y2="3" /></svg
													>
												</a>
											{/if}
										</div>
									</td>
								</tr>
							{:else}
								<tr>
									<td colspan="5" class="py-20 text-center text-gray-500 italic"
										>Data tidak ditemukan</td
									>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div
					class="flex justify-center border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900"
				>
					<div class="flex flex-wrap gap-2">
						{#each pagination.links as link}
							<button
								onclick={() => handlePageChange(link.url)}
								disabled={!link.url || link.active}
								class="rounded-md border px-3 py-1.5 text-sm font-medium transition-all
								{link.active
									? 'border-ppid-primary bg-ppid-primary text-white'
									: 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-slate-800 dark:text-gray-200'}"
							>
								{@html link.label}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
