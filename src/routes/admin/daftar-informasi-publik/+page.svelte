<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api'; // Menggunakan helper proxy API
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	// Label kolom diambil dari MatriksDip.php
	const columnLabels = {
		a: 'Jenis Informasi',
		b: 'Ringkasan Isi',
		c: 'Pejabat yang Menguasai'
	};

	let loading = $state(true);
	let items = $state<any[]>([]);
	let search = $state('');
	let pagination = $state<any>({});
	let debounceTimer: ReturnType<typeof setTimeout>;

	// Delete states
	let showDeleteConfirm = $state(false);
	let idToDelete = $state<number | null>(null);

	// Notification states
	let notification = $state({
		show: false,
		type: 'success' as 'success' | 'error',
		message: ''
	});

	onMount(() => fetchData());

	/**
	 * Fetch data menggunakan proxy API helper
	 */
	async function fetchData(page: string | number = 1) {
		loading = true;
		try {
			// Hit ke proxy endpoint /admin/matriks-dip
			const res = await api.get('/admin/matriks-dip', { search, page });
			if (res.success) {
				items = res.data.data;
				pagination = res.data;
			}
		} catch (error) {
			console.error('Fetch error:', error);
		} finally {
			loading = false;
		}
	}

	function handleSearch() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => fetchData(1), 500);
	}

	async function processDelete() {
		if (!idToDelete) return;
		try {
			const res = await api.delete(`/admin/matriks-dip/${idToDelete}`);
			if (res.success) {
				notification = { show: true, type: 'success', message: 'Data berhasil dihapus' };
				fetchData(pagination.current_page);
			}
		} catch (error: any) {
			notification = {
				show: true,
				type: 'error',
				message: error.message || 'Gagal menghapus data'
			};
		} finally {
			idToDelete = null;
		}
	}
</script>

<svelte:head>
	<title>Daftar Informasi Publik - Admin</title>
</svelte:head>

<div class="p-8">
	<header class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-3xl font-black tracking-tight text-slate-800 uppercase dark:text-white">
				Daftar Informasi Publik
			</h1>
			<p class="text-sm font-medium text-slate-500">
				Manajemen Daftar Informasi Publik (DIP) Provinsi Sulawesi Selatan
			</p>
		</div>
		<div class="flex flex-wrap gap-3">
			<div class="relative min-w-[240px]">
				<input
					type="text"
					bind:value={search}
					oninput={handleSearch}
					placeholder="Cari data..."
					class="w-full rounded-xl border-2 border-slate-100 bg-white px-4 py-3 text-sm font-bold dark:border-slate-800 dark:bg-slate-800"
				/>
			</div>
			<a
				href="/admin/daftar-informasi-publik/create"
				class="flex items-center gap-2 rounded-xl bg-ppid-primary px-6 py-3 font-bold text-white shadow-lg shadow-ppid-primary/20 transition-transform active:scale-95"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="3"
					><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg
				>
				TAMBAH DATA
			</a>
		</div>
	</header>

	<div
		class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm" aria-busy={loading}>
				<thead class="bg-slate-50 font-black text-slate-500 uppercase dark:bg-slate-900/50">
					<tr>
						<th class="px-6 py-5">{columnLabels.a}</th>
						<th class="px-6 py-5">{columnLabels.b}</th>
						<th class="px-6 py-5 text-right">AKSI</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 dark:divide-slate-700">
					{#if loading}
						{#each Array(5) as _}
							<tr class="animate-pulse">
								<td class="px-6 py-4"
									><div class="h-4 w-32 rounded bg-slate-100 dark:bg-slate-700"></div></td
								>
								<td class="px-6 py-4"
									><div class="h-4 w-64 rounded bg-slate-100 dark:bg-slate-700"></div></td
								>
								<td class="px-6 py-4"
									><div class="ml-auto h-8 w-16 rounded bg-slate-100 dark:bg-slate-700"></div></td
								>
							</tr>
						{/each}
					{:else}
						{#each items as item (item.id)}
							<tr
								class="text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/30"
							>
								<td class="px-6 py-5 font-bold text-slate-800 dark:text-white">{item.a}</td>
								<td class="px-6 py-5"><p class="line-clamp-2 max-w-md">{item.b}</p></td>
								<td class="px-6 py-5 text-right">
									<div class="flex justify-end gap-2">
										<a
											href="/admin/daftar-informasi-publik/{item.id}/edit"
											class="rounded-xl bg-blue-50 p-2.5 text-blue-600 transition-all hover:bg-blue-600 hover:text-white dark:bg-blue-900/20"
										>
											<svg
												class="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												stroke-width="2"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
												/></svg
											>
										</a>
										<button
											onclick={() => {
												idToDelete = item.id;
												showDeleteConfirm = true;
											}}
											class="rounded-xl bg-red-50 p-2.5 text-red-600 transition-all hover:bg-red-600 hover:text-white dark:bg-red-900/20"
										>
											<svg
												class="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												stroke-width="2"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/></svg
											>
										</button>
									</div>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="3" class="px-6 py-20 text-center text-slate-500 italic"
									>Belum ada data informasi publik.</td
								>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	{#if pagination.last_page > 1}
		<nav class="mt-8 flex items-center justify-between" aria-label="Navigasi Halaman">
			<span class="text-sm font-bold tracking-widest text-slate-400 uppercase">
				Halaman {pagination.current_page} dari {pagination.last_page}
			</span>
			<div class="flex gap-2">
				<button
					disabled={pagination.current_page === 1}
					onclick={() => fetchData(pagination.current_page - 1)}
					class="rounded-xl border-2 border-slate-100 bg-white px-6 py-2 text-sm font-black text-slate-600 transition-all hover:border-ppid-primary hover:text-ppid-primary disabled:opacity-30 dark:border-slate-800 dark:bg-slate-800"
				>
					PREV
				</button>
				<button
					disabled={pagination.current_page === pagination.last_page}
					onclick={() => fetchData(pagination.current_page + 1)}
					class="rounded-xl border-2 border-slate-100 bg-white px-6 py-2 text-sm font-black text-slate-600 transition-all hover:border-ppid-primary hover:text-ppid-primary disabled:opacity-30 dark:border-slate-800 dark:bg-slate-800"
				>
					NEXT
				</button>
			</div>
		</nav>
	{/if}
</div>

<ConfirmationDialog
	bind:show={showDeleteConfirm}
	onConfirm={processDelete}
	title="Hapus Data DIP?"
	description="Data yang dihapus tidak dapat dikembalikan secara permanen."
	theme="danger"
/>

<NotificationDialog
	bind:show={notification.show}
	theme={notification.type}
	title={notification.type === 'success' ? 'BERHASIL' : 'GAGAL'}
	description={notification.message}
/>
