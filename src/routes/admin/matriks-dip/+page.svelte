<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	let { data } = $props();

	// Column labels from MatriksDip model
	const columnLabels = {
		a: 'Jenis Informasi',
		b: 'Ringkasan Isi',
		c: 'Pejabat yang Menguasai',
		d: 'Penanggung Jawab',
		e: 'Waktu Pembuatan',
		f: 'Format',
		g: 'Tahun',
		h: 'Tautan Dokumen'
	};

	// State management
	let loading = $state(false);
	let searchQuery = $state(data.search || '');

	// Modal states
	let showCreateModal = $state(false);
	let showEditModal = $state(false);
	let showDeleteModal = $state(false);
	let selectedItem: any = $state(null);

	// Form data for all 8 columns
	let formData = $state({
		a: '',
		b: '',
		c: '',
		d: '',
		e: '',
		f: '',
		g: '',
		h: ''
	});

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

	// Apply search filter
	async function applySearch() {
		const params = new URLSearchParams();
		if (searchQuery) params.append('search', searchQuery);
		goto(`?${params.toString()}`, { noScroll: true });
	}

	// Open create modal
	function openCreateModal() {
		formData = { a: '', b: '', c: '', d: '', e: '', f: '', g: '', h: '' };
		errors = {};
		showCreateModal = true;
	}

	// Open edit modal
	function openEditModal(item: any) {
		selectedItem = item;
		formData = {
			a: item.a || '',
			b: item.b || '',
			c: item.c || '',
			d: item.d || '',
			e: item.e || '',
			f: item.f || '',
			g: item.g || '',
			h: item.h || ''
		};
		errors = {};
		showEditModal = true;
	}

	// Open delete modal
	function openDeleteModal(item: any) {
		selectedItem = item;
		showDeleteModal = true;
	}

	// Handle create
	async function handleCreate() {
		loading = true;
		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('access_token='))
			?.split('=')[1];

		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/matriks-dip`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			const result = await response.json();

			if (response.ok && result.success) {
				showNotification('success', result.message || 'Data berhasil ditambahkan');
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
		loading = true;
		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('access_token='))
			?.split('=')[1];

		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/matriks-dip/${selectedItem.id}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			const result = await response.json();

			if (response.ok && result.success) {
				showNotification('success', result.message || 'Data berhasil diperbarui');
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
			const response = await fetch(`${PUBLIC_API_URL}/admin/matriks-dip/${selectedItem.id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				}
			});

			const result = await response.json();

			if (response.ok && result.success) {
				showNotification('success', result.message || 'Data berhasil dihapus');
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
	<title>Daftar Informasi Publik - Admin PPID</title>
</svelte:head>

<div class="mb-6">
	<h2 class="text-xl leading-tight font-semibold text-slate-800 dark:text-slate-100">
		Daftar Informasi Publik
	</h2>
	<p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
		Kelola data informasi publik yang tersedia
	</p>
</div>

<!-- Search and Add Button -->
<div
	class="mb-4 flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-800"
>
	<div class="relative w-full md:w-64">
		<input
			type="text"
			bind:value={searchQuery}
			onkeydown={(e) => e.key === 'Enter' && applySearch()}
			placeholder="Cari data..."
			class="w-full rounded-lg border border-slate-200 py-2 pr-4 pl-10 text-sm placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
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
	</div>

	<button
		onclick={openCreateModal}
		class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
	>
		<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
		<table class="w-full text-left text-sm text-slate-600 dark:text-slate-300">
			<thead
				class="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-400"
			>
				<tr>
					<th scope="col" class="px-6 py-3">{columnLabels.a}</th>
					<th scope="col" class="px-6 py-3">{columnLabels.b}</th>
					<th scope="col" class="px-6 py-3">{columnLabels.c}</th>
					<th scope="col" class="px-6 py-3 text-right">Aksi</th>
				</tr>
			</thead>
			<tbody>
				{#each data.items.data as item}
					<tr
						class="border-b border-slate-100 bg-white transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/30"
					>
						<td class="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{item.a}</td>
						<td class="px-6 py-4">{item.b?.substring(0, 100)}{item.b?.length > 100 ? '...' : ''}</td
						>
						<td class="px-6 py-4">{item.c?.substring(0, 100)}{item.c?.length > 100 ? '...' : ''}</td
						>
						<td class="px-6 py-4 text-right">
							<div class="flex items-center justify-end gap-2">
								<button
									onclick={() => openEditModal(item)}
									class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-blue-400"
									title="Edit"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
										></path>
									</svg>
								</button>
								<button
									onclick={() => openDeleteModal(item)}
									class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
									title="Hapus"
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
				{:else}
					<tr>
						<td colspan="4" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
							<p>Belum ada data</p>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Pagination -->
	{#if data.items.last_page > 1}
		<div class="border-t border-slate-100 px-6 py-4 dark:border-slate-700">
			<div class="flex items-center justify-between">
				<div class="text-sm text-slate-600 dark:text-slate-400">
					Menampilkan {(data.items.current_page - 1) * 10 + 1} - {Math.min(
						data.items.current_page * 10,
						data.items.total
					)} dari {data.items.total} data
				</div>
				<div class="flex gap-1">
					<button
						onclick={() => changePage(data.items.current_page - 1)}
						disabled={data.items.current_page === 1}
						class="rounded-lg border border-slate-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-slate-600"
					>
						Previous
					</button>
					{#each Array.from({ length: data.items.last_page }, (_, i) => i + 1) as pageNum}
						<button
							onclick={() => changePage(pageNum)}
							class="rounded-lg border px-3 py-1 text-sm {pageNum === data.items.current_page
								? 'border-blue-600 bg-blue-600 text-white'
								: 'border-slate-300 dark:border-slate-600'}"
						>
							{pageNum}
						</button>
					{/each}
					<button
						onclick={() => changePage(data.items.current_page + 1)}
						disabled={data.items.current_page === data.items.last_page}
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
		<div
			class="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 dark:bg-slate-800"
		>
			<h3 class="mb-4 text-lg font-bold text-blue-600 dark:text-blue-400">Form Tambah Data</h3>
			<div class="space-y-4">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<!-- Column A -->
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>{columnLabels.a}</label
						>
						<input
							type="text"
							bind:value={formData.a}
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
						{#if errors.a}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.a[0]}</p>
						{/if}
					</div>

					<!-- Column B -->
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>{columnLabels.b}</label
						>
						<input
							type="text"
							bind:value={formData.b}
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
						{#if errors.b}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.b[0]}</p>
						{/if}
					</div>

					<!-- Column C -->
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>{columnLabels.c}</label
						>
						<input
							type="text"
							bind:value={formData.c}
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
						{#if errors.c}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.c[0]}</p>
						{/if}
					</div>

					<!-- Column D -->
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>{columnLabels.d}</label
						>
						<input
							type="text"
							bind:value={formData.d}
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
						{#if errors.d}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.d[0]}</p>
						{/if}
					</div>

					<!-- Column E -->
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>{columnLabels.e}</label
						>
						<input
							type="text"
							bind:value={formData.e}
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
						{#if errors.e}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.e[0]}</p>
						{/if}
					</div>

					<!-- Column F -->
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>{columnLabels.f}</label
						>
						<input
							type="text"
							bind:value={formData.f}
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
						{#if errors.f}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.f[0]}</p>
						{/if}
					</div>

					<!-- Column G -->
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>{columnLabels.g}</label
						>
						<input
							type="text"
							bind:value={formData.g}
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
						{#if errors.g}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.g[0]}</p>
						{/if}
					</div>

					<!-- Column H -->
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>{columnLabels.h}</label
						>
						<input
							type="text"
							bind:value={formData.h}
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
						{#if errors.h}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.h[0]}</p>
						{/if}
					</div>
				</div>

				<div class="flex justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-700">
					<button
						onclick={() => (showCreateModal = false)}
						class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
					>
						Batal
					</button>
					<button
						onclick={handleCreate}
						disabled={loading}
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-400 dark:bg-blue-600 dark:hover:bg-blue-700"
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
		<div
			class="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 dark:bg-slate-800"
		>
			<h3 class="mb-4 text-lg font-bold text-blue-600 dark:text-blue-400">Form Edit Data</h3>
			<div class="space-y-4">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<!-- Column A -->
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>{columnLabels.a}</label
						>
						<input
							type="text"
							bind:value={formData.a}
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
						{#if errors.a}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.a[0]}</p>
						{/if}
					</div>

					<!-- Column B -->
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>{columnLabels.b}</label
						>
						<input
							type="text"
							bind:value={formData.b}
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
						{#if errors.b}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.b[0]}</p>
						{/if}
					</div>

					<!-- Column C -->
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>{columnLabels.c}</label
						>
						<input
							type="text"
							bind:value={formData.c}
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
						{#if errors.c}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.c[0]}</p>
						{/if}
					</div>

					<!-- Column D -->
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>{columnLabels.d}</label
						>
						<input
							type="text"
							bind:value={formData.d}
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
						{#if errors.d}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.d[0]}</p>
						{/if}
					</div>

					<!-- Column E -->
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>{columnLabels.e}</label
						>
						<input
							type="text"
							bind:value={formData.e}
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
						{#if errors.e}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.e[0]}</p>
						{/if}
					</div>

					<!-- Column F -->
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>{columnLabels.f}</label
						>
						<input
							type="text"
							bind:value={formData.f}
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
						{#if errors.f}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.f[0]}</p>
						{/if}
					</div>

					<!-- Column G -->
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>{columnLabels.g}</label
						>
						<input
							type="text"
							bind:value={formData.g}
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
						{#if errors.g}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.g[0]}</p>
						{/if}
					</div>

					<!-- Column H -->
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>{columnLabels.h}</label
						>
						<input
							type="text"
							bind:value={formData.h}
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
						{#if errors.h}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.h[0]}</p>
						{/if}
					</div>
				</div>

				<div class="flex justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-700">
					<button
						onclick={() => (showEditModal = false)}
						class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
					>
						Batal
					</button>
					<button
						onclick={handleUpdate}
						disabled={loading}
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-400 dark:bg-blue-600 dark:hover:bg-blue-700"
					>
						{loading ? 'Menyimpan...' : 'Simpan Perubahan'}
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
				Data yang dihapus tidak dapat dikembalikan secara permanen.
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
