<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// State management
	let showDeleteDialog = $state(false);
	let deleteId = $state<number | null>(null);

	// Notification state
	let showNotification = $state(false);
	let notificationTheme = $state<'success' | 'error'>('success');
	let notificationTitle = $state('');
	let notificationDescription = $state('');

	// Confirm delete single item
	function confirmDelete(id: number) {
		deleteId = id;
		showDeleteDialog = true;
	}

	// Handle delete action
	async function handleDelete() {
		if (!deleteId) return;

		try {
			const token = document.cookie
				.split('; ')
				.find((row) => row.startsWith('access_token='))
				?.split('=')[1];

			const response = await fetch(`${PUBLIC_API_URL}/admin/permohonan-informasi/${deleteId}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				}
			});

			const result = await response.json();

			if (result.success) {
				notificationTheme = 'success';
				notificationTitle = 'Berhasil!';
				notificationDescription = 'Permohonan informasi berhasil dihapus.';
				showNotification = true;

				// Reload page after short delay
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			} else {
				notificationTheme = 'error';
				notificationTitle = 'Gagal!';
				notificationDescription = result.message || 'Terjadi kesalahan saat menghapus permohonan.';
				showNotification = true;
			}
		} catch (error) {
			notificationTheme = 'error';
			notificationTitle = 'Gagal!';
			notificationDescription = 'Terjadi kesalahan saat menghapus permohonan.';
			showNotification = true;
		}

		showDeleteDialog = false;
		deleteId = null;
	}

	// Handle search
	function handleSearch(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const search = formData.get('search') as string;

		const url = new URL(window.location.href);
		if (search) {
			url.searchParams.set('search', search);
		} else {
			url.searchParams.delete('search');
		}
		goto(url.pathname + url.search);
	}

	// Format date for display
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(date);
	}

	// Get status badge classes based on status value
	function getStatusBadgeClass(status: number): string {
		switch (status) {
			case 0: // Pending
				return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
			case 1: // Proses
				return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
			case 2: // Selesai
				return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
			case 3: // Ditolak
				return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
			case 4: // Batal
				return 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400';
			case 5: // Disposisi
				return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
			default:
				return 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400';
		}
	}

	// Handle page navigation
	function navigateToPage(url: string | null) {
		if (url) {
			goto(url.replace(PUBLIC_API_URL, ''));
		}
	}
</script>

<svelte:head>
	<title>Permohonan Informasi - Admin PPID</title>
</svelte:head>

<div class="mb-4 flex items-center justify-between">
	<h2 class="text-xl leading-tight font-semibold text-slate-800 dark:text-slate-100">
		Permohonan Informasi
	</h2>
</div>

<div class="space-y-4">
	<div
		class="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<!-- Header -->
		<div
			class="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center dark:border-slate-700"
		>
			<h3 class="text-lg font-bold text-[#1A305E] dark:text-slate-100">
				Daftar Permohonan Informasi
			</h3>
		</div>

		<!-- Search/Filter -->
		<div
			class="border-b border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/30"
		>
			<form onsubmit={handleSearch} class="flex flex-col gap-4 sm:flex-row">
				<div class="relative max-w-md flex-1">
					<label for="search-input" class="sr-only">Cari permohonan informasi</label>
					<svg
						class="pointer-events-none absolute top-2.5 left-3 h-5 w-5 text-slate-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						></path>
					</svg>
					<input
						id="search-input"
						type="text"
						name="search"
						value={data.filters.search}
						placeholder="Cari nama atau email..."
						autocomplete="off"
						class="w-full rounded-lg border border-slate-200 py-2 pr-4 pl-10 text-sm focus:border-ppid-accent focus:ring-1 focus:ring-ppid-accent focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
					/>
				</div>
				<button
					type="submit"
					class="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500"
				>
					Filter
				</button>
			</form>
		</div>

		<!-- Table -->
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm text-slate-600 dark:text-slate-300">
				<thead
					class="bg-slate-50 text-xs font-semibold text-slate-700 uppercase dark:bg-slate-700/50 dark:text-slate-400"
				>
					<tr>
						<th scope="col" class="px-6 py-4">Nama</th>
						<th scope="col" class="px-6 py-4">Email</th>
						<th scope="col" class="px-6 py-4">Tujuan</th>
						<th scope="col" class="px-6 py-4">Diajukan</th>
						<th scope="col" class="px-6 py-4">Status</th>
						<th scope="col" class="px-6 py-4 text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 dark:divide-slate-700">
					{#if data.permohonan.data.length > 0}
						{#each data.permohonan.data as item}
							<tr
								class="bg-white transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/30"
							>
								<td class="px-6 py-4">
									<div class="flex items-center">
										<div
											class="line-clamp-2 max-w-xs font-medium text-[#1A305E] dark:text-slate-100"
										>
											{item.nama}
										</div>
									</div>
								</td>
								<td class="px-6 py-4">{item.email}</td>
								<td class="px-6 py-4">
									<div class="max-w-xs truncate" title={item.tujuan}>
										{item.tujuan}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									{formatDate(item.created_at)}
								</td>
								<td class="px-6 py-4">
									<span
										class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold {getStatusBadgeClass(
											item.status
										)}"
									>
										{item.status_label}
									</span>
								</td>
								<td class="px-6 py-4 text-right">
									<div class="flex items-center justify-end space-x-2">
										<button
											type="button"
											onclick={() => goto(`/admin/permohonan-informasi/${item.id_permohonan}`)}
											class="text-slate-400 transition-colors hover:text-[#1A305E] dark:text-slate-500 dark:hover:text-[#B8860B]"
											title="Lihat detail permohonan"
											aria-label="Lihat detail permohonan {item.nama}"
										>
											<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												></path>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												></path>
											</svg>
										</button>
										<button
											type="button"
											onclick={() => confirmDelete(item.id_permohonan)}
											class="text-slate-400 transition-colors hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
											title="Hapus permohonan"
											aria-label="Hapus permohonan {item.nama}"
										>
											<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												></path>
											</svg>
										</button>
									</div>
								</td>
							</tr>
						{/each}
					{:else}
						<tr>
							<td colspan="6" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
								<div class="flex flex-col items-center justify-center gap-2">
									<svg
										class="h-12 w-12 text-slate-300 dark:text-slate-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										></path>
									</svg>
									<p>Belum ada data permohonan informasi.</p>
								</div>
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if data.permohonan.data.length > 0}
			<div class="border-t border-slate-100 p-6 dark:border-slate-700">
				<div class="flex items-center justify-between">
					<div class="text-sm text-slate-600 dark:text-slate-400">
						Menampilkan {data.permohonan.from} - {data.permohonan.to} dari {data.permohonan.total}
						data
					</div>
					<nav aria-label="Pagination" class="flex gap-2">
						{#each data.permohonan.links as link}
							{#if link.url}
								<button
									type="button"
									onclick={() => navigateToPage(link.url)}
									class="rounded px-3 py-1 {link.active
										? 'bg-ppid-primary text-white'
										: 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'} text-sm transition-colors"
									disabled={link.active}
									aria-current={link.active ? 'page' : undefined}
								>
									{@html link.label}
								</button>
							{/if}
						{/each}
					</nav>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Confirmation Dialog -->
<ConfirmationDialog
	bind:show={showDeleteDialog}
	title="Hapus Permohonan?"
	description="Data permohonan akan dihapus permanen dan tidak dapat dikembalikan."
	theme="danger"
	confirmText="Ya, Hapus"
	cancelText="Batal"
	onConfirm={handleDelete}
/>

<!-- Notification Dialog -->
<NotificationDialog
	bind:show={showNotification}
	title={notificationTitle}
	description={notificationDescription}
	theme={notificationTheme}
/>
