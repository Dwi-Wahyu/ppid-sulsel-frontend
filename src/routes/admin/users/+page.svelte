<script lang="ts">
	import { api } from '$lib/api';
	import { onMount } from 'svelte';

	// State menggunakan Runes Svelte 5 [cite: 3, 4, 5]
	let loading = $state(true);
	let items = $state<any[]>([]);
	let search = $state('');
	let pagination = $state({
		current_page: 1,
		last_page: 1,
		total: 0,
		prev_page_url: null,
		next_page_url: null
	});

	let debounceTimer: ReturnType<typeof setTimeout>;

	/**
	 * Mengambil data dari API melalui helper api.ts
	 * Otomatis diarahkan ke Proxy untuk keamanan token [cite: 6, 7]
	 */
	async function fetchData(page: number | string = 1) {
		loading = true;
		try {
			// Mengirim search sebagai object params sesuai arsitektur api.ts kita
			const result = await api.get('/admin/users', {
				search,
				page
			});

			if (result.success) {
				// Sesuai struktur JSON: result.data.data adalah array user [cite: 9]
				items = result.data.data;
				// Mapping data paginasi dari Laravel [cite: 10, 11]
				pagination = {
					current_page: result.data.current_page,
					last_page: result.data.last_page,
					total: result.data.total,
					prev_page_url: result.data.prev_page_url,
					next_page_url: result.data.next_page_url
				};
			}
		} catch (error) {
			console.error('Gagal mengambil data user:', error);
		} finally {
			loading = false;
		}
	}

	// Debounce Search: Otomatis fetch saat 'search' berubah [cite: 14]
	$effect(() => {
		const query = search;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			fetchData(1);
		}, 500);
	});

	/**
	 * Helper untuk mengambil nomor halaman dari URL Laravel
	 */
	function handlePagination(url: string | null) {
		if (!url) return;
		const urlObj = new URL(url);
		const page = urlObj.searchParams.get('page');
		if (page) fetchData(page);
	}

	function formatDate(dateStr: string | null) {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	onMount(() => fetchData());
</script>

<svelte:head>
	<title>Manajemen User - Admin PPID</title>
</svelte:head>

<div class="space-y-6 p-6">
	<div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Manajemen User</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">
				Kelola akun pengguna dan akses SKPD mereka.
			</p>
		</div>

		<div class="relative w-full md:w-64">
			<label for="user-search" class="sr-only">Cari berdasarkan nama atau username</label>
			<input
				id="user-search"
				type="text"
				bind:value={search}
				placeholder="Cari user..."
				class="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm text-slate-900 transition-all focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
			/>
			<div class="absolute top-2.5 left-3 text-slate-400" aria-hidden="true">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
		</div>
	</div>

	<div
		class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<div class="overflow-x-auto">
			<table class="w-full border-collapse text-left text-sm" aria-busy={loading}>
				<thead
					class="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-300"
				>
					<tr>
						<th scope="col" class="px-6 py-4">Nama & Username</th>
						<th scope="col" class="px-6 py-4">SKPD</th>
						<th scope="col" class="px-6 py-4">Terakhir Login</th>
						<th scope="col" class="px-6 py-4 text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 dark:divide-slate-700">
					{#if loading}
						{#each Array(5) as _}
							<tr class="animate-pulse">
								<td class="px-6 py-4"
									><div class="h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-700"></div></td
								>
								<td class="px-6 py-4"
									><div class="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-700"></div></td
								>
								<td class="px-6 py-4"
									><div class="h-4 w-20 rounded bg-slate-100 dark:bg-slate-700"></div></td
								>
								<td class="px-6 py-4"
									><div class="ml-auto h-4 w-10 rounded bg-slate-100 dark:bg-slate-700"></div></td
								>
							</tr>
						{/each}
					{:else if items.length === 0}
						<tr>
							<td colspan="4" class="px-6 py-12 text-center text-slate-500"
								>Tidak ada data user ditemukan.</td
							>
						</tr>
					{:else}
						{#each items as item (item.id)}
							<tr class="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
								<td class="px-6 py-4">
									<div class="font-medium text-slate-900 dark:text-white">{item.name}</div>
									<div class="text-xs text-slate-400">{item.username}</div>
								</td>
								<td class="px-6 py-4 text-slate-700 dark:text-slate-300">
									{item.skpd?.nm_skpd || '-'}
								</td>
								<td class="px-6 py-4">
									<div class="flex flex-col">
										<span class="text-slate-700 dark:text-slate-300"
											>{formatDate(item.last_login?.createdAt)}</span
										>
										{#if item.last_login?.ip}
											<span class="text-[10px] text-slate-400">IP: {item.last_login.ip}</span>
										{/if}
									</div>
								</td>
								<td class="px-6 py-4 text-right">
									<a
										href="/admin/users/{item.id}"
										class="inline-flex rounded-lg p-2 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20"
										aria-label="Lihat detail {item.name}"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
									</a>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	{#if !loading && items.length > 0}
		<nav
			class="flex flex-col items-center justify-between gap-4 py-2 md:flex-row"
			aria-label="Navigasi halaman"
		>
			<div class="text-sm text-slate-500 dark:text-slate-400">
				Menampilkan <span class="font-medium text-slate-900 dark:text-white">{items.length}</span>
				dari <span class="font-bold">{pagination.total}</span> user
			</div>
			<div class="flex items-center gap-2">
				<button
					onclick={() => handlePagination(pagination.prev_page_url)}
					disabled={!pagination.prev_page_url}
					class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
				>
					Sebelumnya
				</button>
				<div class="px-4 text-sm font-medium dark:text-slate-300">
					Halaman {pagination.current_page} dari {pagination.last_page}
				</div>
				<button
					onclick={() => handlePagination(pagination.next_page_url)}
					disabled={!pagination.next_page_url}
					class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
				>
					Berikutnya
				</button>
			</div>
		</nav>
	{/if}
</div>
