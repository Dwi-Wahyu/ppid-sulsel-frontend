<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	interface SKPD {
		id_skpd: string;
		nm_skpd: string;
	}

	interface Berita {
		id_berita: number;
		judul: string;
		deskripsi: string;
		img_berita: string | null;
		tgl_upload: string;
		verify: 'y' | 'n' | 't';
		id_skpd: string | null;
		skpd: SKPD | null;
		created_at: string;
		updated_at: string;
	}

	interface PaginationData {
		current_page: number;
		data: Berita[];
		first_page_url: string;
		from: number;
		last_page: number;
		last_page_url: string;
		links: Array<{ url: string | null; label: string; active: boolean }>;
		next_page_url: string | null;
		path: string;
		per_page: number;
		prev_page_url: string | null;
		to: number;
		total: number;
	}

	let loading = $state(true);
	let news = $state<Berita[]>([]);
	let pagination = $state<Partial<PaginationData>>({});
	let search = $state('');
	let debounceTimer: ReturnType<typeof setTimeout>;

	// Confirmation dialog state
	let showDeleteConfirm = $state(false);
	let deleteId = $state<number | null>(null);
	let isDeleting = $state(false);

	onMount(async () => {
		await fetchData();
	});

	async function fetchData(url: string | null = null) {
		loading = true;
		const targetUrl = url || `${PUBLIC_API_URL}/admin/berita?search=${encodeURIComponent(search)}`;

		try {
			const response = await fetch(targetUrl, {
				credentials: 'include',
				headers: { Accept: 'application/json' }
			});

			if (!response.ok) {
				throw new Error('Failed to fetch');
			}

			const data: PaginationData = await response.json();

			news = data.data;
			pagination = {
				next_page_url: data.next_page_url,
				prev_page_url: data.prev_page_url,
				total: data.total,
				from: data.from,
				to: data.to
			};
		} catch (error) {
			console.error('Fetch error:', error);
		} finally {
			loading = false;
		}
	}

	function handleSearchInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			fetchData();
		}, 500);
	}

	function changePage(url: string | null) {
		if (url) fetchData(url);
	}

	function getStatusLabel(val: string): string {
		if (val === 'y') return 'Terverifikasi';
		if (val === 'n') return 'Ditolak';
		return 'Pending';
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function confirmDelete(id: number) {
		deleteId = id;
		showDeleteConfirm = true;
	}

	async function handleDelete() {
		if (deleteId === null) return;

		isDeleting = true;
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/berita/${deleteId}`, {
				method: 'DELETE',
				credentials: 'include',
				headers: { Accept: 'application/json' }
			});

			if (response.ok) {
				await fetchData();
			}
		} catch (error) {
			console.error('Delete error:', error);
		} finally {
			isDeleting = false;
			deleteId = null;
		}
	}
</script>

<svelte:head>
	<title>Manajemen Berita - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Daftar Berita</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">
				Kelola informasi dan berita sektoral SKPD.
			</p>
		</div>
		<div class="flex items-center gap-3">
			<!-- Search -->
			<div class="relative">
				<input
					type="text"
					bind:value={search}
					oninput={handleSearchInput}
					placeholder="Cari berita..."
					class="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm text-slate-900 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 md:w-64 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
					aria-label="Search berita"
				/>
				<div class="pointer-events-none absolute top-2.5 left-3 text-slate-400">
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
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
			</div>

			<!-- Add Button -->
			<a
				href="/admin/berita/create"
				class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
						clip-rule="evenodd"
					/>
				</svg>
				Tambah Berita
			</a>
		</div>
	</div>

	<!-- Table -->
	<div class="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-800">
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm">
				<thead
					class="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-300"
				>
					<tr>
						<th class="px-6 py-4">Berita</th>
						<th class="px-6 py-4">SKPD Pengirim</th>
						<th class="px-6 py-4">Status</th>
						<th class="px-6 py-4">Tanggal Upload</th>
						<th class="px-6 py-4 text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 dark:divide-slate-700">
					{#if loading}
						{#each Array(5) as _, i (i)}
							<tr class="animate-pulse">
								<td class="px-6 py-4">
									<div class="mb-2 h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-700"></div>
									<div class="h-3 w-1/2 rounded bg-slate-50 dark:bg-slate-700/50"></div>
								</td>
								<td class="px-6 py-4">
									<div class="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-700"></div>
								</td>
								<td class="px-6 py-4">
									<div class="h-6 w-16 rounded-full bg-slate-100 dark:bg-slate-700"></div>
								</td>
								<td class="px-6 py-4">
									<div class="h-4 w-24 rounded bg-slate-100 dark:bg-slate-700"></div>
								</td>
								<td class="px-6 py-4 text-right">
									<div class="ml-auto h-8 w-12 rounded-lg bg-slate-100 dark:bg-slate-700"></div>
								</td>
							</tr>
						{/each}
					{:else if news.length === 0}
						<tr>
							<td colspan="5" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
								Data berita tidak ditemukan.
							</td>
						</tr>
					{:else}
						{#each news as item (item.id_berita)}
							<tr class="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
								<td class="px-6 py-4">
									<div class="line-clamp-1 font-medium text-slate-900 dark:text-slate-100">
										{item.judul}
									</div>
									<div class="mt-1 text-xs text-slate-400">ID: #{item.id_berita}</div>
								</td>
								<td class="px-6 py-4">
									<span class="text-slate-600 dark:text-slate-300">
										{item.skpd ? item.skpd.nm_skpd : '-'}
									</span>
								</td>
								<td class="px-6 py-4">
									<span
										class="rounded-full border px-2.5 py-1 text-xs font-medium {item.verify === 'y'
											? 'border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
											: item.verify === 'n'
												? 'border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
												: 'border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}"
									>
										{getStatusLabel(item.verify)}
									</span>
								</td>
								<td class="px-6 py-4 text-slate-500 dark:text-slate-400">
									{formatDate(item.tgl_upload)}
								</td>
								<td class="px-6 py-4 text-right">
									<div class="flex justify-end gap-2">
										<a
											href="/admin/berita/{item.id_berita}/edit"
											class="rounded-lg p-2 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
											aria-label="Edit {item.judul}"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												aria-hidden="true"
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
											onclick={() => confirmDelete(item.id_berita)}
											class="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
											aria-label="Delete {item.judul}"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
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
	{#if !loading && news.length > 0}
		<div class="flex flex-col items-center justify-between gap-4 py-2 md:flex-row">
			<div class="text-sm text-slate-500 dark:text-slate-400">
				Menampilkan <span class="font-medium text-slate-900 dark:text-slate-100"
					>{pagination.from || 0} - {pagination.to || 0}</span
				>
				dari
				<span class="font-medium text-slate-900 dark:text-slate-100">{pagination.total || 0}</span> total
				berita
			</div>
			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={() => changePage(pagination.prev_page_url || null)}
					disabled={!pagination.prev_page_url}
					class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
				>
					Sebelumnya
				</button>
				<button
					type="button"
					onclick={() => changePage(pagination.next_page_url || null)}
					disabled={!pagination.next_page_url}
					class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
				>
					Berikutnya
				</button>
			</div>
		</div>
	{/if}
</div>

<!-- Delete Confirmation Dialog -->
<ConfirmationDialog
	bind:show={showDeleteConfirm}
	title="Hapus Berita?"
	description="Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan."
	confirmText="Ya, Hapus"
	cancelText="Batal"
	theme="danger"
	onConfirm={handleDelete}
	isLoading={isDeleting}
/>
