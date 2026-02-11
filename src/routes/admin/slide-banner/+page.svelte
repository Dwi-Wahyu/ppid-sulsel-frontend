<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	interface Banner {
		id_slide: number;
		nm_slide: string;
		created_at: string;
		updated_at: string;
	}

	interface PaginationData {
		current_page: number;
		data: Banner[];
		next_page_url: string | null;
		prev_page_url: string | null;
		total: number;
		from: number;
		to: number;
		last_page: number;
	}

	let loading = $state(true);
	let banners = $state<Banner[]>([]);
	let pagination = $state<Partial<PaginationData>>({});

	// Notification
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Confirmation dialog
	let showDeleteConfirm = $state(false);
	let deleteId = $state<number | null>(null);
	let isDeleting = $state(false);

	onMount(async () => {
		await fetchData();
	});

	async function fetchData(url: string | null = null) {
		loading = true;
		const targetUrl = url || `${PUBLIC_API_URL}/admin/slide-banner`;

		try {
			const response = await fetch(targetUrl, {
				credentials: 'include',
				headers: { Accept: 'application/json' }
			});

			if (!response.ok) throw new Error('Failed to fetch');

			const data: PaginationData = await response.json();
			banners = data.data;
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
			console.error('Error fetching banner data:', error);
		} finally {
			loading = false;
		}
	}

	function changePage(url: string | null) {
		if (url) fetchData(url);
	}

	function confirmDelete(id: number) {
		deleteId = id;
		showDeleteConfirm = true;
	}

	async function handleDelete() {
		if (deleteId === null) return;

		isDeleting = true;
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/slide-banner/${deleteId}`, {
				method: 'DELETE',
				credentials: 'include',
				headers: { Accept: 'application/json' }
			});

			if (response.ok) {
				notificationType = 'success';
				notificationMessage = 'Banner berhasil dihapus';
				showNotification = true;
				await fetchData();
			} else {
				notificationType = 'error';
				notificationMessage = 'Gagal menghapus banner';
				showNotification = true;
			}
		} catch (error) {
			console.error('Delete error:', error);
			notificationType = 'error';
			notificationMessage = 'Terjadi kesalahan';
			showNotification = true;
		} finally {
			isDeleting = false;
			deleteId = null;
		}
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Banner Slide - Admin PPID</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Daftar Banner</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">
				Kelola slide banner untuk halaman utama.
			</p>
		</div>
		<a
			href="/admin/slide-banner/create"
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
			Tambah Banner
		</a>
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
						<th class="w-48 px-6 py-4">Pratinjau</th>
						<th class="px-6 py-4">Nama File</th>
						<th class="px-6 py-4">Tanggal Dibuat</th>
						<th class="px-6 py-4 text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 dark:divide-slate-700">
					{#if loading}
						{#each Array(3) as _, i (i)}
							<tr class="animate-pulse">
								<td class="px-6 py-4">
									<div class="h-20 w-32 rounded-lg bg-slate-100 dark:bg-slate-700"></div>
								</td>
								<td class="px-6 py-4">
									<div class="mb-2 h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-700"></div>
									<div class="h-3 w-1/2 rounded bg-slate-50 dark:bg-slate-700/50"></div>
								</td>
								<td class="px-6 py-4">
									<div class="h-4 w-24 rounded bg-slate-100 dark:bg-slate-700"></div>
								</td>
								<td class="px-6 py-4 text-right">
									<div class="ml-auto h-8 w-12 rounded-lg bg-slate-100 dark:bg-slate-700"></div>
								</td>
							</tr>
						{/each}
					{:else if banners.length === 0}
						<tr>
							<td colspan="4" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
								Data banner tidak ditemukan.
							</td>
						</tr>
					{:else}
						{#each banners as banner (banner.id_slide)}
							<tr class="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
								<td class="px-6 py-4">
									<div
										class="h-20 w-32 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700"
									>
										{#if banner.nm_slide}
											<img
												src={`${PUBLIC_API_URL.replace('/api', '')}/storage/slide-banner/${banner.nm_slide}`}
												alt="Banner preview"
												class="h-full w-full object-cover"
											/>
										{:else}
											<div
												class="flex h-full w-full items-center justify-center text-slate-300 dark:text-slate-500"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-8 w-8"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													aria-hidden="true"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
											</div>
										{/if}
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="font-medium text-slate-900 dark:text-slate-100">
										{banner.nm_slide}
									</div>
									<div class="mt-1 text-xs text-slate-400 dark:text-slate-500">
										ID: #{banner.id_slide}
									</div>
								</td>
								<td class="px-6 py-4 text-slate-500 dark:text-slate-400">
									{banner.created_at ? formatDate(banner.created_at) : '-'}
								</td>
								<td class="px-6 py-4 text-right">
									<div class="flex justify-end gap-2">
										<a
											href="/admin/slide-banner/{banner.id_slide}/edit"
											class="rounded-lg p-2 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-500 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
											title="Edit"
											aria-label="Edit banner {banner.nm_slide}"
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
											onclick={() => confirmDelete(banner.id_slide)}
											class="rounded-lg p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 dark:text-slate-500 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
											title="Hapus"
											aria-label="Delete banner {banner.nm_slide}"
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
	{#if !loading && banners.length > 0}
		<div class="flex flex-col items-center justify-between gap-4 py-2 md:flex-row">
			<div class="text-sm text-slate-500 dark:text-slate-400">
				Menampilkan <span class="font-medium text-slate-900 dark:text-slate-100"
					>{pagination.from || 0} - {pagination.to || 0}</span
				>
				dari
				<span class="font-medium text-slate-900 dark:text-slate-100">{pagination.total || 0}</span>
				banner
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
	title="Hapus Banner?"
	description="Apakah Anda yakin ingin menghapus banner ini?"
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
