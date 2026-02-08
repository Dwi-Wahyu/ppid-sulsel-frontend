<script lang="ts">
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { onMount } from 'svelte';

	export let data;

	let activeTab = data.activeTab;
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
	let modals: Record<string, ModalState> = {
		tahun: { show: false, mode: 'create', item: null },
		domisili: { show: false, mode: 'create', item: null },
		pekerjaan: { show: false, mode: 'create', item: null },
		alasan: { show: false, mode: 'create', item: null },
		bentuk_informasi: { show: false, mode: 'create', item: null }
	};

	let deleteConfirm = {
		show: false,
		type: '',
		id: null as number | null
	};

	let loading = false;
	let notification = {
		show: false,
		type: '',
		message: ''
	};

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
		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('access_token='))
			?.split('=')[1];

		try {
			const endpoint =
				modals[type].mode === 'create'
					? `${PUBLIC_API_URL}/admin/master-data/${type === 'alasan' ? 'alasan-pengajuan' : type === 'bentuk_informasi' ? 'bentuk-informasi' : type === 'kategori' ? 'kategori-informasi' : type}`
					: `${PUBLIC_API_URL}/admin/master-data/${type === 'alasan' ? 'alasan-pengajuan' : type === 'bentuk_informasi' ? 'bentuk-informasi' : type === 'kategori' ? 'kategori-informasi' : type}/${modals[type].item.id || modals[type].item.id_kat_info}`;

			const method = modals[type].mode === 'create' ? 'POST' : 'PUT';

			const response = await fetch(endpoint, {
				method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				},
				body: JSON.stringify(formData)
			});

			const result = await response.json();

			if (response.ok && result.success) {
				showNotification('success', result.message);
				closeModal(type);
				await invalidateAll();
			} else {
				showNotification('error', result.message || 'Operasi gagal');
			}
		} catch (error) {
			showNotification('error', 'Terjadi kesalahan pada server');
		} finally {
			loading = false;
		}
	}

	async function handleDelete() {
		loading = true;
		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('access_token='))
			?.split('=')[1];

		try {
			const typeMap: Record<string, string> = {
				tahun: 'tahun',
				domisili: 'domisili',
				pekerjaan: 'pekerjaan',
				alasan: 'alasan-pengajuan',
				bentuk_informasi: 'bentuk-informasi'
			};

			const endpoint = `${PUBLIC_API_URL}/admin/master-data/${typeMap[deleteConfirm.type]}/${deleteConfirm.id}`;

			const response = await fetch(endpoint, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				}
			});

			const result = await response.json();

			if (response.ok && result.success) {
				showNotification('success', result.message);
				deleteConfirm = { show: false, type: '', id: null };
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
</script>

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
	<div class="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700">
		<button
			on:click={() => switchTab('kategori')}
			class="px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
			'kategori'
				? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
				: 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}"
		>
			Kategori Informasi
		</button>
		<button
			on:click={() => switchTab('tahun')}
			class="px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
			'tahun'
				? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
				: 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}"
		>
			Tahun Informasi
		</button>
		<button
			on:click={() => switchTab('domisili')}
			class="px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
			'domisili'
				? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
				: 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}"
		>
			Domisili
		</button>
		<button
			on:click={() => switchTab('pekerjaan')}
			class="px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
			'pekerjaan'
				? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
				: 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}"
		>
			Pekerjaan
		</button>
		<button
			on:click={() => switchTab('alasan')}
			class="px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
			'alasan'
				? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
				: 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}"
		>
			Alasan Pengajuan Keberatan
		</button>
		<button
			on:click={() => switchTab('bentuk_informasi')}
			class="px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
			'bentuk_informasi'
				? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
				: 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}"
		>
			Bentuk Informasi
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
						on:click={() => (showAll.kategori = !showAll.kategori)}
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
					on:click={() => openModal('tahun', 'create')}
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
												on:click={() => openModal('tahun', 'edit', tahun)}
												class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400"
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
												on:click={() =>
													(deleteConfirm = { show: true, type: 'tahun', id: tahun.id })}
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
						on:click={() => (showAll.tahun = !showAll.tahun)}
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
					on:click={() => openModal('domisili', 'create')}
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
												on:click={() => openModal('domisili', 'edit', domisili)}
												class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400"
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
												on:click={() =>
													(deleteConfirm = { show: true, type: 'domisili', id: domisili.id })}
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
						on:click={() => (showAll.domisili = !showAll.domisili)}
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
					on:click={() => openModal('pekerjaan', 'create')}
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
												on:click={() => openModal('pekerjaan', 'edit', pekerjaan)}
												class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400"
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
												on:click={() =>
													(deleteConfirm = { show: true, type: 'pekerjaan', id: pekerjaan.id })}
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
						on:click={() => (showAll.pekerjaan = !showAll.pekerjaan)}
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

	<!-- Alasan Pengajuan Tab -->
	{#if activeTab === 'alasan'}
		<div class="p-6">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
					Alasan Pengajuan Keberatan
				</h3>
				<button
					on:click={() => openModal('alasan', 'create')}
					class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
						></path>
					</svg>
					Tambah Alasan
				</button>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm text-slate-600 dark:text-slate-300">
					<thead
						class="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-400"
					>
						<tr>
							<th scope="col" class="px-6 py-3">Alasan</th>
							<th scope="col" class="px-6 py-3 text-right">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each data.alasanPengajuans as alasan, index}
							{#if showAll.alasan || index < limitedCount}
								<tr
									class="border-b border-slate-100 bg-white transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/30"
								>
									<td class="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
										{alasan.alasan}
									</td>
									<td class="px-6 py-4 text-right">
										<div class="flex items-center justify-end gap-2">
											<button
												on:click={() => openModal('alasan', 'edit', alasan)}
												class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400"
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
												on:click={() =>
													(deleteConfirm = { show: true, type: 'alasan', id: alasan.id })}
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
							{/if}
						{:else}
							<tr>
								<td colspan="2" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
									<p>Belum ada data alasan pengajuan</p>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			{#if data.alasanPengajuans.length > 10}
				<div class="mt-4 text-center">
					<button
						on:click={() => (showAll.alasan = !showAll.alasan)}
						class="rounded-lg px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-slate-50 dark:text-blue-400 dark:hover:bg-slate-700"
					>
						{showAll.alasan
							? 'Tampilkan Lebih Sedikit'
							: `Tampilkan Seluruhnya (${data.alasanPengajuans.length} items)`}
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
					on:click={() => openModal('bentuk_informasi', 'create')}
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
												on:click={() => openModal('bentuk_informasi', 'edit', bentuk)}
												class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400"
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
												on:click={() =>
													(deleteConfirm = { show: true, type: 'bentuk_informasi', id: bentuk.id })}
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
						on:click={() => (showAll.bentuk_informasi = !showAll.bentuk_informasi)}
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
				on:submit|preventDefault={() => {
					const formData = {
						waktu: modals.tahun.item?.waktu || document.getElementById('tahun-waktu').value
					};
					handleSubmit('tahun', formData);
				}}
			>
				<div class="mb-4">
					<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>Tahun</label
					>
					<input
						id="tahun-waktu"
						type="text"
						value={modals.tahun.item?.waktu || ''}
						required
						class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
					/>
				</div>
				<div class="flex justify-end gap-2">
					<button
						type="button"
						on:click={() => closeModal('tahun')}
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
				on:submit|preventDefault={() => {
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
						>Nama Daerah</label
					>
					<input
						id="domisili-nama_daerah"
						type="text"
						value={modals.domisili.item?.nama_daerah || ''}
						required
						class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
					/>
				</div>
				<div class="mb-4">
					<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>Provinsi</label
					>
					<input
						id="domisili-provinsi"
						type="text"
						value={modals.domisili.item?.provinsi || ''}
						required
						class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
					/>
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
						on:click={() => closeModal('domisili')}
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
				on:submit|preventDefault={() => {
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
						>Nama Pekerjaan</label
					>
					<input
						id="pekerjaan-nama_pekerjaan"
						type="text"
						value={modals.pekerjaan.item?.nama_pekerjaan || ''}
						required
						class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
					/>
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
						on:click={() => closeModal('pekerjaan')}
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

<!-- Alasan Pengajuan Modal -->
{#if modals.alasan.show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-lg bg-white p-6 dark:bg-slate-800">
			<h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
				{modals.alasan.mode === 'create' ? 'Tambah' : 'Edit'} Alasan Pengajuan
			</h3>
			<form
				on:submit|preventDefault={() => {
					const formData = {
						alasan: modals.alasan.item?.alasan || document.getElementById('alasan-alasan').value
					};
					handleSubmit('alasan', formData);
				}}
			>
				<div class="mb-4">
					<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>Alasan</label
					>
					<input
						id="alasan-alasan"
						type="text"
						value={modals.alasan.item?.alasan || ''}
						required
						class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
					/>
				</div>
				<div class="flex justify-end gap-2">
					<button
						type="button"
						on:click={() => closeModal('alasan')}
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
				on:submit|preventDefault={() => {
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
						>Judul</label
					>
					<input
						id="bentuk_informasi-judul"
						type="text"
						value={modals.bentuk_informasi.item?.judul || ''}
						required
						class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
					/>
				</div>
				<div class="flex justify-end gap-2">
					<button
						type="button"
						on:click={() => closeModal('bentuk_informasi')}
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
					on:click={() => (deleteConfirm = { show: false, type: '', id: null })}
					class="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
				>
					Batal
				</button>
				<button
					on:click={handleDelete}
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
