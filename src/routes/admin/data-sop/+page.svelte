<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	interface SOP {
		id: number;
		judul: string;
		file: string;
		jumlah_download: number;
		created_at: string;
		updated_at: string;
	}

	interface PaginationData {
		current_page: number;
		data: SOP[];
		next_page_url: string | null;
		prev_page_url: string | null;
		total: number;
		from: number;
		to: number;
	}

	let loading = $state(true);
	let items = $state<SOP[]>([]);
	let pagination = $state<Partial<PaginationData>>({});
	let search = $state('');
	let debounceTimer: ReturnType<typeof setTimeout>;

	// Confirmation dialog
	let showDeleteConfirm = $state(false);
	let deleteUrl = $state('');
	let isDeleting = $state(false);

	onMount(async () => {
		await fetchData();
	});

	async function fetchData(url: string | null = null) {
		loading = true;
		const targetUrl =
			url || `${PUBLIC_API_URL}/admin/data-sop?search=${encodeURIComponent(search)}`;

		try {
			const response = await fetch(targetUrl, {
				credentials: 'include',
				headers: { Accept: 'application/json' }
			});

			if (!response.ok) throw new Error('Failed to fetch');

			const data: PaginationData = await response.json();
			items = data.data;
			pagination = {
				next_page_url: data.next_page_url,
				prev_page_url: data.prev_page_url,
				total: data.total,
				from: data.from,
				to: data.to
			};
		} catch (error) {
			console.error('Error fetching SOP data:', error);
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

	function getFileExtension(filename: string): string {
		if (!filename) return '-';
		return filename.split('.').pop()?.toUpperCase() || '-';
	}

	function confirmDelete(id: number) {
		deleteUrl = `${PUBLIC_API_URL}/admin/data-sop/${id}`;
		showDeleteConfirm = true;
	}

	async function handleDelete() {
		isDeleting = true;
		try {
			const response = await fetch(deleteUrl, {
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
			deleteUrl = '';
		}
	}
</script>

<svelte:head>
	<title>Manajemen SOP - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
				Standar Operasional Prosedur (SOP)
			</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">
				Kelola dokumen pedoman pelayanan informasi publik.
			</p>
		</div>
		<div class="flex items-center gap-3">
			<!-- Search -->
			<div class="relative">
				<input
					type="text"
					bind:value={search}
					oninput={handleSearchInput}
					placeholder="Cari judul SOP..."
					aria-label="Search SOP"
					class="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 md:w-64 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
				/>
				<div class="pointer-events-none absolute top-2.5 left-3 text-slate-400 dark:text-slate-500">
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
				href="/admin/data-sop/create"
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
				Tambah SOP
			</a>
		</div>
	</div>

	<!-- Table -->
	<div
		class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm">
				<thead
					class="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-400"
				>
					<tr>
						<th class="px-6 py-4">Judul Dokumen</th>
						<th class="px-6 py-4">Tipe File</th>
						<th class="px-6 py-4 text-center">Unduhan</th>
						<th class="px-6 py-4 text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 dark:divide-slate-700">
					{#if loading}
						{#each Array(5) as _, i (i)}
							<tr class="animate-pulse">
								<td class="px-6 py-4">
									<div class="h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-700"></div>
								</td>
								<td class="px-6 py-4">
									<div class="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-700"></div>
								</td>
								<td class="px-6 py-4 text-center">
									<div class="mx-auto h-4 w-12 rounded bg-slate-100 dark:bg-slate-700"></div>
								</td>
								<td class="px-6 py-4 text-right">
									<div class="ml-auto h-8 w-10 rounded-lg bg-slate-100 dark:bg-slate-700"></div>
								</td>
							</tr>
						{/each}
					{:else if items.length === 0}
						<tr>
							<td
								colspan="4"
								class="px-6 py-12 text-center text-slate-500 italic dark:text-slate-400"
							>
								Belum ada data SOP yang tersedia.
							</td>
						</tr>
					{:else}
						{#each items as item (item.id)}
							<tr class="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
								<td class="px-6 py-4 font-medium text-slate-900 dark:text-slate-100"
									>{item.judul}</td
								>
								<td class="px-6 py-4">
									<div class="flex items-center gap-2">
										<span
											class="rounded-lg bg-rose-50 p-1.5 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
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
													d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
												/>
											</svg>
										</span>
										<span
											class="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400"
										>
											{getFileExtension(item.file)}
										</span>
									</div>
								</td>
								<td class="px-6 py-4 text-center">
									<span
										class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300"
									>
										{item.jumlah_download}
									</span>
								</td>
								<td class="px-6 py-4 text-right">
									<div class="flex justify-end gap-2">
										<a
											href={`${PUBLIC_API_URL.replace('/api', '')}/storage/sop/${item.file}`}
											target="_blank"
											rel="noopener noreferrer"
											class="rounded-lg p-2 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-500 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
											title="Lihat"
											aria-label="View {item.judul}"
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
											class="rounded-lg p-2 text-slate-400 transition-all hover:bg-amber-50 hover:text-amber-600 dark:text-slate-500 dark:hover:bg-amber-900/30 dark:hover:text-amber-400"
											title="Edit"
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
											onclick={() => confirmDelete(item.id)}
											class="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
											title="Hapus"
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
	{#if !loading && items.length > 0}
		<div class="flex flex-col items-center justify-between gap-4 py-2 md:flex-row">
			<div class="text-sm text-slate-500 dark:text-slate-400">
				Menampilkan <span class="font-medium text-slate-900 dark:text-slate-100"
					>{pagination.from || 0} - {pagination.to || 0}</span
				>
				dari
				<span class="font-medium text-slate-900 dark:text-slate-100">{pagination.total || 0}</span> data
				SOP
			</div>
			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={() => changePage(pagination.prev_page_url || null)}
					disabled={!pagination.prev_page_url}
					class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
				>
					Sebelumnya
				</button>
				<button
					type="button"
					onclick={() => changePage(pagination.next_page_url || null)}
					disabled={!pagination.next_page_url}
					class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
				>
					Berikutnya
				</button>
			</div>
		</div>
	{/if}
</div>

<!-- Delete Confirmation -->
<ConfirmationDialog
	bind:show={showDeleteConfirm}
	title="Hapus SOP?"
	description="Apakah Anda yakin ingin menghapus dokumen SOP ini?"
	confirmText="Ya, Hapus"
	theme="danger"
	onConfirm={handleDelete}
	isLoading={isDeleting}
/>
