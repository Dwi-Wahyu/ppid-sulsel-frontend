<script>
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import * as m from '$lib/paraglide/messages.js';

	// State
	let searchTerm = $state('');
	let currentPage = $state(1);
	const itemsPerPage = 10;

	// Mock SOP data - replace with actual API call
	const allSopData = $state([
		{
			id: '1',
			judul: 'SOP Permohonan Informasi Publik',
			file: 'sop-permohonan-informasi.pdf',
			jumlah_download: 245
		},
		{
			id: '2',
			judul: 'SOP Pengajuan Keberatan Informasi Publik',
			file: 'sop-keberatan.pdf',
			jumlah_download: 189
		},
		{
			id: '3',
			judul: 'SOP Penyelesaian Sengketa Informasi',
			file: 'sop-sengketa.pdf',
			jumlah_download: 156
		},
		{
			id: '4',
			judul: 'SOP Dokumentasi dan Informasi Publik',
			file: 'sop-dokumentasi.pdf',
			jumlah_download: 203
		},
		{
			id: '5',
			judul: 'SOP Layanan Informasi Elektronik',
			file: 'sop-elektronik.pdf',
			jumlah_download: 178
		}
	]);

	// Filtered and paginated data
	let filteredData = $derived(() => {
		if (!searchTerm.trim()) return allSopData;
		const searchLower = searchTerm.toLowerCase();
		return allSopData.filter((sop) => sop.judul.toLowerCase().includes(searchLower));
	});

	let paginatedData = $derived(() => {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return filteredData().slice(start, end);
	});

	let totalPages = $derived(Math.ceil(filteredData().length / itemsPerPage));

	// Functions
	function handleSearch(e) {
		e.preventDefault();
		currentPage = 1; // Reset to first page on search
	}

	function handleDownload(sopId) {
		// In real app, this would track downloads via API
		console.log('Downloading SOP:', sopId);
		const sop = allSopData.find((s) => s.id === sopId);
		if (sop) {
			sop.jumlah_download++;
			// Trigger download
			// window.open(`/storage/sop/${sop.file}`, '_blank');
		}
	}

	function handleView(sopFile) {
		console.log('Viewing SOP:', sopFile);
		// window.open(`/storage/sop/${sopFile}`, '_blank');
	}
</script>

<!-- Breadcrumb + Title Section -->
<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-8">
		<Breadcrumb
			items={[
				{ label: 'breadcrumb.home', href: '/' },
				{ label: 'layanan.services' },
				{ label: 'layanan.sop_title' }
			]}
		/>

		<div class="mt-4 flex items-end justify-between">
			<div>
				<h1 class="mb-2 text-3xl font-bold text-ppid-primary md:text-4xl dark:text-white">
					Standard Operating Procedure (SOP)
				</h1>
				<p class="text-gray-600 dark:text-gray-300">Panduan prosedur layanan informasi publik</p>
			</div>
			<div class="hidden md:block">
				<div
					class="h-1.5 w-24 rounded-full bg-gradient-to-r from-ppid-primary to-ppid-accent"
				></div>
			</div>
		</div>
	</div>
</div>

<!-- Main Content -->
<main class="bg-gray-50 py-12 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-7xl">
			<!-- Search Box -->
			<div class="mb-8 max-w-2xl">
				<form onsubmit={handleSearch} class="flex gap-2">
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
							<circle cx="11" cy="11" r="8" />
							<path d="m21 21-4.3-4.3" />
						</svg>
						<input
							type="text"
							bind:value={searchTerm}
							placeholder="Cari SOP..."
							class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800 dark:text-white"
						/>
					</div>
					<button
						type="submit"
						class="rounded-lg bg-ppid-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-ppid-primary/90"
					>
						Cari
					</button>
				</form>
			</div>

			<!-- Table -->
			<div
				class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="overflow-x-auto">
					<table class="w-full border-collapse text-left">
						<thead class="bg-ppid-primary text-white">
							<tr>
								<th class="w-16 px-6 py-4 text-center text-sm font-semibold">No</th>
								<th class="px-6 py-4 text-sm font-semibold">Judul SOP</th>
								<th class="w-48 px-6 py-4 text-center text-sm font-semibold">Aksi</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 dark:divide-slate-700">
							{#each paginatedData() as sop, index (sop.id)}
								<tr class="group transition-colors hover:bg-blue-50/50 dark:hover:bg-slate-700/50">
									<td class="px-6 py-4 text-center font-medium text-gray-500 dark:text-gray-400">
										{(currentPage - 1) * itemsPerPage + index + 1}
									</td>
									<td
										class="px-6 py-4 font-medium text-gray-800 uppercase transition-colors group-hover:text-ppid-primary dark:text-white"
									>
										{sop.judul}
									</td>
									<td class="px-6 py-4">
										<div class="flex items-center justify-center gap-3">
											<!-- View Button -->
											<button
												onclick={() => handleView(sop.file)}
												class="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-ppid-primary dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
												title="Lihat"
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
												>
													<path
														d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
													/>
													<circle cx="12" cy="12" r="3" />
												</svg>
											</button>

											<!-- Download Button -->
											<button
												onclick={() => handleDownload(sop.id)}
												class="flex items-center gap-1.5 rounded-lg bg-ppid-primary/5 px-3 py-1.5 text-xs font-bold text-ppid-primary transition-all hover:bg-ppid-primary hover:text-white dark:text-white"
												title="Download"
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
												>
													<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
													<polyline points="7 10 12 15 17 10" />
													<line x1="12" x2="12" y1="15" y2="3" />
												</svg>
												{sop.jumlah_download}
											</button>
										</div>
									</td>
								</tr>
							{:else}
								<tr>
									<td
										colspan="3"
										class="bg-gray-50 px-6 py-12 text-center italic text-gray-500 dark:bg-slate-700/50 dark:text-gray-400"
									>
										Tidak ada data SOP ditemukan
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Pagination -->
				{#if totalPages > 1}
					<div
						class="flex items-center justify-center border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900"
					>
						<div class="flex items-center gap-2">
							<button
								onclick={() => currentPage > 1 && currentPage--}
								disabled={currentPage === 1}
								class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-300"
							>
								Previous
							</button>

							<span class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
								Page {currentPage} of {totalPages}
							</span>

							<button
								onclick={() => currentPage < totalPages && currentPage++}
								disabled={currentPage === totalPages}
								class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-300"
							>
								Next
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>

<Footer />
