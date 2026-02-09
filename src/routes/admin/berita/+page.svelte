<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api'; // Helper Proxy API untuk menghindari CORS
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	interface SKPD {
		id_skpd: string;
		nm_skpd: string;
	}

	interface Berita {
		id_berita: number;
		judul: string;
		deskripsi: string;
		img_berita: string | null;
		tgl_upload: string;
		verify: 'y' | 'n' | 't';
		id_skpd: string | null;
		skpd: SKPD | null;
		created_at: string | null;
		updated_at: string | null;
	}

	interface PaginationData {
		current_page: number;
		last_page: number;
		from: number;
		to: number;
		total: number;
		next_page_url: string | null;
		prev_page_url: string | null;
	}

	// State Management (Svelte 5 Runes)
	let loading = $state(true);
	let news = $state<Berita[]>([]);
	let pagination = $state<Partial<PaginationData>>({});
	let search = $state('');
	let debounceTimer: ReturnType<typeof setTimeout>;

	// Action States
	let showDeleteConfirm = $state(false);
	let deleteId = $state<number | null>(null);
	let isDeleting = $state(false);

	onMount(async () => {
		await fetchData();
	});

	/**
	 * Mengambil data melalui proxy internal
	 */
	async function fetchData(page: number | string = 1) {
		loading = true;
		try {
			const res = await api.get('/admin/berita', {
				search: search || null,
				page: page
			});

			if (res.success) {
				// Berdasarkan JSON: data berita ada di res.data.data
				const paginatedData = res.data;
				news = paginatedData.data;
				pagination = {
					current_page: paginatedData.current_page,
					last_page: paginatedData.last_page,
					from: paginatedData.from,
					to: paginatedData.to,
					total: paginatedData.total,
					next_page_url: paginatedData.next_page_url,
					prev_page_url: paginatedData.prev_page_url
				};
			}
		} catch (error) {
			console.error('Fetch error:', error);
		} finally {
			loading = false;
		}
	}

	function handleSearchInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			fetchData(1);
		}, 500);
	}

	function changePage(url: string | null) {
		if (!url) return;
		const urlObj = new URL(url);
		const page = urlObj.searchParams.get('page');
		if (page) fetchData(page);
	}

	function getStatusConfig(val: string) {
		if (val === 'y')
			return {
				label: 'Terverifikasi',
				class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
			};
		if (val === 'n')
			return {
				label: 'Ditolak',
				class: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
			};
		return {
			label: 'Pending',
			class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
		};
	}

	function formatDate(dateStr: string): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function confirmDelete(id: number) {
		deleteId = id;
		showDeleteConfirm = true;
	}

	async function handleDelete() {
		if (deleteId === null) return;
		isDeleting = true;
		try {
			const res = await api.delete(`/admin/berita/${deleteId}`);
			if (res.success) {
				await fetchData(pagination.current_page || 1);
				showDeleteConfirm = false;
			}
		} catch (error) {
			console.error('Delete error:', error);
		} finally {
			isDeleting = false;
			deleteId = null;
		}
	}
</script>

<svelte:head>
	<title>Manajemen Berita - Admin</title>
</svelte:head>

<div class="space-y-6 p-6">
	<header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="text-3xl font-black tracking-tight text-slate-800 uppercase dark:text-white">
				Daftar Berita
			</h1>
			<p class="text-sm font-medium text-slate-500">Kelola dan publikasi berita sektoral SKPD.</p>
		</div>
		<div class="flex items-center gap-3">
			<div class="relative">
				<input
					type="text"
					bind:value={search}
					oninput={handleSearchInput}
					placeholder="Cari judul berita..."
					aria-label="Cari berita"
					class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm focus:ring-2 focus:ring-ppid-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
				/>
				<div class="pointer-events-none absolute top-3.5 left-3.5 text-slate-400">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/></svg
					>
				</div>
			</div>
			<a
				href="/admin/berita/create"
				class="inline-flex items-center gap-2 rounded-xl bg-ppid-primary px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-ppid-primary/20 transition-all hover:opacity-90"
				aria-label="Tambah berita baru"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 20 20"
					fill="currentColor"
					><path
						fill-rule="evenodd"
						d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
						clip-rule="evenodd"
					/></svg
				>
				TAMBAH BERITA
			</a>
		</div>
	</header>

	<div
		class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-700 dark:bg-slate-800"
	>
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm" aria-busy={loading}>
				<thead
					class="border-b border-slate-200 bg-slate-50 font-black text-slate-500 uppercase dark:border-slate-700 dark:bg-slate-900/50"
				>
					<tr>
						<th scope="col" class="px-6 py-5">Judul Berita</th>
						<th scope="col" class="px-6 py-5">SKPD Pengirim</th>
						<th scope="col" class="px-6 py-5">Status</th>
						<th scope="col" class="px-6 py-5">Tanggal</th>
						<th scope="col" class="px-6 py-5 text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 dark:divide-slate-700">
					{#if loading}
						{#each Array(5) as _}
							<tr class="animate-pulse">
								<td class="px-6 py-5"
									><div class="h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-700"></div></td
								>
								<td class="px-6 py-5"
									><div class="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-700"></div></td
								>
								<td class="px-6 py-5"
									><div class="h-6 w-16 rounded-full bg-slate-100 dark:bg-slate-700"></div></td
								>
								<td class="px-6 py-5"
									><div class="h-4 w-24 rounded bg-slate-100 dark:bg-slate-700"></div></td
								>
								<td class="px-6 py-5 text-right"
									><div
										class="ml-auto h-8 w-24 rounded-lg bg-slate-100 dark:bg-slate-700"
									></div></td
								>
							</tr>
						{/each}
					{:else if news.length === 0}
						<tr
							><td colspan="5" class="px-6 py-12 text-center text-slate-500 italic"
								>Tidak ada berita yang ditemukan.</td
							></tr
						>
					{:else}
						{#each news as item (item.id_berita)}
							{@const status = getStatusConfig(item.verify)}
							<tr class="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
								<td class="px-6 py-5">
									<div class="line-clamp-1 font-bold text-slate-800 dark:text-slate-100">
										{item.judul}
									</div>
									<div
										class="mt-0.5 text-[10px] font-bold tracking-tighter text-slate-400 uppercase"
									>
										ID: #{item.id_berita}
									</div>
								</td>
								<td class="px-6 py-5 text-slate-600 dark:text-slate-300">
									{item.skpd ? item.skpd.nm_skpd : '-'}
								</td>
								<td class="px-6 py-5">
									<span
										class="rounded-full px-2.5 py-1 text-[10px] font-black tracking-widest uppercase {status.class}"
									>
										{status.label}
									</span>
								</td>
								<td class="px-6 py-5 text-slate-500 dark:text-slate-400">
									{formatDate(item.tgl_upload)}
								</td>
								<td class="px-6 py-5 text-right">
									<div class="flex justify-end gap-2">
										<a
											href="/admin/berita/{item.id_berita}/edit"
											class="rounded-xl p-2.5 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20"
											aria-label="Edit berita: {item.judul}"
											title="Edit Berita"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
												/></svg
											>
										</a>
										<button
											onclick={() => confirmDelete(item.id_berita)}
											class="rounded-xl p-2.5 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
											aria-label="Hapus berita: {item.judul}"
											title="Hapus Berita"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/></svg
											>
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

	{#if !loading && news.length > 0}
		<nav
			class="flex flex-col items-center justify-between gap-4 py-2 md:flex-row"
			aria-label="Navigasi Halaman"
		>
			<div class="text-[10px] font-black tracking-widest text-slate-400 uppercase">
				Menampilkan <span class="text-slate-900 dark:text-slate-100"
					>{pagination.from || 0} - {pagination.to || 0}</span
				>
				dari <span class="text-slate-900 dark:text-slate-100">{pagination.total || 0}</span> Berita
			</div>
			<div class="flex items-center gap-2">
				<button
					onclick={() => changePage(pagination.prev_page_url ?? null)}
					disabled={!pagination.prev_page_url}
					class="rounded-xl border-2 border-slate-100 bg-white px-6 py-2 text-xs font-black text-slate-600 transition-all hover:border-ppid-primary hover:text-ppid-primary disabled:opacity-30 dark:border-slate-800 dark:bg-slate-800"
				>
					PREV
				</button>
				<button
					onclick={() => changePage(pagination.next_page_url ?? null)}
					disabled={!pagination.next_page_url}
					class="rounded-xl border-2 border-slate-100 bg-white px-6 py-2 text-xs font-black text-slate-600 transition-all hover:border-ppid-primary hover:text-ppid-primary disabled:opacity-30 dark:border-slate-800 dark:bg-slate-800"
				>
					NEXT
				</button>
			</div>
		</nav>
	{/if}
</div>

<ConfirmationDialog
	bind:show={showDeleteConfirm}
	title="Hapus Berita?"
	description="Data berita yang dihapus tidak dapat dipulihkan kembali. Lanjutkan?"
	confirmText="Ya, Hapus"
	theme="danger"
	onConfirm={handleDelete}
	isLoading={isDeleting}
/>
