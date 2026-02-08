<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	interface Stats {
		total_permohonan: number;
		total_keberatan: number;
		total_berita: number;
		total_skpd: number;
		total_dokumen: number;
		total_visitor: number;
		permohonan_trend: number;
	}

	interface MonthlyTrends {
		months: string[];
		permohonan: Record<string, number>;
		keberatan: Record<string, number>;
		permohonan_percentages: Record<string, number>;
		keberatan_percentages: Record<string, number>;
	}

	interface RecentLogin {
		ip_address: string;
		created_at: string;
		user: {
			name: string;
		};
	}

	interface PendingDokumen {
		id_informasi: number;
		judul: string;
		tgl_upload: string;
		kategori: { nm_kat_info: string };
		skpd: { nm_skpd: string };
	}

	interface PendingBerita {
		id_berita: number;
		judul: string;
		created_at: string;
		skpd: { nm_skpd: string };
	}

	let stats = $state<Stats>({
		total_permohonan: 0,
		total_keberatan: 0,
		total_berita: 0,
		total_skpd: 0,
		total_dokumen: 0,
		total_visitor: 0,
		permohonan_trend: 0
	});

	let monthlyTrends = $state<MonthlyTrends>({
		months: [],
		permohonan: {},
		keberatan: {},
		permohonan_percentages: {},
		keberatan_percentages: {}
	});

	let recentLogins = $state<RecentLogin[]>([]);
	let pendingDokumen = $state<PendingDokumen[]>([]);
	let pendingBerita = $state<PendingBerita[]>([]);
	let userName = $state('');
	let isLoading = $state(true);

	onMount(async () => {
		await fetchDashboardData();
	});

	async function fetchDashboardData() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/dashboard`, {
				credentials: 'include'
			});
			const data = await response.json();

			if (data.success) {
				stats = data.stats;
				monthlyTrends = data.monthlyTrends;
				recentLogins = data.recentLogins || [];
				pendingDokumen = data.pendingDokumen || [];
				pendingBerita = data.pendingBerita || [];
				userName = data.userName || 'Admin';
			}
		} catch (error) {
			console.error('Failed to fetch dashboard data:', error);
		} finally {
			isLoading = false;
		}
	}

	function formatNumber(num: number): string {
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'k';
		}
		return num.toLocaleString();
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
	}

	function formatRelativeTime(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffDays > 0) return `${diffDays} hari lalu`;
		if (diffHours > 0) return `${diffHours} jam lalu`;
		if (diffMins > 0) return `${diffMins} menit lalu`;
		return 'Baru saja';
	}
</script>

<svelte:head>
	<title>Dashboard Admin - PPID Sulsel</title>
</svelte:head>

<div class="space-y-6 pb-10">
	<!-- Header -->
	<div class="mb-4 flex flex-col">
		<h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard Overview</h1>
		<p class="text-sm text-slate-500 dark:text-slate-400">Selamat datang kembali, {userName}.</p>
	</div>

	{#if isLoading}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each Array(6) as _}
				<div
					class="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="mb-4 h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-700"></div>
					<div class="h-4 w-20 rounded bg-slate-100 dark:bg-slate-700"></div>
					<div class="mt-2 h-8 w-24 rounded bg-slate-100 dark:bg-slate-700"></div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Stats Cards -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			<!-- Permohonan -->
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
			>
				<div class="mb-4 flex items-start justify-between">
					<div
						class="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
					>
						<svg
							class="h-6 w-6"
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
					{#if stats.permohonan_trend > 0}
						<span
							class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
							>+{stats.permohonan_trend}%</span
						>
					{:else if stats.permohonan_trend < 0}
						<span
							class="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"
							>{stats.permohonan_trend}%</span
						>
					{:else}
						<span
							class="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300"
							>Tetap</span
						>
					{/if}
				</div>
				<div>
					<p class="text-sm font-medium text-slate-500 dark:text-slate-400">Permohonan</p>
					<h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
						{stats.total_permohonan.toLocaleString()}
					</h2>
				</div>
			</div>

			<!-- Keberatan -->
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-red-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-red-500"
			>
				<div class="mb-4 flex items-start justify-between">
					<div class="rounded-lg bg-red-50 p-2 text-red-600 dark:bg-red-900/30 dark:text-red-400">
						<svg
							class="h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
					</div>
					<span
						class="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300"
						>Tetap</span
					>
				</div>
				<div>
					<p class="text-sm font-medium text-slate-500 dark:text-slate-400">Keberatan</p>
					<h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
						{stats.total_keberatan.toLocaleString()}
					</h2>
				</div>
			</div>

			<!-- Berita -->
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-amber-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-amber-500"
			>
				<div class="mb-4 flex items-start justify-between">
					<div
						class="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
					>
						<svg
							class="h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							></path>
						</svg>
					</div>
				</div>
				<div>
					<p class="text-sm font-medium text-slate-500 dark:text-slate-400">Berita Baru</p>
					<h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
						{stats.total_berita.toLocaleString()}
					</h2>
				</div>
			</div>

			<!-- SKPD -->
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-500"
			>
				<div class="mb-4 flex items-start justify-between">
					<div
						class="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
					>
						<svg
							class="h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							></path>
						</svg>
					</div>
				</div>
				<div>
					<p class="text-sm font-medium text-slate-500 dark:text-slate-400">SKPD</p>
					<h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
						{stats.total_skpd.toLocaleString()}
					</h2>
				</div>
			</div>

			<!-- Dokumen -->
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500"
			>
				<div class="mb-4 flex items-start justify-between">
					<div
						class="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
					>
						<svg
							class="h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							></path>
						</svg>
					</div>
				</div>
				<div>
					<p class="text-sm font-medium text-slate-500 dark:text-slate-400">Dokumen</p>
					<h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
						{formatNumber(stats.total_dokumen)}
					</h2>
				</div>
			</div>

			<!-- Visitor -->
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-purple-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-purple-500"
			>
				<div class="mb-4 flex items-start justify-between">
					<div
						class="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
					>
						<svg
							class="h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
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
					</div>
				</div>
				<div>
					<p class="text-sm font-medium text-slate-500 dark:text-slate-400">Visitor</p>
					<h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
						{formatNumber(stats.total_visitor)}
					</h2>
				</div>
			</div>
		</div>

		<!-- Charts & Recent Logins -->
		<div class="grid grid-cols-12 gap-6">
			<!-- Monthly Trends Chart -->
			<div
				class="col-span-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8 dark:border-slate-700 dark:bg-slate-800"
			>
				<div
					class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
				>
					<div>
						<h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Statistik Layanan</h3>
						<p class="text-xs text-slate-500 dark:text-slate-400">
							Perbandingan permohonan & keberatan 2024
						</p>
					</div>
					<div class="flex items-center space-x-4 rounded-lg bg-slate-50 p-2 dark:bg-slate-700/50">
						<div class="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-300">
							<span class="mr-2 h-3 w-3 rounded-full bg-ppid-primary"></span> Permohonan
						</div>
						<div class="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-300">
							<span class="mr-2 h-3 w-3 rounded-full bg-ppid-accent"></span> Keberatan
						</div>
					</div>
				</div>

				<div class="relative flex h-72 items-end justify-between gap-4 px-2">
					<div class="pointer-events-none absolute inset-0 flex flex-col justify-between">
						<div class="h-full w-full border-b border-slate-100 dark:border-slate-700"></div>
						<div class="h-full w-full border-b border-slate-100 dark:border-slate-700"></div>
						<div class="h-full w-full border-b border-slate-100 dark:border-slate-700"></div>
						<div class="h-full w-full border-b border-slate-100 dark:border-slate-700"></div>
					</div>
		<!-- Pending Verifications saya jadikan carousel di message berikutnya karena terlalu panjang -->
		<!-- Pending Dokumen Verifications -->
		<div
			class="col-span-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Menunggu Verifikasi</h3>
					<p class="text-xs text-slate-500 dark:text-slate-400">
						Dokumen publik terbaru yang memerlukan tinjauan admin
					</p>
				</div>
				<a
					href="/admin/dokumen-publik?verify=n"
					class="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:text-blue-300"
				>
					Tampilkan Semua
				</a>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left">
					<thead>
						<tr class="border-b border-slate-100 dark:border-slate-700">
							<th class="pb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
								Informasi Dokumen
							</th>
							<th class="hidden pb-4 text-xs font-bold uppercase tracking-wider text-slate-400 md:table-cell">
								Kategori
							</th>
							<th class="hidden pb-4 text-xs font-bold uppercase tracking-wider text-slate-400 lg:table-cell">
								SKPD Penginput
							</th>
							<th class="pb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Aksi</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100 dark:divide-slate-700">
						{#if pendingDokumen.length > 0}
							{#each pendingDokumen as dokumen}
								<tr class="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40">
									<td class="py-4 pr-4">
										<div class="flex items-start gap-3">
											<div
												class="mt-1 rounded-lg bg-amber-50 p-2 text-amber-600 transition-colors group-hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
											>
												<svg
													class="h-5 w-5"
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
											<div class="min-w-0">
												<p class="line-clamp-1 text-sm font-bold text-slate-800 dark:text-slate-200">
													{dokumen.judul}
												</p>
												<p class="mt-0.5 flex items-center gap-1 text-[10px] text-slate-500">
													<svg
														class="h-3 w-3"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														aria-hidden="true"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
														></path>
													</svg>
													{dokumen.tgl_upload ? formatDate(dokumen.tgl_upload) : '-'}
												</p>
											</div>
										</div>
									</td>
									<td class="hidden py-4 md:table-cell">
										<span
											class="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300"
										>
											{dokumen.kategori?.nm_kat_info || '-'}
										</span>
									</td>
									<td class="hidden py-4 lg:table-cell">
										<div class="flex items-center gap-2">
											<span class="max-w-[150px] truncate text-xs font-medium text-slate-600 dark:text-slate-400">
												{dokumen.skpd?.nm_skpd || '-'}
											</span>
										</div>
									</td>
									<td class="py-4">
										<div class="flex items-center gap-2">
											<a
												href="/admin/dokumen-publik/{dokumen.id_informasi}"
												class="text-slate-400 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
												title="Lihat Detail"
												aria-label="Lihat detail dokumen {dokumen.judul}"
											>
												<svg
													class="h-5 w-5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													aria-hidden="true"
												>
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
											</a>
										</div>
									</td>
								</tr>
							{/each}
						{:else}
							<tr>
								<td colspan="4" class="py-12 text-center">
									<div class="flex flex-col items-center gap-2 text-slate-400">
										<svg
											class="h-10 w-10 opacity-20"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											></path>
										</svg>
										<p class="text-sm italic">Hooray! Tidak ada dokumen publik menunggu verifikasi.</p>
									</div>
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Pending Berita Verifications -->
		<div
			class="col-span-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Menunggu Verifikasi Berita</h3>
					<p class="text-xs text-slate-500 dark:text-slate-400">
						Berita terbaru yang memerlukan tinjauan admin
					</p>
				</div>
				<a
					href="/admin/berita?verify=n"
					class="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:text-blue-300"
				>
					Tampilkan Semua
				</a>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left">
					<thead>
						<tr class="border-b border-slate-100 dark:border-slate-700">
							<th class="pb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Judul Berita</th>
							<th class="hidden pb-4 text-xs font-bold uppercase tracking-wider text-slate-400 lg:table-cell">
								SKPD Penginput
							</th>
							<th class="pb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Aksi</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100 dark:divide-slate-700">
						{#if pendingBerita.length > 0}
							{#each pendingBerita as berita}
								<tr class="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40">
									<td class="py-4 pr-4">
										<div class="flex items-start gap-3">
											<div
												class="mt-1 rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
											>
												<svg
													class="h-5 w-5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													aria-hidden="true"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
													></path>
												</svg>
											</div>
											<div class="min-w-0">
												<p class="line-clamp-1 text-sm font-bold text-slate-800 dark:text-slate-200">
													{berita.judul}
												</p>
												<p class="mt-0.5 flex items-center gap-1 text-[10px] text-slate-500">
													<svg
														class="h-3 w-3"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														aria-hidden="true"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
														></path>
													</svg>
													{berita.created_at ? formatDate(berita.created_at) : '-'}
												</p>
											</div>
										</div>
									</td>
									<td class="hidden py-4 lg:table-cell">
										<span class="max-w-[150px] truncate text-xs font-medium text-slate-600 dark:text-slate-400">
											{berita.skpd?.nm_skpd || '-'}
										</span>
									</td>
									<td class="py-4">
										<div class="flex items-center gap-2">
											<a
												href="/admin/berita/{berita.id_berita}/edit"
												class="text-slate-400 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
												title="Verifikasi"
												aria-label="Verifikasi berita {berita.judul}"
											>
												<svg
													class="h-5 w-5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													aria-hidden="true"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
													></path>
												</svg>
											</a>
										</div>
									</td>
								</tr>
							{/each}
						{:else}
							<tr>
								<td colspan="3" class="py-12 text-center">
									<div class="flex flex-col items-center gap-2 text-slate-400">
										<p class="text-sm italic">Tidak ada berita menunggu verifikasi.</p>
									</div>
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

					{#each monthlyTrends.months as month}
						{@const permohonanHeight = monthlyTrends.permohonan_percentages[month] || 0}
						{@const keberatanHeight = monthlyTrends.keberatan_percentages[month] || 0}
						{@const permohonanCount = monthlyTrends.permohonan[month] || 0}
						{@const keberatanCount = monthlyTrends.keberatan[month] || 0}
						<div class="group relative z-10 flex h-full w-full flex-col items-center justify-end">
							<div class="flex h-full w-full items-end justify-center gap-1.5 pb-8">
								<div
									class="w-3 rounded-t-sm bg-ppid-primary transition-all duration-300 group-hover:brightness-125"
									style="height: {permohonanHeight}%"
									title="Permohonan: {permohonanCount}"
									role="img"
									aria-label="Permohonan bulan {month}: {permohonanCount}"
								></div>
								<div
									class="w-3 rounded-t-sm bg-ppid-accent transition-all duration-300 group-hover:brightness-110"
									style="height: {keberatanHeight}%"
									title="Keberatan: {keberatanCount}"
									role="img"
									aria-label="Keberatan bulan {month}: {keberatanCount}"
								></div>
							</div>
							<span
								class="absolute bottom-0 text-[11px] font-medium text-slate-500 dark:text-slate-400"
								>{month}</span
							>
						</div>
					{/each}
				</div>
			</div>

			<!-- Recent Logins -->
			<div
				class="col-span-12 flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4 dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="mb-6 flex items-center justify-between">
					<h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Login Terbaru</h3>
					<a
						href="/admin/log-login"
						class="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
						>Lihat Semua</a
					>
				</div>

				<div class="flex-1 space-y-4">
					{#if recentLogins.length > 0}
						{#each recentLogins as log}
							<div
								class="transition-hover flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 hover:border-blue-200 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-blue-500/50"
							>
								<div class="flex-shrink-0">
									<img
										src={`https://ui-avatars.com/api/?name=${encodeURIComponent(log.user?.name || 'U')}&background=1A305E&color=fff`}
										alt="Avatar {log.user?.name || 'User'}"
										class="h-10 w-10 rounded-full shadow-sm"
									/>
								</div>
								<div class="min-w-0 flex-1">
									<p class="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
										{log.user?.name || 'Unknown User'}
									</p>
									<div class="mt-0.5 flex items-center gap-2">
										<span
											class="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-slate-700 dark:text-slate-400"
										>
											{log.ip_address}
										</span>
										<span class="text-[10px] text-slate-400 dark:text-slate-500">
											{formatRelativeTime(log.created_at)}
										</span>
									</div>
								</div>
							</div>
						{/each}
					{:else}
						<div class="py-10 text-center">
							<p class="text-sm text-slate-400 italic">Belum ada riwayat login.</p>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Pending Verifications saya jadikan carousel di message berikutnya karena terlalu panjang -->
	{/if}
</div>
