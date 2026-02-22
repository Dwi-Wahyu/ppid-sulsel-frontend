<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { api } from '$lib/api.js';
	import toast, { Toaster } from 'svelte-5-french-toast';

	const { data } = $props();

	let activeTab = $state(data.activeTab);
	let showAll: Record<string, boolean> = {
		kategori: false,
		tahun: false,
		domisili: false,
		pekerjaan: false,
		alasan: false,
		bentuk_informasi: false
	};

	const limitedCount = 10;

	interface ModalState {
		show: boolean;
		mode: 'create' | 'edit';
		item: any;
	}

	// Modal states
	let modals = $state<Record<string, ModalState>>({
		tahun: { show: false, mode: 'create', item: null },
		domisili: { show: false, mode: 'create', item: null },
		pekerjaan: { show: false, mode: 'create', item: null },
		alasan: { show: false, mode: 'create', item: null },
		bentuk_informasi: { show: false, mode: 'create', item: null }
	});

	let deleteConfirm = $state({
		show: false,
		type: '',
		id: null as number | null
	});

	let loading = $state(false);
	let notification = $state({
		show: false,
		type: '',
		message: ''
	});

	function switchTab(tab: string) {
		activeTab = tab;
		goto(`?tab=${tab}`, { replaceState: true, noScroll: true });
	}

	function openModal(type: string, mode: 'create' | 'edit', item: any = null) {
		modals[type] = { show: true, mode, item };
	}

	function closeModal(type: string) {
		modals[type] = { show: false, mode: 'create', item: null };
	}

	function showNotification(type: 'success' | 'error', message: string) {
		notification = { show: true, type, message };
		setTimeout(() => {
			notification.show = false;
		}, 3000);
	}

	async function handleSubmit(type: string, formData: any) {
		loading = true;

		try {
			const endpoint =
				modals[type].mode === 'create'
					? `/admin/master-data/${type === 'pekerjaan' ? 'pekerjaan' : type === 'domisili' ? 'domisili' : type === 'bentuk_informasi' ? 'bentuk-informasi' : type === 'kategori' ? 'kategori-informasi' : type}`
					: `/admin/master-data/${type === 'pekerjaan' ? 'pekerjaan' : type === 'domisili' ? 'domisili' : type === 'bentuk_informasi' ? 'bentuk-informasi' : type === 'kategori' ? 'kategori-informasi' : type}/${modals[type].item.id || modals[type].item.id_kat_info}`;

			let result: any;

			if (modals[type].mode === 'create') {
				result = await api.post(endpoint, formData);
			} else {
				result = await api.put(endpoint, formData);
			}

			if (result.success) {
				toast.success(result.message);
				closeModal(type);
				await invalidateAll();
			} else {
				toast.error(result.message || 'Operasi gagal');
			}
		} catch (error) {
			showNotification('error', 'Terjadi kesalahan pada server');
		} finally {
			loading = false;
		}
	}

	async function handleDelete() {
		loading = true;

		try {
			const typeMap: Record<string, string> = {
				tahun: 'tahun',
				domisili: 'domisili',
				pekerjaan: 'pekerjaan',
				bentuk_informasi: 'bentuk-informasi'
			};

			const endpoint = `/admin/master-data/${typeMap[deleteConfirm.type]}/${deleteConfirm.id}`;

			const result = await api.delete(endpoint);

			if (result.success) {
				await invalidateAll();
				toast.success(result.message);
				deleteConfirm = { show: false, type: '', id: null };
			} else {
				toast.error(result.message || 'Gagal menghapus data');
			}
		} catch (error) {
			toast.error('Terjadi kesalahan pada server');
		} finally {
			loading = false;
		}
	}
</script>

<Toaster />

<svelte:head>
	<title>Master Data - Admin PPID</title>
</svelte:head>

<div class="mb-4">
	<h2 class="text-xl leading-tight font-semibold text-slate-800 dark:text-slate-100">
		Master Data Management
	</h2>
	<p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
		Kelola semua data master dalam satu halaman
	</p>
</div>

<!-- Tabs Navigation -->
<div
	class="overflow-hidden rounded-t-xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
>
	<div class="flex overflow-x-auto border-slate-200 dark:border-slate-700">
		<button
			onclick={() => switchTab('kategori')}
			class="cursor-pointer px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
			'kategori'
				? 'bg-black/5	dark:text-white'
				: 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}"
		>
			Kategori Informasi
		</button>
		<button
			onclick={() => switchTab('tahun')}
			class="cursor-pointer px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
			'tahun'
				? 'bg-black/5	dark:text-white'
				: 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}"
		>
			Tahun Informasi
		</button>
		<button
			onclick={() => switchTab('bentuk_informasi')}
			class="cursor-pointer px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
			'bentuk_informasi'
				? 'bg-black/5	dark:text-white'
				: 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}"
		>
			Bentuk Informasi
		</button>
		<button
			onclick={() => switchTab('domisili')}
			class="cursor-pointer px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
			'domisili'
				? 'bg-black/5	dark:text-white'
				: 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}"
		>
			Domisili
		</button>
		<button
			onclick={() => switchTab('pekerjaan')}
			class="cursor-pointer px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
			'pekerjaan'
				? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
				: 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}"
		>
			Pekerjaan
		</button>
	</div>
</div>

<!-- Tab Content -->
<div
	class="rounded-b-xl border border-t-0 border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
>
	<!-- Kategori Informasi Tab -->
	{#if activeTab === 'kategori'}
		<div class="p-6">
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm text-slate-600 dark:text-slate-300">
					<thead
						class="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-400"
					>
						<tr>
							<th scope="col" class="px-6 py-3">Nama Kategori</th>
							<th scope="col" class="px-6 py-3">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each data.kategoris as kategori, index}
							{#if showAll.kategori || index < limitedCount}
								<tr
									class="border-b border-slate-100 bg-white transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/30"
								>
									<td class="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
										{kategori.nm_kat_info}
									</td>
									<td class="px-6 py-4">
										{#if kategori.is_active}
											<span
												class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400"
												>Aktif</span
											>
										{:else}
											<span
												class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400"
												>Tidak Aktif</span
											>
										{/if}
									</td>
								</tr>
							{/if}
						{:else}
							<tr>
								<td colspan="2" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
									<p>Belum ada data kategori informasi</p>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			{#if data.kategoris.length > 10}
				<div class="mt-4 text-center">
					<button
						onclick={() => (showAll.kategori = !showAll.kategori)}
						class="rounded-lg px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-slate-50 dark:text-blue-400 dark:hover:bg-slate-700"
					>
						{showAll.kategori
							? 'Tampilkan Lebih Sedikit'
							: `Tampilkan Seluruhnya (${data.kategoris.length} items)`}
					</button>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Tahun Informasi Tab -->
	{#if activeTab === 'tahun'}
		<div class="p-6">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Tahun Informasi</h3>
				<button
					onclick={() => openModal('tahun', 'create')}
					class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
						></path>
					</svg>
					Tambah Tahun
				</button>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm text-slate-600 dark:text-slate-300">
					<thead
						class="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-400"
					>
						<tr>
							<th scope="col" class="px-6 py-3">Tahun</th>
							<th scope="col" class="px-6 py-3 text-right">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each data.tahuns as tahun, index}
							{#if showAll.tahun || index < limitedCount}
								<tr
									class="border-b border-slate-100 bg-white transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/30"
								>
									<td class="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
										{tahun.waktu}
									</td>
									<td class="px-6 py-4 text-right">
										<div class="flex items-center justify-end gap-2">
											<button
												onclick={() => openModal('tahun', 'edit', tahun)}
												class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400"
												title="Edit Tahun Informasi"
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
												onclick={() =>
													(deleteConfirm = { show: true, type: 'tahun', id: tahun.id })}
												class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
												title="Hapus Tahun Informasi"
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
							{/if}
						{:else}
							<tr>
								<td colspan="2" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
									<p>Belum ada data tahun</p>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			{#if data.tahuns.length > 10}
				<div class="mt-4 text-center">
					<button
						onclick={() => (showAll.tahun = !showAll.tahun)}
						class="rounded-lg px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-slate-50 dark:text-blue-400 dark:hover:bg-slate-700"
					>
						{showAll.tahun
							? 'Tampilkan Lebih Sedikit'
							: `Tampilkan Seluruhnya (${data.tahuns.length} items)`}
					</button>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Domisili Tab -->
	{#if activeTab === 'domisili'}
		<div class="p-6">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Domisili</h3>
				<button
					onclick={() => openModal('domisili', 'create')}
					class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
						></path>
					</svg>
					Tambah Domisili
				</button>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm text-slate-600 dark:text-slate-300">
					<thead
						class="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-400"
					>
						<tr>
							<th scope="col" class="px-6 py-3">Nama Daerah</th>
							<th scope="col" class="px-6 py-3">Provinsi</th>
							<th scope="col" class="px-6 py-3">Status</th>
							<th scope="col" class="px-6 py-3 text-right">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each data.domisilis as domisili, index}
							{#if showAll.domisili || index < limitedCount}
								<tr
									class="border-b border-slate-100 bg-white transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/30"
								>
									<td class="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
										{domisili.nama_daerah}
									</td>
									<td class="px-6 py-4">{domisili.provinsi}</td>
									<td class="px-6 py-4">
										{#if domisili.is_active}
											<span
												class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400"
												>Aktif</span
											>
										{:else}
											<span
												class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400"
												>Tidak Aktif</span
											>
										{/if}
									</td>
									<td class="px-6 py-4 text-right">
										<div class="flex items-center justify-end gap-2">
											<button
												onclick={() => openModal('domisili', 'edit', domisili)}
												class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400"
												title="Edit Domisili"
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
												onclick={() =>
													(deleteConfirm = { show: true, type: 'domisili', id: domisili.id })}
												class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
												title="Hapus Domisili"
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
							{/if}
						{:else}
							<tr>
								<td colspan="4" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
									<p>Belum ada data domisili</p>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			{#if data.domisilis.length > 10}
				<div class="mt-4 text-center">
					<button
						onclick={() => (showAll.domisili = !showAll.domisili)}
						class="rounded-lg px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-slate-50 dark:text-blue-400 dark:hover:bg-slate-700"
					>
						{showAll.domisili
							? 'Tampilkan Lebih Sedikit'
							: `Tampilkan Seluruhnya (${data.domisilis.length} items)`}
					</button>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Pekerjaan Tab -->
	{#if activeTab === 'pekerjaan'}
		<div class="p-6">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Pekerjaan</h3>
				<button
					onclick={() => openModal('pekerjaan', 'create')}
					class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
						></path>
					</svg>
					Tambah Pekerjaan
				</button>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm text-slate-600 dark:text-slate-300">
					<thead
						class="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-400"
					>
						<tr>
							<th scope="col" class="px-6 py-3">Nama Pekerjaan</th>
							<th scope="col" class="px-6 py-3">Status</th>
							<th scope="col" class="px-6 py-3 text-right">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each data.pekerjaans as pekerjaan, index}
							{#if showAll.pekerjaan || index < limitedCount}
								<tr
									class="border-b border-slate-100 bg-white transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/30"
								>
									<td class="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
										{pekerjaan.nama_pekerjaan}
									</td>
									<td class="px-6 py-4">
										{#if pekerjaan.is_active}
											<span
												class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400"
												>Aktif</span
											>
										{:else}
											<span
												class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400"
												>Tidak Aktif</span
											>
										{/if}
									</td>
									<td class="px-6 py-4 text-right">
										<div class="flex items-center justify-end gap-2">
											<button
												onclick={() => openModal('pekerjaan', 'edit', pekerjaan)}
												class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400"
												title="Edit Pekerjaan"
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
												onclick={() =>
													(deleteConfirm = { show: true, type: 'pekerjaan', id: pekerjaan.id })}
												class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
												title="Hapus Pekerjaan"
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
							{/if}
						{:else}
							<tr>
								<td colspan="3" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
									<p>Belum ada data pekerjaan</p>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			{#if data.pekerjaans.length > 10}
				<div class="mt-4 text-center">
					<button
						onclick={() => (showAll.pekerjaan = !showAll.pekerjaan)}
						class="rounded-lg px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-slate-50 dark:text-blue-400 dark:hover:bg-slate-700"
					>
						{showAll.pekerjaan
							? 'Tampilkan Lebih Sedikit'
							: `Tampilkan Seluruhnya (${data.pekerjaans.length} items)`}
					</button>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Bentuk Informasi Tab -->
	{#if activeTab === 'bentuk_informasi'}
		<div class="p-6">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Bentuk Informasi</h3>
				<button
					onclick={() => openModal('bentuk_informasi', 'create')}
					class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
						></path>
					</svg>
					Tambah Bentuk
				</button>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm text-slate-600 dark:text-slate-300">
					<thead
						class="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-400"
					>
						<tr>
							<th scope="col" class="px-6 py-3">Judul Bentuk Informasi</th>
							<th scope="col" class="px-6 py-3 text-right">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each data.bentukInformasis as bentuk, index}
							{#if showAll.bentuk_informasi || index < limitedCount}
								<tr
									class="border-b border-slate-100 bg-white transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/30"
								>
									<td class="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
										{bentuk.judul}
									</td>
									<td class="px-6 py-4 text-right">
										<div class="flex items-center justify-end gap-2">
											<button
												onclick={() => openModal('bentuk_informasi', 'edit', bentuk)}
												class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400"
												title="Edit Bentuk Informasi"
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
												onclick={() =>
													(deleteConfirm = { show: true, type: 'bentuk_informasi', id: bentuk.id })}
												class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
												title="Hapus Bentuk Informasi"
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
							{/if}
						{:else}
							<tr>
								<td colspan="2" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
									<p>Belum ada data bentuk informasi</p>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			{#if data.bentukInformasis.length > 10}
				<div class="mt-4 text-center">
					<button
						onclick={() => (showAll.bentuk_informasi = !showAll.bentuk_informasi)}
						class="rounded-lg px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-slate-50 dark:text-blue-400 dark:hover:bg-slate-700"
					>
						{showAll.bentuk_informasi
							? 'Tampilkan Lebih Sedikit'
							: `Tampilkan Seluruhnya (${data.bentukInformasis.length} items)`}
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- Tahun Modal -->
{#if modals.tahun.show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-lg bg-white p-6 dark:bg-slate-800">
			<h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
				{modals.tahun.mode === 'create' ? 'Tambah' : 'Edit'} Tahun Informasi
			</h3>
			<form
				onsubmit={(e) => {
					e.preventDefault();

					const formData = {
						waktu:
							modals.tahun.item?.waktu ||
							(document.getElementById('tahun-waktu') as HTMLInputElement).value
					};

					handleSubmit('tahun', formData);
				}}
			>
				<div class="mb-4">
					<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>Tahun

						<input
							id="tahun-waktu"
							type="text"
							value={modals.tahun.item?.waktu || ''}
							required
							class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
					</label>
				</div>
				<div class="flex justify-end gap-2">
					<button
						type="button"
						onclick={() => closeModal('tahun')}
						class="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
					>
						Batal
					</button>
					<button
						type="submit"
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					>
						Simpan
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Domisili Modal -->
{#if modals.domisili.show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-lg bg-white p-6 dark:bg-slate-800">
			<h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
				{modals.domisili.mode === 'create' ? 'Tambah' : 'Edit'} Domisili
			</h3>
			<form
				onsubmit={(e) => {
					e.preventDefault();

					const formData = {
						nama_daerah:
							modals.domisili.item?.nama_daerah ||
							document.getElementById('domisili-nama_daerah').value,
						provinsi:
							modals.domisili.item?.provinsi || document.getElementById('domisili-provinsi').value,
						is_active: document.getElementById('domisili-is_active').checked
					};
					handleSubmit('domisili', formData);
				}}
			>
				<div class="mb-4">
					<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>Nama Daerah

						<input
							id="domisili-nama_daerah"
							type="text"
							value={modals.domisili.item?.nama_daerah || ''}
							required
							class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
					</label>
				</div>
				<div class="mb-4">
					<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>Provinsi

						<input
							id="domisili-provinsi"
							type="text"
							value={modals.domisili.item?.provinsi || ''}
							required
							class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
					</label>
				</div>
				<div class="mb-4">
					<label class="flex items-center gap-2">
						<input
							id="domisili-is_active"
							type="checkbox"
							checked={modals.domisili.item?.is_active || false}
							class="rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-slate-600"
						/>
						<span class="text-sm font-medium text-slate-700 dark:text-slate-300">Aktif</span>
					</label>
				</div>
				<div class="flex justify-end gap-2">
					<button
						type="button"
						onclick={() => closeModal('domisili')}
						class="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
					>
						Batal
					</button>
					<button
						type="submit"
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					>
						Simpan
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Pekerjaan Modal -->
{#if modals.pekerjaan.show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-lg bg-white p-6 dark:bg-slate-800">
			<h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
				{modals.pekerjaan.mode === 'create' ? 'Tambah' : 'Edit'} Pekerjaan
			</h3>
			<form
				onsubmit={() => {
					const formData = {
						nama_pekerjaan:
							modals.pekerjaan.item?.nama_pekerjaan ||
							document.getElementById('pekerjaan-nama_pekerjaan').value,
						is_active: document.getElementById('pekerjaan-is_active').checked
					};
					handleSubmit('pekerjaan', formData);
				}}
			>
				<div class="mb-4">
					<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>Nama Pekerjaan

						<input
							id="pekerjaan-nama_pekerjaan"
							type="text"
							value={modals.pekerjaan.item?.nama_pekerjaan || ''}
							required
							class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
					</label>
				</div>
				<div class="mb-4">
					<label class="flex items-center gap-2">
						<input
							id="pekerjaan-is_active"
							type="checkbox"
							checked={modals.pekerjaan.item?.is_active || false}
							class="rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-slate-600"
						/>
						<span class="text-sm font-medium text-slate-700 dark:text-slate-300">Aktif</span>
					</label>
				</div>
				<div class="flex justify-end gap-2">
					<button
						type="button"
						onclick={() => closeModal('pekerjaan')}
						class="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
					>
						Batal
					</button>
					<button
						type="submit"
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					>
						Simpan
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Bentuk Informasi Modal -->
{#if modals.bentuk_informasi.show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-lg bg-white p-6 dark:bg-slate-800">
			<h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
				{modals.bentuk_informasi.mode === 'create' ? 'Tambah' : 'Edit'} Bentuk Informasi
			</h3>
			<form
				onsubmit={() => {
					const formData = {
						judul:
							modals.bentuk_informasi.item?.judul ||
							document.getElementById('bentuk_informasi-judul').value
					};
					handleSubmit('bentuk_informasi', formData);
				}}
			>
				<div class="mb-4">
					<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>Judul

						<input
							id="bentuk_informasi-judul"
							type="text"
							value={modals.bentuk_informasi.item?.judul || ''}
							required
							class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
					</label>
				</div>
				<div class="flex justify-end gap-2">
					<button
						type="button"
						onclick={() => closeModal('bentuk_informasi')}
						class="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
					>
						Batal
					</button>
					<button
						type="submit"
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					>
						Simpan
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Delete Confirmation -->
{#if deleteConfirm.show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-lg bg-white p-6 dark:bg-slate-800">
			<h3 class="mb-2 text-lg font-semibold text-red-600 dark:text-red-400">Hapus Data?</h3>
			<p class="mb-6 text-sm text-slate-600 dark:text-slate-400">
				Data akan dihapus permanen dan tidak dapat dikembalikan.
			</p>
			<div class="flex justify-end gap-2">
				<button
					onclick={() => (deleteConfirm = { show: false, type: '', id: null })}
					class="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
				>
					Batal
				</button>
				<button
					onclick={handleDelete}
					class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
				>
					Ya, Hapus
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
