<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api'; // Menggunakan helper proxy API
	import { PUBLIC_API_URL } from '$env/static/public';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	interface SOP {
		id: number;
		judul: string;
		file: string;
		jumlah_download: number;
		created_at: string | null;
		updated_at: string | null;
	}

	interface PaginationData {
		current_page: number;
		last_page: number;
		next_page_url: string | null;
		prev_page_url: string | null;
		total: number;
		from: number;
		to: number;
	}

	// State Management menggunakan Runes Svelte 5 [cite: 13, 14]
	let loading = $state(true);
	let items = $state<SOP[]>([]);
	let pagination = $state<Partial<PaginationData>>({});
	let search = $state('');
	let debounceTimer: ReturnType<typeof setTimeout>;

	// State Dialog Konfirmasi [cite: 14]
	let showDeleteConfirm = $state(false);
	let selectedId = $state<number | null>(null);
	let isDeleting = $state(false);

	// Notification State
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	onMount(async () => {
		await fetchData();
	});

	/**
	 * Mengambil data SOP dari backend melalui proxy SvelteKit.
	 * Menangani pencarian dan paginasi[cite: 15, 17].
	 */
	async function fetchData(page: string | number = 1) {
		loading = true;
		try {
			// Menggunakan api.get yang mengarah ke /api/proxy/admin/sop
			const res = await api.get('/admin/sop', {
				search: search || null,
				page
			});

			if (res.success) {
				// Berdasarkan JSON Anda: result.data berisi objek paginasi
				const paginated = res.data;
				items = paginated.data;
				pagination = {
					current_page: paginated.current_page,
					last_page: paginated.last_page,
					next_page_url: paginated.next_page_url,
					prev_page_url: paginated.prev_page_url,
					total: paginated.total,
					from: paginated.from,
					to: paginated.to
				};
			}
		} catch (error) {
			console.error('Gagal memuat data SOP:', error);
		} finally {
			loading = false;
		}
	}

	function handleSearchInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			fetchData(1);
		}, 500);
	}

	function changePage(url: string | null) {
		if (!url) return;
		const urlParams = new URL(url);
		const page = urlParams.searchParams.get('page');
		if (page) fetchData(page);
	}

	function getFileExtension(filename: string): string {
		if (!filename) return '-';
		return filename.split('.').pop()?.toUpperCase() || '-';
	}

	function triggerDelete(id: number) {
		selectedId = id;
		showDeleteConfirm = true;
	}

	async function handleDelete() {
		if (!selectedId) return;
		isDeleting = true;
		try {
			// Menggunakan api.delete untuk menghapus resource
			const res = await api.delete(`/admin/sop/${selectedId}`);
			if (res.success) {
				await fetchData(pagination.current_page);
				notificationType = 'success';
				notificationMessage = res.message || 'SOP berhasil dihapus';
				showNotification = true;
			}
		} catch (error: any) {
			console.error('Gagal menghapus SOP:', error);
			notificationType = 'error';
			notificationMessage = error.message || 'Terjadi kesalahan saat menghapus data';
			showNotification = true;
		} finally {
			isDeleting = false;
			selectedId = null;
			showDeleteConfirm = false;
		}
	}
</script>

<svelte:head>
	<title>Manajemen SOP - Admin PPID</title>
</svelte:head>

<div class="space-y-6 p-6">
	<!-- Header Section -->
	<header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
				Standar Operasional Prosedur (SOP)
			</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">
				Kelola dokumen pedoman pelayanan informasi publik instansi Anda.
			</p>
		</div>
		<div class="flex items-center gap-3">
			<div class="relative">
				<label for="search-sop" class="sr-only">Cari SOP</label>
				<input
					id="search-sop"
					type="text"
					bind:value={search}
					oninput={handleSearchInput}
					placeholder="Cari judul SOP..."
					class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm shadow-sm transition-all focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary/20 md:w-64 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-ppid-primary"
				/>
				<div class="pointer-events-none absolute top-3 left-3 text-slate-400">
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
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
			</div>

			<a
				href="/admin/data-sop/create"
				class="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-ppid-primary to-ppid-primary-light px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:from-ppid-primary-light hover:to-ppid-primary hover:shadow-lg"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2.5"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
				</svg>
				Tambah SOP
			</a>
		</div>
	</header>

	<!-- Table Section -->
	<div
		class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm" aria-busy={loading}>
				<thead
					class="border-b border-slate-200 bg-slate-50/50 font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-300"
				>
					<tr>
						<th scope="col" class="px-6 py-4">Judul Dokumen</th>
						<th scope="col" class="px-6 py-4">Tipe</th>
						<th scope="col" class="px-6 py-4 text-center">Hits</th>
						<th scope="col" class="px-6 py-4 text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 dark:divide-slate-700">
					{#if loading}
						{#each Array(5) as _}
							<tr class="animate-pulse">
								<td class="px-6 py-4"
									><div class="h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-700"></div></td
								>
								<td class="px-6 py-4"
									><div class="h-4 w-12 rounded bg-slate-100 dark:bg-slate-700"></div></td
								>
								<td class="px-6 py-4"
									><div class="mx-auto h-4 w-8 rounded bg-slate-100 dark:bg-slate-700"></div></td
								>
								<td class="px-6 py-4"
									><div class="ml-auto h-8 w-16 rounded bg-slate-100 dark:bg-slate-700"></div></td
								>
							</tr>
						{/each}
					{:else if items.length === 0}
						<tr>
							<td colspan="4" class="px-6 py-12 text-center text-slate-500 italic"
								>Belum ada data SOP ditemukan.</td
							>
						</tr>
					{:else}
						{#each items as item (item.id)}
							<tr class="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30">
								<td class="px-6 py-4">
									<div class="font-semibold text-slate-900 dark:text-slate-100">
										{item.judul}
									</div>
								</td>
								<td class="px-6 py-4">
									<span
										class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 uppercase dark:bg-slate-700 dark:text-slate-300"
									>
										{getFileExtension(item.file)}
									</span>
								</td>
								<td class="px-6 py-4 text-center">
									<span
										class="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
									>
										{item.jumlah_download}
									</span>
								</td>
								<td class="px-6 py-4 text-right">
									<div class="flex justify-end gap-1 opacity-100 transition-opacity">
										<a
											href={`${PUBLIC_API_URL.replace('/api', '')}/storage/sop/${item.file}`}
											target="_blank"
											class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
											title="Lihat Dokumen"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
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
										</a>
										<a
											href="/admin/data-sop/{item.id}/edit"
											class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400"
											title="Edit"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
												/>
											</svg>
										</a>
										<button
											type="button"
											onclick={() => triggerDelete(item.id)}
											class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
											title="Hapus"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</button>
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Pagination -->
	{#if !loading && items.length > 0}
		<nav
			class="flex flex-col items-center justify-between gap-4 py-2 md:flex-row"
			aria-label="Paginasi"
		>
			<div class="text-sm text-slate-500 dark:text-slate-400">
				Menampilkan <span class="font-bold text-slate-900 dark:text-slate-100"
					>{pagination.from} - {pagination.to}</span
				>
				dari <span class="font-bold">{pagination.total}</span> SOP
			</div>
			<div class="flex items-center gap-2">
				<button
					onclick={() => changePage(pagination.prev_page_url)}
					disabled={!pagination.prev_page_url}
					class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
				>
					Sebelumnya
				</button>
				<button
					onclick={() => changePage(pagination.next_page_url)}
					disabled={!pagination.next_page_url}
					class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
				>
					Berikutnya
				</button>
			</div>
		</nav>
	{/if}
</div>

<ConfirmationDialog
	bind:show={showDeleteConfirm}
	title="Hapus Dokumen SOP?"
	description="Tindakan ini permanen. Dokumen akan dihapus dari server dan tidak dapat dikembalikan."
	confirmText="Ya, Hapus SOP"
	theme="danger"
	onConfirm={handleDelete}
/>

<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'Berhasil!' : 'Gagal!'}
	description={notificationMessage}
/>
