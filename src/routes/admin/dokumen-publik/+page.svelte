<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import type { PageData } from './$types';
	import type { DokumenPublik } from '$lib/types/DokumenPublikTypes';

	let { data }: { data: PageData } = $props();

	// State management
	let showFilters = $state(false);
	let showDeleteDialog = $state(false);
	let deleteUrl = $state('');
	let deleteId = $state<number | null>(null);
	let selectedIds = $state<number[]>([]);
	let bulkStatus = $state('');

	// Notification state
	let showNotification = $state(false);
	let notificationTheme = $state<'success' | 'error'>('success');
	let notificationTitle = $state('');
	let notificationDescription = $state('');

	// Get user from page data (passed down from layout)
	const user = $derived($page.data.user);
	const isAdmin = $derived(user && user.id_skpd === null);

	// Computed: Check if all items on current page are selected
	const allSelected = $derived(
		data.informasi.data.length > 0 &&
			selectedIds.length === data.informasi.data.length &&
			data.informasi.data.every((item) => selectedIds.includes(item.id_informasi))
	);

	// Toggle all checkboxes
	function toggleAll() {
		if (allSelected) {
			selectedIds = [];
		} else {
			selectedIds = data.informasi.data.map((item) => item.id_informasi);
		}
	}

	// Toggle individual checkbox
	function toggleItem(id: number) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((i) => i !== id);
		} else {
			selectedIds = [...selectedIds, id];
		}
	}

	// Confirm delete single item
	function confirmDelete(id: number) {
		deleteId = id;
		deleteUrl = `/admin/dokumen-publik/${id}`;
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

			const response = await fetch(`${PUBLIC_API_URL}/admin/dokumen-publik/${deleteId}`, {
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
				notificationDescription = 'Dokumen informasi berhasil dihapus.';
				showNotification = true;

				// Reload page after short delay
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			} else {
				notificationTheme = 'error';
				notificationTitle = 'Gagal!';
				notificationDescription = result.message || 'Terjadi kesalahan saat menghapus dokumen.';
				showNotification = true;
			}
		} catch (error) {
			notificationTheme = 'error';
			notificationTitle = 'Gagal!';
			notificationDescription = 'Terjadi kesalahan saat menghapus dokumen.';
			showNotification = true;
		}

		showDeleteDialog = false;
		deleteId = null;
	}

	// Handle bulk delete
	async function handleBulkDelete() {
		if (selectedIds.length === 0) return;
		if (!confirm('Hapus semua data terpilih?')) return;

		try {
			const token = document.cookie
				.split('; ')
				.find((row) => row.startsWith('access_token='))
				?.split('=')[1];

			// Delete each item
			const deletePromises = selectedIds.map((id) =>
				fetch(`${PUBLIC_API_URL}/admin/dokumen-publik/${id}`, {
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: 'application/json'
					}
				})
			);

			await Promise.all(deletePromises);

			notificationTheme = 'success';
			notificationTitle = 'Berhasil!';
			notificationDescription = `${selectedIds.length} dokumen berhasil dihapus.`;
			showNotification = true;
			selectedIds = [];

			// Reload page after short delay
			setTimeout(() => {
				window.location.reload();
			}, 1500);
		} catch (error) {
			notificationTheme = 'error';
			notificationTitle = 'Gagal!';
			notificationDescription = 'Terjadi kesalahan saat menghapus dokumen.';
			showNotification = true;
		}
	}

	// Handle bulk status update
	async function handleBulkStatusUpdate() {
		if (selectedIds.length === 0 || !bulkStatus) return;
		if (!confirm('Ubah status data terpilih?')) return;

		try {
			const token = document.cookie
				.split('; ')
				.find((row) => row.startsWith('access_token='))
				?.split('=')[1];

			// Update each item
			const updatePromises = selectedIds.map((id) =>
				fetch(`${PUBLIC_API_URL}/admin/dokumen-publik/${id}`, {
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ verify: bulkStatus })
				})
			);

			await Promise.all(updatePromises);

			notificationTheme = 'success';
			notificationTitle = 'Berhasil!';
			notificationDescription = `Status ${selectedIds.length} dokumen berhasil diubah.`;
			showNotification = true;
			selectedIds = [];
			bulkStatus = '';

			// Reload page after short delay
			setTimeout(() => {
				window.location.reload();
			}, 1500);
		} catch (error) {
			notificationTheme = 'error';
			notificationTitle = 'Gagal!';
			notificationDescription = 'Terjadi kesalahan saat mengubah status dokumen.';
			showNotification = true;
		}
	}

	// Update URL with filter params
	function updateFilters(params: Record<string, string>) {
		const url = new URL(window.location.href);
		Object.entries(params).forEach(([key, value]) => {
			if (value) {
				url.searchParams.set(key, value);
			} else {
				url.searchParams.delete(key);
			}
		});
		goto(url.pathname + url.search);
	}

	// Handle search
	function handleSearch(event: Event) {
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const search = formData.get('search') as string;
		updateFilters({ search });
	}

	// Handle category filter
	function handleCategoryFilter(event: Event) {
		const select = event.target as HTMLSelectElement;
		updateFilters({ id_kat_info: select.value });
	}

	// Handle SKPD filter
	function handleSkpdFilter(event: Event) {
		const select = event.target as HTMLSelectElement;
		updateFilters({ id_skpd: select.value });
	}

	// Format date for display
	function formatDate(dateString: string | null): string {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(date);
	}

	// Get status badge classes
	function getStatusBadgeClass(verify: string): string {
		switch (verify) {
			case 'y':
				return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
			case 'n':
				return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
			case 't':
				return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
			default:
				return 'bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-400';
		}
	}

	// Get status label
	function getStatusLabel(verify: string): string {
		switch (verify) {
			case 'y':
				return 'Terverifikasi';
			case 'n':
				return 'Pending';
			case 't':
				return 'Ditolak';
			default:
				return 'Unknown';
		}
	}

	// Handle page navigation
	function navigateToPage(url: string | null) {
		if (url) {
			goto(url.replace(PUBLIC_API_URL, ''));
		}
	}

	// Reset all filters
	function resetFilters() {
		goto('/admin/dokumen-publik');
	}

	// Check if has active filters
	const hasActiveFilters = $derived(
		data.filters.search ||
			data.filters.id_kat_info ||
			data.filters.id_skpd ||
			data.filters.verify ||
			data.filters.start_date ||
			data.filters.end_date
	);
</script>

<div class="mb-4 flex items-center justify-between">
	<h2 class="text-xl leading-tight font-semibold text-slate-800 dark:text-slate-100">
		Daftar Informasi Publik
	</h2>
	<a
		href="/admin/dokumen-publik/create"
		class="hover:bg-ppid-dark flex items-center gap-2 rounded-lg bg-ppid-primary px-4 py-2 text-sm font-medium text-white transition-colors"
	>
		<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
			></path>
		</svg>
		Tambah Informasi
	</a>
</div>

<div class="space-y-4">
	<!-- Filters and Actions Card -->
	<div
		class="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<!-- Quick Filters -->
		<div
			class="flex flex-col justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-4 lg:flex-row dark:border-slate-700 dark:bg-slate-700/30"
		>
			<div class="flex w-full flex-1 flex-col gap-3 md:flex-row lg:w-auto">
				<!-- Search -->
				<div class="relative w-full md:w-64">
					<form onsubmit={handleSearch}>
						<input
							type="text"
							name="search"
							value={data.filters.search}
							class="w-full rounded-lg border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 focus:border-ppid-accent focus:ring-1 focus:ring-ppid-accent focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
							placeholder="Cari judul informasi..."
						/>
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg
								class="h-4 w-4 text-slate-400 dark:text-slate-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								></path>
							</svg>
						</div>
					</form>
				</div>

				<!-- Category Filter -->
				<select
					onchange={handleCategoryFilter}
					value={data.filters.id_kat_info}
					class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 focus:border-ppid-accent focus:ring-1 focus:ring-ppid-accent focus:outline-none md:w-48 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
				>
					<option value="">Semua Kategori</option>
					{#each data.kategoriList as kategori}
						<option value={kategori.id_kat_info}>{kategori.nm_kat_info}</option>
					{/each}
				</select>

				<!-- Admin SKPD Filter -->
				{#if isAdmin}
					<select
						onchange={handleSkpdFilter}
						value={data.filters.id_skpd}
						class="w-full min-w-50 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 focus:border-ppid-accent focus:ring-1 focus:ring-ppid-accent focus:outline-none md:flex-1 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
					>
						<option value="">Filter Berdasarkan SKPD...</option>
						{#each data.skpdList as skpd}
							<option value={skpd.id_skpd}>{skpd.nm_skpd}</option>
						{/each}
					</select>
				{/if}

				<!-- Advanced Filter Toggle -->
				<button
					onclick={() => (showFilters = !showFilters)}
					type="button"
					title="Tampilkan Filter Lanjutan"
					class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
						></path>
					</svg>
				</button>
			</div>

			<!-- Bulk Actions -->
			{#if selectedIds.length > 0}
				<div class="flex gap-2">
					<button
						onclick={handleBulkDelete}
						type="button"
						class="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							></path>
						</svg>
						Hapus ({selectedIds.length})
					</button>

					<select
						bind:value={bulkStatus}
						class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-ppid-accent focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
					>
						<option value="">-- Ubah Status --</option>
						<option value="y">Terverifikasi</option>
						<option value="n">Pending</option>
						<option value="t">Ditolak</option>
					</select>
					<button
						onclick={handleBulkStatusUpdate}
						type="button"
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					>
						Terapkan
					</button>
				</div>
			{/if}
		</div>

		<!-- Advanced Filters Panel -->
		{#if showFilters}
			<div
				class="border-b border-slate-100 bg-blue-50/30 p-4 dark:border-slate-700 dark:bg-blue-900/10"
			>
				<form
					action="/admin/dokumen-publik"
					method="GET"
					class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
				>
					<!-- Preserve existing filters -->
					{#if data.filters.search}
						<input type="hidden" name="search" value={data.filters.search} />
					{/if}
					{#if data.filters.id_kat_info}
						<input type="hidden" name="id_kat_info" value={data.filters.id_kat_info} />
					{/if}

					<!-- Status Filter -->
					<div>
						<label class="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300"
							>Status Verifikasi</label
						>
						<select
							name="verify"
							value={data.filters.verify}
							class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-ppid-accent focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
						>
							<option value="">Semua Status</option>
							<option value="y">Terverifikasi</option>
							<option value="n">Pending</option>
							<option value="t">Ditolak</option>
						</select>
					</div>

					<!-- Date Range -->
					<div>
						<label class="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300"
							>Tanggal Mulai</label
						>
						<input
							type="date"
							name="start_date"
							value={data.filters.start_date}
							class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-ppid-accent focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
						/>
					</div>

					<div>
						<label class="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300"
							>Tanggal Akhir</label
						>
						<input
							type="date"
							name="end_date"
							value={data.filters.end_date}
							class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-ppid-accent focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
						/>
					</div>

					<!-- Sort -->
					<div>
						<label class="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300"
							>Urutkan</label
						>
						<select
							name="sort"
							value={data.filters.sort}
							class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-ppid-accent focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
						>
							<option value="newest">Terbaru</option>
							<option value="oldest">Terlama</option>
							<option value="title_asc">Judul A-Z</option>
							<option value="title_desc">Judul Z-A</option>
						</select>
					</div>

					<!-- Actions -->
					<div class="flex items-end gap-2">
						<button
							type="submit"
							class="hover:bg-ppid-dark flex-1 rounded-lg bg-ppid-primary px-4 py-2 text-sm font-medium text-white transition-colors"
						>
							Terapkan Filter
						</button>
						<button
							type="button"
							onclick={resetFilters}
							class="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
						>
							Reset
						</button>
					</div>
				</form>
			</div>
		{/if}

		<!-- Active Filters Display -->
		{#if hasActiveFilters}
			<div
				class="flex flex-wrap items-center gap-2 bg-slate-50 px-4 py-2 text-sm dark:bg-slate-700/50"
			>
				<span class="font-medium text-slate-600 dark:text-slate-300">Filter aktif:</span>
				{#if data.filters.search}
					<span
						class="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
					>
						Pencarian: "{data.filters.search}"
					</span>
				{/if}
				{#if data.filters.verify}
					<span
						class="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
					>
						Status: {getStatusLabel(data.filters.verify)}
					</span>
				{/if}
				{#if data.filters.start_date || data.filters.end_date}
					<span
						class="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
					>
						Periode: {data.filters.start_date || '...'} s/d {data.filters.end_date || '...'}
					</span>
				{/if}
			</div>
		{/if}

		<!-- Table -->
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm text-slate-600 dark:text-slate-300">
				<thead
					class="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-400"
				>
					<tr>
						<th scope="col" class="w-10 px-6 py-3">
							<input
								type="checkbox"
								checked={allSelected}
								onchange={toggleAll}
								class="h-4 w-4 rounded border-slate-300 bg-white text-ppid-primary focus:ring-2 focus:ring-ppid-accent dark:border-slate-600 dark:bg-slate-700 dark:ring-offset-slate-800 dark:focus:ring-ppid-accent"
							/>
						</th>
						<th scope="col" class="px-6 py-3">Judul Informasi</th>
						<th scope="col" class="px-6 py-3">Kategori</th>
						<th scope="col" class="px-6 py-3">SKPD</th>
						<th scope="col" class="px-6 py-3">Unduhan</th>
						<th scope="col" class="px-6 py-3">Status</th>
						<th scope="col" class="px-6 py-3">File</th>
						<th scope="col" class="px-6 py-3 text-right">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#if data.informasi.data.length > 0}
						{#each data.informasi.data as info}
							<tr
								class="border-b border-slate-100 bg-white transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/30"
							>
								<td class="px-6 py-4">
									<input
										type="checkbox"
										checked={selectedIds.includes(info.id_informasi)}
										onchange={() => toggleItem(info.id_informasi)}
										class="h-4 w-4 rounded border-slate-300 bg-white text-ppid-primary focus:ring-2 focus:ring-ppid-accent dark:border-slate-600 dark:bg-slate-700 dark:ring-offset-slate-800 dark:focus:ring-ppid-accent"
									/>
								</td>
								<td class="px-6 py-4">
									<div class="font-medium text-slate-900 dark:text-slate-100">{info.judul}</div>
									<div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
										Uploaded: {formatDate(info.tgl_upload)}
									</div>
								</td>
								<td class="px-6 py-4">
									<span
										class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
									>
										{info.kategori?.nm_kat_info || '-'}
									</span>
								</td>
								<td class="px-6 py-4">
									<span class="text-xs">{info.skpd?.nm_skpd || info.id_skpd}</span>
								</td>
								<td class="px-6 py-4">
									<div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
											/>
										</svg>
										<span class="text-sm font-medium">{info.jumlah_download || 0}</span>
									</div>
								</td>
								<td class="px-6 py-4">
									<span
										class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {getStatusBadgeClass(
											info.verify
										)}"
									>
										{getStatusLabel(info.verify)}
									</span>
								</td>
								<td class="px-6 py-4">
									{#if info.file}
										<a
											href="{PUBLIC_API_URL}/storage/{info.file}"
											target="_blank"
											class="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
										>
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												></path>
											</svg>
											Download
										</a>
									{:else}
										<span class="text-xs text-slate-400 italic">No File</span>
									{/if}
								</td>
								<td class="px-6 py-4 text-right">
									<div class="flex items-center justify-end gap-2">
										<a
											href="/admin/dokumen-publik/edit/{info.id_informasi}"
											class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-ppid-primary dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400"
										>
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
												></path>
											</svg>
										</a>
										<button
											type="button"
											onclick={() => confirmDelete(info.id_informasi)}
											class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
										>
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
							<td colspan="8" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
								<div class="flex flex-col items-center justify-center gap-2">
									<svg
										class="h-8 w-8 text-slate-300 dark:text-slate-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										></path>
									</svg>
									<p>Belum ada data informasi publik</p>
								</div>
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if data.informasi.data.length > 0}
			<div class="border-t border-slate-100 p-4 dark:border-slate-700">
				<div class="flex items-center justify-between">
					<div class="text-sm text-slate-600 dark:text-slate-400">
						Menampilkan {data.informasi.from} - {data.informasi.to} dari {data.informasi.total} data
					</div>
					<div class="flex gap-2">
						{#each data.informasi.links as link}
							{#if link.url}
								<button
									onclick={() => navigateToPage(link.url)}
									class="rounded px-3 py-1 {link.active
										? 'bg-ppid-primary text-white'
										: 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'} text-sm transition-colors"
									disabled={link.active}
								>
									{@html link.label}
								</button>
							{/if}
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Confirmation Dialog -->
<ConfirmationDialog
	bind:show={showDeleteDialog}
	title="Hapus Dokumen?"
	description="Data dokumen akan dihapus permanen dan tidak dapat dikembalikan."
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
