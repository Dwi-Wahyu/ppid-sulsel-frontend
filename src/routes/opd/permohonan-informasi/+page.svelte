<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Handle search
	function handleSearch(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const search = formData.get('search') as string;

		const url = new URL($page.url);
		if (search) {
			url.searchParams.set('search', search);
		} else {
			url.searchParams.delete('search');
		}
		url.searchParams.delete('page'); // Reset to page 1 on search
		goto(url.toString());
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
			// The API returns full URL, we need to extract query params and apply to current route
			// OR just use the page number if available in the link object,
			// but standard Laravel pagination links are full URLs.
			// SvelteKit way: goto keeping same path but changing search params.
			const targetUrl = new URL(url);
			const pageParam = targetUrl.searchParams.get('page');
			const currentUrl = new URL($page.url);

			if (pageParam) {
				currentUrl.searchParams.set('page', pageParam);
				goto(currentUrl.toString());
			}
		}
	}
</script>

<svelte:head>
	<title>Permohonan Informasi - OPD PPID</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<div>
		<h1 class="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-slate-900 dark:text-white">
			Permohonan Informasi
		</h1>
		<p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
			Daftar permohonan informasi yang didisposisikan.
		</p>
	</div>
</div>

<div class="space-y-4">
	<div
		class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<!-- Header & Search -->
		<div
			class="flex flex-col justify-between gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center dark:border-slate-700"
		>
			<h3 class="text-lg font-bold text-ppid-primary dark:text-white">Daftar Permohonan Masuk</h3>

			<form onsubmit={handleSearch} class="flex flex-col gap-2 sm:flex-row">
				<div class="relative max-w-md">
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
						class="w-full rounded-lg border border-slate-200 py-2 pr-4 pl-10 text-sm focus:border-ppid-accent focus:ring-1 focus:ring-ppid-accent focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500"
					/>
				</div>
				<button
					type="submit"
					class="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
				>
					Cari
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
						<th scope="col" class="px-6 py-4">Nama Pemohon</th>
						<th scope="col" class="px-6 py-4">Informasi yang Diminta</th>
						<th scope="col" class="px-6 py-4">Tanggal Diajukan</th>
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
									<div class="flex flex-col">
										<span class="font-bold text-slate-900 dark:text-white">{item.nama}</span>
										<span class="text-xs text-slate-500">{item.email}</span>
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="max-w-xs truncate" title={item.rincian_informasi}>
										{item.rincian_informasi || '-'}
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
									<a
										href={`/opd/permohonan-informasi/${item.id_permohonan}`}
										class="inline-flex items-center gap-1 rounded-lg bg-ppid-primary/10 px-3 py-1.5 text-xs font-semibold text-ppid-primary transition-all hover:bg-ppid-primary hover:text-white dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white"
									>
										Lihat Detail
										<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</a>
								</td>
							</tr>
						{/each}
					{:else}
						<tr>
							<td colspan="5" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
								<div class="flex flex-col items-center justify-center gap-3">
									<div class="rounded-full bg-slate-100 p-4 dark:bg-slate-700">
										<svg
											class="h-8 w-8 text-slate-400"
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
									</div>
									<p class="font-medium">Belum ada disposisi masuk.</p>
									<p class="text-sm">
										Permohonan yang didisposisikan ke instansi Anda akan muncul di sini.
									</p>
								</div>
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if data.permohonan.data.length > 0}
			<div class="border-t border-slate-200 p-6 dark:border-slate-700">
				<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
					<div class="text-sm text-slate-600 dark:text-slate-400">
						Menampilkan <span class="font-semibold">{data.permohonan.from}</span> sampai
						<span class="font-semibold">{data.permohonan.to}</span>
						dari <span class="font-semibold">{data.permohonan.total}</span> data
					</div>
					<nav aria-label="Pagination" class="flex flex-wrap justify-center gap-1">
						{#each data.permohonan.links as link}
							{#if link.url}
								<button
									type="button"
									onclick={() => navigateToPage(link.url)}
									class="rounded-md px-3 py-1 {link.active
										? 'bg-ppid-primary text-white shadow-sm'
										: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'} text-sm font-medium transition-colors"
									disabled={link.active}
								>
									{@html link.label}
								</button>
							{:else}
								<span
									class="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800"
								>
									{@html link.label}
								</span>
							{/if}
						{/each}
					</nav>
				</div>
			</div>
		{/if}
	</div>
</div>
