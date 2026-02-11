<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';

	// Types
	interface SopItem {
		id: number;
		judul: string;
		file: string;
		jumlah_download: number;
		created_at: string | null;
		updated_at: string | null;
	}

	interface ApiResponse {
		success: boolean;
		data: {
			current_page: number;
			data: SopItem[];
			last_page: number;
			total: number;
			per_page: number;
		};
	}

	// State (Svelte 5 Runes)
	let searchTerm = $state('');
	let currentPage = $state(1);
	let isLoading = $state(false);
	let sopResponse = $state<ApiResponse['data'] | null>(null);

	// Fetch Data
	async function fetchSop(page: number = 1, search: string = '') {
		isLoading = true;
		try {
			const url = new URL(`${env.PUBLIC_API_URL}/public/sop`);
			url.searchParams.append('page', page.toString());
			if (search) url.searchParams.append('search', search);

			const response = await fetch(url.toString());
			const result: ApiResponse = await response.json();

			if (result.success) {
				sopResponse = result.data;
				currentPage = result.data.current_page;
			}
		} catch (error) {
			console.error('Failed to fetch SOP:', error);
		} finally {
			isLoading = false;
		}
	}

	// Effects
	onMount(() => {
		fetchSop();
	});

	// Handlers
	function handleSearch(e: SubmitEvent) {
		e.preventDefault();
		fetchSop(1, searchTerm);
	}

	function handlePageChange(newPage: number) {
		if (sopResponse && newPage >= 1 && newPage <= sopResponse.last_page) {
			fetchSop(newPage, searchTerm);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	async function handleDownload(id: number, filename: string) {
		try {
			// Trigger download counter in Laravel
			await fetch(`${env.PUBLIC_API_URL}/public/sop/download?id=${id}`);

			// Open file in new tab
			const fileUrl = `${env.PUBLIC_API_URL}/uploads/sop/${filename}`;
			window.open(fileUrl, '_blank');

			// Refresh data to update download count locally
			fetchSop(currentPage, searchTerm);
		} catch (error) {
			console.error('Download failed:', error);
		}
	}
</script>

<header class="border-b border-gray-200 bg-white font-sans dark:border-slate-700 dark:bg-slate-800">
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
				<h1 class="mb-2 text-3xl font-bold text-blue-700 md:text-4xl dark:text-white">
					Standard Operating Procedure (SOP)
				</h1>
				<p class="text-gray-600 dark:text-gray-300">Panduan prosedur layanan informasi publik</p>
			</div>
			<div class="hidden md:block" aria-hidden="true">
				<div class="h-1.5 w-24 rounded-full bg-linear-to-r from-blue-700 to-cyan-500"></div>
			</div>
		</div>
	</div>
</header>

<main class="bg-gray-50 py-12 font-sans md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-7xl">
			<section class="mb-8 max-w-2xl" aria-label="Pencarian SOP">
				<form onsubmit={handleSearch} class="flex gap-2">
					<div class="relative flex-1">
						<span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
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
								><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
							>
						</span>
						<input
							type="search"
							bind:value={searchTerm}
							placeholder="Cari SOP..."
							aria-label="Cari judul SOP"
							class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 outline-hidden transition-all focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
						/>
					</div>
					<button
						type="submit"
						class="rounded-lg bg-blue-700 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-800 focus:ring-4 focus:ring-blue-700/30"
					>
						{isLoading ? 'Loading...' : 'Cari'}
					</button>
				</form>
			</section>

			<div
				class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="overflow-x-auto">
					<table class="w-full border-collapse text-left">
						<thead class="bg-blue-700 text-white">
							<tr>
								<th scope="col" class="w-16 px-6 py-4 text-center text-sm font-semibold">No</th>
								<th scope="col" class="px-6 py-4 text-sm font-semibold">Judul SOP</th>
								<th scope="col" class="w-48 px-6 py-4 text-center text-sm font-semibold">Aksi</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 dark:divide-slate-700">
							{#if isLoading}
								<tr>
									<td colspan="3" class="px-6 py-12 text-center">
										<div class="flex justify-center">
											<div
												class="h-8 w-8 animate-spin rounded-full border-4 border-blue-700 border-t-transparent"
											></div>
										</div>
									</td>
								</tr>
							{:else if sopResponse && sopResponse.data.length > 0}
								{#each sopResponse.data as sop, index (sop.id)}
									<tr
										class="group transition-colors hover:bg-blue-50/50 dark:hover:bg-slate-700/50"
									>
										<td class="px-6 py-4 text-center font-medium text-gray-500 dark:text-gray-400">
											{(sopResponse.current_page - 1) * sopResponse.per_page + index + 1}
										</td>
										<td
											class="px-6 py-4 font-medium text-gray-800 uppercase transition-colors group-hover:text-blue-700 dark:text-white"
										>
											{sop.judul}
										</td>
										<td class="px-6 py-4">
											<div class="flex items-center justify-center gap-3">
												<button
													onclick={() => handleDownload(sop.id, sop.file)}
													class="flex items-center gap-1.5 rounded-lg bg-blue-700/10 px-3 py-1.5 text-xs font-bold text-blue-700 transition-all hover:bg-blue-700 hover:text-white focus:ring-2 focus:ring-blue-700/50"
													aria-label="Download {sop.judul}"
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
														><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
															points="7 10 12 15 17 10"
														/><line x1="12" x2="12" y1="15" y2="3" /></svg
													>
													{sop.jumlah_download}
												</button>
											</div>
										</td>
									</tr>
								{/each}
							{:else}
								<tr>
									<td
										colspan="3"
										class="bg-gray-50 px-6 py-12 text-center text-gray-500 italic dark:bg-slate-700/50 dark:text-gray-400"
									>
										Tidak ada data SOP ditemukan
									</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>

				{#if sopResponse && sopResponse.last_page > 1}
					<nav
						class="flex items-center justify-center border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900"
						aria-label="Pagination"
					>
						<div class="flex items-center gap-2">
							<button
								onclick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1 || isLoading}
								class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-300"
							>
								Previous
							</button>

							<span class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
								Halaman {currentPage} dari {sopResponse.last_page}
							</span>

							<button
								onclick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === sopResponse.last_page || isLoading}
								class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-300"
							>
								Next
							</button>
						</div>
					</nav>
				{/if}
			</div>
		</div>
	</div>
</main>

<Footer />
