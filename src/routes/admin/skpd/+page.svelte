<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	let { data } = $props();

	// State management
	let loading = $state(false);
	let searchQuery = $state(data.search || '');
	let showDeleteModal = $state(false);
	let selectedSkpd: any = $state(null);

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

	// Apply search
	async function applySearch() {
		const params = new URLSearchParams();
		if (searchQuery) params.append('search', searchQuery);
		goto(`?${params.toString()}`, { noScroll: true });
	}

	// Navigate to detail page
	function viewSkpd(id: string) {
		goto(`/admin/skpd/${id}`);
	}

	// Open delete modal
	function openDeleteModal(skpd: any) {
		selectedSkpd = skpd;
		showDeleteModal = true;
	}

	// Handle delete
	async function handleDelete() {
		loading = true;
		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('access_token='))
			?.split('=')[1];

		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/skpd/${selectedSkpd.id_skpd}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				}
			});

			const result = await response.json();

			if (response.ok && result.success) {
				showNotification('success', result.message || 'SKPD berhasil dihapus');
				showDeleteModal = false;
				await invalidateAll();
			} else {
				showNotification('error', result.message || 'Gagal menghapus SKPD');
			}
		} catch (error) {
			showNotification('error', 'Terjadi kesalahan pada server');
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Manajemen SKPD - Admin PPID</title>
</svelte:head>

<div class="mb-6">
	<h2 class="text-xl leading-tight font-semibold text-slate-800 dark:text-slate-100">
		Manajemen SKPD
	</h2>
	<p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
		Kelola data Satuan Kerja Perangkat Daerah
	</p>
</div>

<!-- Search -->
<div
	class="mb-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
>
	<div class="relative w-full md:w-64">
		<input
			type="text"
			bind:value={searchQuery}
			onkeydown={(e) => e.key === 'Enter' && applySearch()}
			placeholder="Cari SKPD..."
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
					<th scope="col" class="px-6 py-3">ID SKPD</th>
					<th scope="col" class="px-6 py-3">Nama SKPD</th>
					<th scope="col" class="px-6 py-3">Email</th>
					<th scope="col" class="px-6 py-3">Jenis</th>
					<th scope="col" class="px-6 py-3">Status</th>
					<th scope="col" class="px-6 py-3 text-right">Aksi</th>
				</tr>
			</thead>
			<tbody>
				{#each data.skpds as skpd}
					<tr
						class="border-b border-slate-100 bg-white transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/30"
					>
						<td class="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{skpd.id_skpd}</td>
						<td class="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{skpd.nm_skpd}</td>
						<td class="px-6 py-4">{skpd.email || '-'}</td>
						<td class="px-6 py-4">
							{#if skpd.jenis === 'opd'}
								<span
									class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
								>
									OPD
								</span>
							{:else if skpd.jenis === 'kab'}
								<span
									class="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
								>
									Kabupaten
								</span>
							{:else}
								<span class="text-slate-400">-</span>
							{/if}
						</td>
						<td class="px-6 py-4">
							{#if skpd.is_active === '1'}
								<span
									class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400"
								>
									Aktif
								</span>
							{:else}
								<span
									class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400"
								>
									Tidak Aktif
								</span>
							{/if}
						</td>
						<td class="px-6 py-4 text-right">
							<div class="flex items-center justify-end gap-2">
								<button
									onclick={() => viewSkpd(skpd.id_skpd)}
									class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-blue-400"
									title="Detail"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
							</div>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
							<p>Belum ada data SKPD</p>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<!-- Delete Modal -->
{#if showDeleteModal && selectedSkpd}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-lg bg-white p-6 dark:bg-slate-800">
			<h3 class="mb-2 text-lg font-semibold text-red-600 dark:text-red-400">Hapus SKPD?</h3>
			<p class="mb-6 text-sm text-slate-600 dark:text-slate-400">
				Anda yakin ingin menghapus SKPD <strong>{selectedSkpd.nm_skpd}</strong>? Data akan dihapus
				permanen dan tidak dapat dikembalikan.
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
