<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import FilePond from '$lib/components/FilePond.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	// State management
	let loading = $state(false);
	let searchQuery = $state(data.search || '');
	let sortFilter = $state(data.sort || '');
	let startDate = $state(data.startDate || '');
	let endDate = $state(data.endDate || '');

	// Modal states
	let showCreateModal = $state(false);
	let showEditModal = $state(false);
	let showDeleteModal = $state(false);
	let selectedItem: any = $state(null);

	// Form data
	let namaJabatan = $state('');
	let uploadedFile: File | null = $state(null);
	let editUploadedFile: File | null = $state(null);

	// Validation errors
	let errors = $state<Record<string, string[]>>({});

	// Notification
	let notification = $state({
		show: false,
		type: 'success' as 'success' | 'error',
		message: ''
	});

	function showNotification(type: 'success' | 'error', message: string) {
		notification = { show: true, type, message };
		setTimeout(() => {
			notification = { show: false, type: 'success', message: '' };
		}, 3000);
	}

	// Apply filters
	async function applyFilters() {
		const params = new URLSearchParams();
		if (searchQuery) params.append('search', searchQuery);
		if (sortFilter) params.append('sort', sortFilter);
		if (startDate) params.append('start_date', startDate);
		if (endDate) params.append('end_date', endDate);

		goto(`?${params.toString()}`, { noScroll: true });
	}

	// Reset filters
	function resetFilters() {
		searchQuery = '';
		sortFilter = '';
		startDate = '';
		endDate = '';
		goto('/admin/ikphns', { noScroll: true });
	}

	// Open create modal
	function openCreateModal() {
		namaJabatan = '';
		uploadedFile = null;
		errors = {};
		showCreateModal = true;
	}

	// Open edit modal
	function openEditModal(item: any) {
		selectedItem = item;
		namaJabatan = item.nama_jabatan;
		editUploadedFile = null;
		errors = {};
		showEditModal = true;
	}

	// Open delete modal
	function openDeleteModal(item: any) {
		selectedItem = item;
		showDeleteModal = true;
	}

	// Validate form
	function validateForm(isEdit: boolean = false): boolean {
		errors = {};
		let isValid = true;

		if (!namaJabatan.trim()) {
			errors.nama_jabatan = ['Nama jabatan harus diisi'];
			isValid = false;
		}

		if (!isEdit && !uploadedFile) {
			errors.file = ['File harus diunggah'];
			isValid = false;
		}

		return isValid;
	}

	// Handle create
	async function handleCreate() {
		if (!validateForm()) return;

		loading = true;
		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('access_token='))
			?.split('=')[1];

		try {
			const formData = new FormData();
			formData.append('nama_jabatan', namaJabatan);
			if (uploadedFile) {
				formData.append('file', uploadedFile);
			}

			const response = await fetch(`${PUBLIC_API_URL}/admin/ikphn`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				},
				body: formData
			});

			const result = await response.json();

			if (response.ok && result.success) {
				showNotification('success', result.message);
				showCreateModal = false;
				await invalidateAll();
			} else {
				if (result.errors) {
					errors = result.errors;
				}
				showNotification('error', result.message || 'Gagal menambahkan data');
			}
		} catch (error) {
			showNotification('error', 'Terjadi kesalahan pada server');
		} finally {
			loading = false;
		}
	}

	// Handle update
	async function handleUpdate() {
		if (!validateForm(true)) return;

		loading = true;
		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('access_token='))
			?.split('=')[1];

		try {
			const formData = new FormData();
			formData.append('nama_jabatan', namaJabatan);
			if (editUploadedFile) {
				formData.append('file', editUploadedFile);
			}
			formData.append('_method', 'PUT');

			const response = await fetch(`${PUBLIC_API_URL}/admin/ikphn/${selectedItem.id}`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				},
				body: formData
			});

			const result = await response.json();

			if (response.ok && result.success) {
				showNotification('success', result.message);
				showEditModal = false;
				await invalidateAll();
			} else {
				if (result.errors) {
					errors = result.errors;
				}
				showNotification('error', result.message || 'Gagal memperbarui data');
			}
		} catch (error) {
			showNotification('error', 'Terjadi kesalahan pada server');
		} finally {
			loading = false;
		}
	}

	// Handle delete
	async function handleDelete() {
		loading = true;
		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('access_token='))
			?.split('=')[1];

		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/ikphn/${selectedItem.id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				}
			});

			const result = await response.json();

			if (response.ok && result.success) {
				showNotification('success', result.message);
				showDeleteModal = false;
				await invalidateAll();
			} else {
				showNotification('error', result.message || 'Gagal menghapus data');
			}
		} catch (error) {
			showNotification('error', 'Terjadi kesalahan pada server');
		} finally {
			loading = false;
		}
	}

	// Pagination
	function changePage(pageNum: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', pageNum.toString());
		goto(`?${params.toString()}`, { noScroll: true });
	}
</script>

<svelte:head>
	<title>IKPHN - Admin PPID</title>
</svelte:head>

<div class="mb-6">
	<h2 class="text-xl leading-tight font-semibold text-slate-800 dark:text-slate-100">
		Informasi Keputusan Pejabat Hukum dan Nomenklatur
	</h2>
	<p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
		Kelola data IKPHN yang tersedia untuk publik
	</p>
</div>

<!-- Filters -->
<div
	class="mb-6 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
>
	<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
		<div>
			<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>Pencarian</label
			>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Cari nama jabatan..."
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
			/>
		</div>
		<div>
			<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>Urutkan</label
			>
			<select
				bind:value={sortFilter}
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
			>
				<option value="">Terbaru</option>
				<option value="oldest">Terlama</option>
				<option value="title_asc">Nama A-Z</option>
				<option value="title_desc">Nama Z-A</option>
			</select>
		</div>
		<div>
			<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>Dari Tanggal</label
			>
			<input
				type="date"
				bind:value={startDate}
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
			/>
		</div>
		<div>
			<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>Sampai Tanggal</label
			>
			<input
				type="date"
				bind:value={endDate}
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
			/>
		</div>
	</div>
	<div class="mt-4 flex gap-2">
		<button
			onclick={applyFilters}
			class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
		>
			Terapkan Filter
		</button>
		<button
			onclick={resetFilters}
			class="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
		>
			Reset
		</button>
	</div>
</div>

<!-- Add Button -->
<div class="mb-4">
	<button
		onclick={openCreateModal}
		class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
	>
		<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
			></path>
		</svg>
		Tambah Data
	</button>
</div>

<!-- Data Table -->
<div
	class="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
>
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700">
				<tr>
					<th
						class="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase dark:text-slate-300"
						>No</th
					>
					<th
						class="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase dark:text-slate-300"
						>Nama Jabatan</th
					>
					<th
						class="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase dark:text-slate-300"
						>File</th
					>
					<th
						class="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase dark:text-slate-300"
						>Jumlah Download</th
					>
					<th
						class="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase dark:text-slate-300"
						>Tanggal</th
					>
					<th
						class="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase dark:text-slate-300"
						>Aksi</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-200 dark:divide-slate-700">
				{#each data.ikphns.data as item, idx}
					<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
						<td class="px-6 py-4 text-sm text-slate-900 dark:text-slate-100">
							{(data.ikphns.current_page - 1) * 10 + idx + 1}
						</td>
						<td class="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100"
							>{item.nama_jabatan}</td
						>
						<td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
							{#if item.file}
								<a
									href={`${PUBLIC_API_URL}/storage/${item.file}`}
									target="_blank"
									class="text-blue-600 hover:underline dark:text-blue-400"
								>
									Lihat File
								</a>
							{:else}
								<span class="text-slate-400">Tidak ada file</span>
							{/if}
						</td>
						<td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400"
							>{item.jumlah_download || 0}</td
						>
						<td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
							{new Date(item.created_at).toLocaleDateString('id-ID')}
						</td>
						<td class="px-6 py-4 text-center">
							<div class="flex justify-center gap-2">
								<button
									onclick={() => openEditModal(item)}
									class="rounded p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-700"
									title="Edit"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
										></path>
									</svg>
								</button>
								<button
									onclick={() => openDeleteModal(item)}
									class="rounded p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-700"
									title="Hapus"
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
				{:else}
					<tr>
						<td
							colspan="6"
							class="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
						>
							<div class="flex flex-col items-center gap-2">
								<svg
									class="h-12 w-12 text-slate-300 dark:text-slate-600"
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
								<p>Tidak ada data IKPHN</p>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Pagination -->
	{#if data.ikphns.last_page > 1}
		<div class="border-t border-slate-200 px-6 py-4 dark:border-slate-700">
			<div class="flex items-center justify-between">
				<div class="text-sm text-slate-600 dark:text-slate-400">
					Menampilkan {(data.ikphns.current_page - 1) * 10 + 1} - {Math.min(
						data.ikphns.current_page * 10,
						data.ikphns.total
					)} dari {data.ikphns.total} data
				</div>
				<div class="flex gap-1">
					<button
						onclick={() => changePage(data.ikphns.current_page - 1)}
						disabled={data.ikphns.current_page === 1}
						class="rounded-lg border border-slate-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-slate-600"
					>
						Previous
					</button>
					{#each Array.from({ length: data.ikphns.last_page }, (_, i) => i + 1) as pageNum}
						<button
							onclick={() => changePage(pageNum)}
							class="rounded-lg border px-3 py-1 text-sm {pageNum === data.ikphns.current_page
								? 'border-blue-600 bg-blue-600 text-white'
								: 'border-slate-300 dark:border-slate-600'}"
						>
							{pageNum}
						</button>
					{/each}
					<button
						onclick={() => changePage(data.ikphns.current_page + 1)}
						disabled={data.ikphns.current_page === data.ikphns.last_page}
						class="rounded-lg border border-slate-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-slate-600"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Create Modal -->
{#if showCreateModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-slate-800">
			<h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
				Tambah Data IKPHN
			</h3>
			<div class="space-y-4">
				<div>
					<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
						Nama Jabatan <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						bind:value={namaJabatan}
						class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 {errors.nama_jabatan
							? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
							: ''}"
						placeholder="Masukkan nama jabatan"
					/>
					{#if errors.nama_jabatan}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nama_jabatan[0]}</p>
					{/if}
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
						Upload File <span class="text-red-500">*</span>
					</label>
					<FilePond
						name="file"
						allowMultiple={false}
						acceptedFileTypes={[
							'application/pdf',
							'application/msword',
							'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
							'application/vnd.ms-excel',
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
							'image/jpeg',
							'image/jpg',
							'image/png'
						]}
						bind:value={uploadedFile}
						label={'Drag & Drop file atau <span class="filepond--label-action">Browse</span><br/><span class="text-xs text-slate-500">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB)</span>'}
					/>
					{#if errors.file}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.file[0]}</p>
					{/if}
				</div>

				<div class="flex justify-end gap-2">
					<button
						onclick={() => (showCreateModal = false)}
						class="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
					>
						Batal
					</button>
					<button
						onclick={handleCreate}
						disabled={loading}
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-400"
					>
						{loading ? 'Menyimpan...' : 'Simpan'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Edit Modal -->
{#if showEditModal && selectedItem}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-slate-800">
			<h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Edit Data IKPHN</h3>
			<div class="space-y-4">
				<div>
					<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
						Nama Jabatan <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						bind:value={namaJabatan}
						class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 {errors.nama_jabatan
							? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
							: ''}"
						placeholder="Masukkan nama jabatan"
					/>
					{#if errors.nama_jabatan}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nama_jabatan[0]}</p>
					{/if}
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
						Upload File Baru (Opsional)
					</label>
					{#if selectedItem.file}
						<p class="mb-2 text-sm text-slate-600 dark:text-slate-400">
							File saat ini: <a
								href={`${PUBLIC_API_URL}/storage/${selectedItem.file}`}
								target="_blank"
								class="text-blue-600 hover:underline dark:text-blue-400"
							>
								Lihat file
							</a>
						</p>
					{/if}
					<FilePond
						name="file"
						allowMultiple={false}
						acceptedFileTypes={[
							'application/pdf',
							'application/msword',
							'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
							'application/vnd.ms-excel',
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
							'image/jpeg',
							'image/jpg',
							'image/png'
						]}
						bind:value={editUploadedFile}
						label={'Drag & Drop file atau <span class="filepond--label-action">Browse</span><br/><span class="text-xs text-slate-500">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB)</span>'}
					/>
					{#if errors.file}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.file[0]}</p>
					{/if}
				</div>

				<div class="flex justify-end gap-2">
					<button
						onclick={() => (showEditModal = false)}
						class="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
					>
						Batal
					</button>
					<button
						onclick={handleUpdate}
						disabled={loading}
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-400"
					>
						{loading ? 'Menyimpan...' : 'Update'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Delete Modal -->
{#if showDeleteModal && selectedItem}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-lg bg-white p-6 dark:bg-slate-800">
			<h3 class="mb-2 text-lg font-semibold text-red-600 dark:text-red-400">Hapus Data?</h3>
			<p class="mb-6 text-sm text-slate-600 dark:text-slate-400">
				Anda yakin ingin menghapus data <strong>{selectedItem.nama_jabatan}</strong>? Data akan
				dihapus permanen dan tidak dapat dikembalikan.
			</p>
			<div class="flex justify-end gap-2">
				<button
					onclick={() => (showDeleteModal = false)}
					class="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
				>
					Batal
				</button>
				<button
					onclick={handleDelete}
					disabled={loading}
					class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-slate-400"
				>
					{loading ? 'Menghapus...' : 'Ya, Hapus'}
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Notification -->
{#if notification.show}
	<div
		class="fixed right-4 bottom-4 z-50 max-w-sm rounded-lg p-4 shadow-lg {notification.type ===
		'success'
			? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
			: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}"
	>
		<p class="font-medium">{notification.message}</p>
	</div>
{/if}

<!-- Loading Overlay -->
{#if loading}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
	</div>
{/if}
