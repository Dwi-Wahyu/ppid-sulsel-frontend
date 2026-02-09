<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api';

	// State menggunakan Runes Svelte 5
	let loading = $state(true);
	let dashboardData = $state<any>(null);

	async function fetchDashboard() {
		loading = true;
		try {
			const res = await api.get('/admin/dashboard');
			if (res.success) {
				dashboardData = res.data;
			}
		} catch (error) {
			console.error('Gagal memuat dashboard:', error);
		} finally {
			loading = false;
		}
	}

	// Helper untuk format angka
	function formatNum(num: number) {
		return new Intl.NumberFormat('id-ID').format(num);
	}

	// Helper untuk format k (ribuan)
	function formatK(num: number) {
		return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
	}

	onMount(() => {
		fetchDashboard();
	});
</script>

<svelte:head>
	<title>Dashboard Admin - PPID Sulsel</title>
</svelte:head>

<div class="space-y-6 p-6 pb-12">
	<header class="flex flex-col gap-1">
		<h1 class="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h1>
		<p class="text-sm text-slate-500 dark:text-slate-400">
			Pantau statistik permohonan informasi dan aktivitas sistem secara real-time.
		</p>
	</header>

	{#if loading}
		<div class="grid animate-pulse grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each Array(6) as _}
				<div class="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800"></div>
			{/each}
		</div>
	{:else if dashboardData}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			<div
				class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="mb-4 flex items-start justify-between">
					<div
						class="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							></path></svg
						>
					</div>
					{#if dashboardData.stats.permohonan_trend !== 0}
						<span
							class="px-2 py-1 text-xs font-medium {dashboardData.stats.permohonan_trend > 0
								? 'bg-green-100 text-green-700'
								: 'bg-red-100 text-red-700'} rounded-full"
						>
							{dashboardData.stats.permohonan_trend > 0 ? '+' : ''}{dashboardData.stats
								.permohonan_trend}%
						</span>
					{:else}
						<span
							class="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 dark:bg-slate-700"
							>Tetap</span
						>
					{/if}
				</div>
				<p class="text-sm font-medium text-slate-500">Permohonan</p>
				<h2 class="text-2xl font-bold text-slate-800 dark:text-white">
					{formatNum(dashboardData.stats.total_permohonan)}
				</h2>
			</div>

			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-red-400 dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="mb-4 flex items-start justify-between">
					<div class="rounded-lg bg-red-50 p-2 text-red-600 dark:bg-red-900/30 dark:text-red-400">
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path></svg
						>
					</div>
				</div>
				<p class="text-sm font-medium text-slate-500">Keberatan</p>
				<h2 class="text-2xl font-bold text-slate-800 dark:text-white">
					{formatNum(dashboardData.stats.total_keberatan)}
				</h2>
			</div>

			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="mb-4 flex items-start justify-between">
					<div
						class="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							></path></svg
						>
					</div>
				</div>
				<p class="text-sm font-medium text-slate-500">Total SKPD</p>
				<h2 class="text-2xl font-bold text-slate-800 dark:text-white">
					{dashboardData.stats.total_skpd}
				</h2>
			</div>
		</div>

		<div class="grid grid-cols-12 gap-6">
			<section
				class="col-span-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8 dark:border-slate-700 dark:bg-slate-800"
			>
				<div
					class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
				>
					<div>
						<h3 class="text-lg font-bold text-slate-800 dark:text-white">Statistik Layanan</h3>
						<p class="text-xs text-slate-500">Tren Permohonan vs Keberatan (12 Bulan Terakhir)</p>
					</div>
					<div class="flex gap-4 text-xs font-semibold">
						<div class="flex items-center gap-2">
							<span class="h-3 w-3 rounded-full bg-blue-600"></span> Permohonan
						</div>
						<div class="flex items-center gap-2">
							<span class="h-3 w-3 rounded-full bg-red-500"></span> Keberatan
						</div>
					</div>
				</div>

				<div
					class="relative flex h-64 items-end justify-between gap-2 overflow-hidden px-2 md:gap-4"
				>
					<div
						class="pointer-events-none absolute inset-0 flex flex-col justify-between opacity-50"
					>
						{#each Array(5) as _}
							<div class="h-full w-full border-b border-slate-100 dark:border-slate-700"></div>
						{/each}
					</div>

					{#each dashboardData.monthly_trends.months as month}
						<div class="group relative z-10 flex h-full w-full flex-col items-center justify-end">
							<div class="flex h-full w-full items-end justify-center gap-1 pb-8">
								<div
									class="w-3 rounded-t-sm bg-blue-600 transition-all duration-500 group-hover:brightness-125"
									style="height: {dashboardData.monthly_trends.permohonan_percentages[month]}%"
									title="Permohonan {month}: {dashboardData.monthly_trends.permohonan[month]}"
								></div>
								<div
									class="w-3 rounded-t-sm bg-red-500 transition-all duration-500 group-hover:brightness-110"
									style="height: {dashboardData.monthly_trends.keberatan_percentages[month]}%"
									title="Keberatan {month}: {dashboardData.monthly_trends.keberatan[month]}"
								></div>
							</div>
							<span class="absolute bottom-0 text-[10px] font-medium text-slate-400">{month}</span>
						</div>
					{/each}
				</div>
			</section>

			<section
				class="col-span-12 flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4 dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="mb-6 flex items-center justify-between">
					<h3 class="text-lg font-bold text-slate-800 dark:text-white">Login Terbaru</h3>
					<a href="/admin/log-login" class="text-xs font-semibold text-blue-600 hover:underline"
						>Lihat Semua</a
					>
				</div>

				<div class="space-y-4 overflow-y-auto">
					{#each dashboardData.recent_logins as log}
						<div
							class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:border-blue-200 dark:border-slate-700 dark:bg-slate-900/50"
						>
							<img
								src="https://ui-avatars.com/api/?name={encodeURIComponent(
									log.user.name
								)}&background=1A305E&color=fff"
								alt="avatar"
								class="h-10 w-10 rounded-full"
							/>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
									{log.user.name}
								</p>
								<div class="mt-1 flex items-center gap-2">
									<span
										class="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-slate-700"
										>{log.ip}</span
									>
									<span class="text-[10px] text-slate-400"
										>{new Date(log.createdAt).toLocaleTimeString('id-ID', {
											hour: '2-digit',
											minute: '2-digit'
										})}</span
									>
								</div>
							</div>
						</div>
					{:else}
						<p class="text-center text-slate-400 italic text-sm py-10">Belum ada data.</p>
					{/each}
				</div>
			</section>

			<section
				class="col-span-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="mb-6 flex items-center justify-between">
					<div>
						<h3 class="text-lg font-bold text-slate-800 dark:text-white">
							Menunggu Verifikasi Dokumen
						</h3>
						<p class="text-xs text-slate-500">Dokumen publik yang perlu divalidasi admin</p>
					</div>
				</div>

				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm" aria-label="Tabel verifikasi dokumen">
						<thead>
							<tr class="border-b border-slate-100 dark:border-slate-700">
								<th class="pb-4 font-bold tracking-wider text-slate-400 uppercase">Judul Dokumen</th
								>
								<th
									class="hidden pb-4 font-bold tracking-wider text-slate-400 uppercase md:table-cell"
									>Kategori</th
								>
								<th class="pb-4 text-right font-bold tracking-wider text-slate-400 uppercase"
									>Aksi</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-50 dark:divide-slate-700">
							{#each dashboardData.pending_items.dokumen as doc}
								<tr class="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40">
									<td class="py-4">
										<p class="line-clamp-1 font-bold text-slate-800 dark:text-slate-200">
											{doc.judul}
										</p>
										<p class="text-[10px] text-slate-500">
											{new Date(doc.tgl_upload).toLocaleDateString('id-ID')}
										</p>
									</td>
									<td class="hidden py-4 md:table-cell">
										<span class="rounded-md bg-slate-100 px-2 py-1 text-[10px] dark:bg-slate-700"
											>{doc.kategori?.nm_kat_info || '-'}</span
										>
									</td>
									<td class="py-4 text-right">
										<a
											href="/admin/dokumen-publik/{doc.id_informasi}"
											class="text-xs font-semibold text-blue-600 hover:text-blue-800">Detail</a
										>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	{/if}
</div>
