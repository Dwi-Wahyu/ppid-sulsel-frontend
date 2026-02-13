<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	interface SurveyResponse {
		kode: string;
		nama: string;
		email: string;
		lembaga: string;
		created_at: string;
	}

	interface PaginationData {
		current_page: number;
		data: SurveyResponse[];
		next_page_url: string | null;
		prev_page_url: string | null;
		total: number;
		from: number;
		to: number;
		last_page: number;
	}

	let loading = $state(true);
	let responses = $state<SurveyResponse[]>([]);
	let pagination = $state<Partial<PaginationData>>({});
	let search = $state('');
	let searchInput = $state('');

	// Notification
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Confirmation dialog
	let showDeleteConfirm = $state(false);
	let deleteKode = $state<string | null>(null);
	let isDeleting = $state(false);

	onMount(async () => {
		// Get search from URL params
		const params = new URLSearchParams(window.location.search);
		search = params.get('search') || '';
		searchInput = search;
		await fetchData();
	});

	async function fetchData(url: string | null = null) {
		loading = true;
		let targetUrl = url || `${PUBLIC_API_URL}/admin/survey-responses`;

		if (!url && search) {
			targetUrl += `?search=${encodeURIComponent(search)}`;
		}

		try {
			const response = await fetch(targetUrl, {
				credentials: 'include',
				headers: { Accept: 'application/json' }
			});

			if (!response.ok) throw new Error('Failed to fetch');

			const data: PaginationData = await response.json();
			responses = data.data;
			pagination = {
				next_page_url: data.next_page_url,
				prev_page_url: data.prev_page_url,
				total: data.total,
				from: data.from,
				to: data.to,
				current_page: data.current_page,
				last_page: data.last_page
			};
		} catch (error) {
			console.error('Error fetching responses:', error);
		} finally {
			loading = false;
		}
	}

	function handleSearch(e: Event) {
		e.preventDefault();
		search = searchInput;
		const url = new URL(window.location.href);
		if (search) {
			url.searchParams.set('search', search);
		} else {
			url.searchParams.delete('search');
		}
		window.history.pushState({}, '', url);
		fetchData();
	}

	function resetSearch() {
		search = '';
		searchInput = '';
		const url = new URL(window.location.href);
		url.searchParams.delete('search');
		window.history.pushState({}, '', url);
		fetchData();
	}

	function changePage(url: string | null) {
		if (url) fetchData(url);
	}

	function confirmDelete(kode: string) {
		deleteKode = kode;
		showDeleteConfirm = true;
	}

	async function handleDelete() {
		if (deleteKode === null) return;

		isDeleting = true;
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/survey-responses/${deleteKode}`, {
				method: 'DELETE',
				credentials: 'include',
				headers: { Accept: 'application/json' }
			});

			if (response.ok) {
				notificationType = 'success';
				notificationMessage = 'Survey berhasil dihapus';
				showNotification = true;
				await fetchData();
			} else {
				notificationType = 'error';
				notificationMessage = 'Gagal menghapus survey';
				showNotification = true;
			}
		} catch (error) {
			console.error('Delete error:', error);
			notificationType = 'error';
			notificationMessage = 'Terjadi kesalahan';
			showNotification = true;
		} finally {
			isDeleting = false;
			deleteKode = null;
		}
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Hasil Survey - Admin PPID</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-7xl">
		<!-- Header -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="mb-2 text-3xl font-bold text-slate-800 dark:text-white">Hasil Survey</h1>
				<p class="text-slate-600 dark:text-slate-400">
					Kelola dan lihat hasil survey kepuasan masyarakat
				</p>
			</div>
		</div>

		<!-- Search & Filter -->
		<div
			class="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<form onsubmit={handleSearch} class="flex gap-4">
				<div class="flex-1">
					<input
						type="text"
						bind:value={searchInput}
						placeholder="Cari berdasarkan nama, email, atau lembaga..."
						class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-600 dark:bg-slate-700 dark:text-white"
					/>
				</div>
				<button
					type="submit"
					class="inline-flex items-center gap-1 rounded-xl bg-linear-to-r from-ppid-primary to-[#2A4A7E] px-6 py-2.5 font-semibold text-white shadow-md transition-all hover:from-[#2A4A7E] hover:to-ppid-primary hover:shadow-lg"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-1 inline-block h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					Cari
				</button>
				{#if search}
					<button
						type="button"
						onclick={resetSearch}
						class="rounded-xl bg-slate-200 px-6 py-2.5 font-semibold text-slate-700 transition-all hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
					>
						Reset
					</button>
				{/if}
			</form>
		</div>

		<!-- Table -->
		<div
			class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="bg-linear-to-r from-ppid-primary to-[#2A4A7E] text-white">
							<th class="px-6 py-4 text-left text-sm font-semibold">Kode Survey</th>
							<th class="px-6 py-4 text-left text-sm font-semibold">Nama</th>
							<th class="px-6 py-4 text-left text-sm font-semibold">Email</th>
							<th class="px-6 py-4 text-left text-sm font-semibold">Lembaga</th>
							<th class="px-6 py-4 text-left text-sm font-semibold">Tanggal Pengisian</th>
							<th class="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-200 dark:divide-slate-700">
						{#if loading}
							{#each Array(3) as _, i (i)}
								<tr class="animate-pulse">
									<td class="px-6 py-4">
										<div class="h-4 w-24 rounded bg-slate-100 dark:bg-slate-700"></div>
									</td>
									<td class="px-6 py-4">
										<div class="h-4 w-32 rounded bg-slate-100 dark:bg-slate-700"></div>
									</td>
									<td class="px-6 py-4">
										<div class="h-4 w-40 rounded bg-slate-100 dark:bg-slate-700"></div>
									</td>
									<td class="px-6 py-4">
										<div class="h-4 w-28 rounded bg-slate-100 dark:bg-slate-700"></div>
									</td>
									<td class="px-6 py-4">
										<div class="h-4 w-36 rounded bg-slate-100 dark:bg-slate-700"></div>
									</td>
									<td class="px-6 py-4 text-center">
										<div class="mx-auto h-8 w-24 rounded bg-slate-100 dark:bg-slate-700"></div>
									</td>
								</tr>
							{/each}
						{:else if responses.length === 0}
							<tr>
								<td colspan="6" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="mx-auto mb-4 h-16 w-16 opacity-50"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									<p class="text-lg font-semibold">Tidak ada data survey</p>
									<p class="mt-1 text-sm">Belum ada responden yang mengisi survey</p>
								</td>
							</tr>
						{:else}
							{#each responses as response (response.kode)}
								<tr class="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
									<td class="px-6 py-4 font-mono text-sm text-slate-900 dark:text-white">
										{response.kode}
									</td>
									<td class="px-6 py-4 text-sm text-slate-900 dark:text-white">
										{response.nama}
									</td>
									<td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
										{response.email}
									</td>
									<td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
										{response.lembaga}
									</td>
									<td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
										{formatDate(response.created_at)}
									</td>
									<td class="px-6 py-4 text-center">
										<div class="flex items-center justify-center gap-2">
											<a
												href="/admin/survey-responses/{response.kode}"
												class="inline-flex items-center gap-1 rounded-lg bg-ppid-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2A4A7E]"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													aria-hidden="true"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
													/>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
													/>
												</svg>
												Lihat
											</a>

											<button
												type="button"
												onclick={() => confirmDelete(response.kode)}
												class="inline-flex items-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
												aria-label="Hapus survey {response.nama}"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													aria-hidden="true"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													/>
												</svg>
												Hapus
											</button>
										</div>
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			{#if !loading && responses.length > 0 && pagination.last_page && pagination.last_page > 1}
				<div class="border-t border-slate-200 px-6 py-4 dark:border-slate-700">
					<div class="flex items-center justify-between">
						<div class="text-sm text-gray-600 dark:text-gray-400">
							Menampilkan {pagination.from} - {pagination.to} dari {pagination.total} responden
						</div>
						<div class="flex gap-2">
							<button
								type="button"
								onclick={() => changePage(pagination.prev_page_url || null)}
								disabled={!pagination.prev_page_url}
								class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
							>
								Sebelumnya
							</button>
							<button
								type="button"
								onclick={() => changePage(pagination.next_page_url || null)}
								disabled={!pagination.next_page_url}
								class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
							>
								Berikutnya
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Delete Confirmation -->
<ConfirmationDialog
	bind:show={showDeleteConfirm}
	title="Hapus Survey"
	description="Apakah Anda yakin ingin menghapus survey ini? Tindakan ini tidak dapat dibatalkan."
	confirmText="Ya, Hapus"
	theme="danger"
	onConfirm={handleDelete}
	isLoading={isDeleting}
/>

<!-- Notification -->
<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'Berhasil!' : 'Gagal!'}
	description={notificationMessage}
/>
