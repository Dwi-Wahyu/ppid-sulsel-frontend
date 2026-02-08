<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	interface IntegratedService {
		id: number;
		title: string;
		description: string;
		link: string;
		icon: string | null;
		is_active: boolean;
	}

	interface PaginationData {
		current_page: number;
		data: IntegratedService[];
		next_page_url: string | null;
		prev_page_url: string | null;
		total: number;
		from: number;
		to: number;
	}

	let loading = $state(true);
	let services = $state<IntegratedService[]>([]);
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
		const targetUrl = url || `${PUBLIC_API_URL}/admin/integrated-services`;

		try {
			const response = await fetch(targetUrl, {
				credentials: 'include',
				headers: { Accept: 'application/json' }
			});

			if (!response.ok) throw new Error('Failed to fetch');

			const data: PaginationData = await response.json();
			services = data.data;
			pagination = {
				next_page_url: data.next_page_url,
				prev_page_url: data.prev_page_url,
				total: data.total,
				from: data.from,
				to: data.to
			};
		} catch (error) {
			console.error('Error fetching services data:', error);
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
			const response = await fetch(`${PUBLIC_API_URL}/admin/integrated-services/${deleteId}`, {
				method: 'DELETE',
				credentials: 'include',
				headers: { Accept: 'application/json' }
			});

			if (response.ok) {
				notificationType = 'success';
				notificationMessage = 'Layanan berhasil dihapus';
				showNotification = true;
				await fetchData();
			} else {
				notificationType = 'error';
				notificationMessage = 'Gagal menghapus layanan';
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
</script>

<svelte:head>
	<title>Layanan Terpadu - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Layanan Terpadu</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">Kelola layanan terintegrasi publik.</p>
		</div>
		<a
			href="/admin/integrated-services/create"
			class="hover:bg-ppid-dark inline-flex items-center gap-2 rounded-xl bg-ppid-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors"
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
			Tambah Layanan
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
						<th class="px-6 py-4">Icon</th>
						<th class="px-6 py-4">Judul</th>
						<th class="px-6 py-4">Deskripsi</th>
						<th class="px-6 py-4">Link</th>
						<th class="px-6 py-4 text-center">Status</th>
						<th class="px-6 py-4 text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 dark:divide-slate-700">
					{#if loading}
						{#each Array(3) as _, i (i)}
							<tr class="animate-pulse">
								<td class="px-6 py-4">
									<div class="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700"></div>
								</td>
								<td class="px-6 py-4">
									<div class="h-4 w-32 rounded bg-slate-100 dark:bg-slate-700"></div>
								</td>
								<td class="px-6 py-4">
									<div class="h-4 w-48 rounded bg-slate-100 dark:bg-slate-700"></div>
								</td>
								<td class="px-6 py-4">
									<div class="h-4 w-24 rounded bg-slate-100 dark:bg-slate-700"></div>
								</td>
								<td class="px-6 py-4 text-center">
									<div class="mx-auto h-6 w-16 rounded-full bg-slate-100 dark:bg-slate-700"></div>
								</td>
								<td class="px-6 py-4 text-right">
									<div class="ml-auto h-8 w-12 rounded-lg bg-slate-100 dark:bg-slate-700"></div>
								</td>
							</tr>
						{/each}
					{:else if services.length === 0}
						<tr>
							<td colspan="6" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
								Belum ada data layanan.
							</td>
						</tr>
					{:else}
						{#each services as service (service.id)}
							<tr class="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
								<td class="px-6 py-4">
									{#if service.icon}
										<img
											src={`${PUBLIC_API_URL.replace('/api', '')}/storage/integrated_services/${service.icon}`}
											alt={service.title}
											class="h-10 w-10 rounded-full border border-slate-200 object-contain dark:border-slate-600"
										/>
									{:else}
										<span class="text-slate-400">No Image</span>
									{/if}
								</td>
								<td class="px-6 py-4">
									<span class="font-medium text-slate-900 dark:text-slate-100">{service.title}</span
									>
								</td>
								<td class="px-6 py-4 text-slate-500 dark:text-slate-400">
									{service.description}
								</td>
								<td class="px-6 py-4">
									<a
										href={service.link}
										target="_blank"
										rel="noopener noreferrer"
										class="block w-32 truncate text-blue-500 hover:underline"
									>
										{service.link}
									</a>
								</td>
								<td class="px-6 py-4 text-center">
									<span
										class="rounded-full px-3 py-1 text-xs font-medium {service.is_active
											? 'bg-green-200 text-green-600'
											: 'bg-red-200 text-red-600'}"
									>
										{service.is_active ? 'Active' : 'Inactive'}
									</span>
								</td>
								<td class="px-6 py-4 text-right">
									<div class="flex justify-end gap-2">
										<a
											href="/admin/integrated-services/{service.id}/edit"
											class="rounded-lg p-2 text-slate-400 transition-all hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/30 dark:hover:text-purple-400"
											title="Edit"
											aria-label="Edit {service.title}"
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
													d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
												/>
											</svg>
										</a>
										<button
											type="button"
											onclick={() => confirmDelete(service.id)}
											class="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
											title="Hapus"
											aria-label="Delete {service.title}"
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
	{#if !loading && services.length > 0}
		<div class="flex flex-col items-center justify-between gap-4 py-2 md:flex-row">
			<div class="text-sm text-slate-500 dark:text-slate-400">
				Menampilkan <span class="font-medium text-slate-900 dark:text-slate-100"
					>{pagination.from || 0} - {pagination.to || 0}</span
				>
				dari
				<span class="font-medium text-slate-900 dark:text-slate-100">{pagination.total || 0}</span>
				layanan
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
	title="Hapus Layanan?"
	description="Apakah Anda yakin ingin menghapus layanan ini?"
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
