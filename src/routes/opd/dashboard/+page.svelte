<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { page } from '$app/stores';

	let { data } = $props();
	let user = $derived(data.user);

	let stats: any = $state({
		permohonan_trend: 0,
		total_permohonan: 0,
		total_keberatan: 0,
		total_berita: 0,
		total_dokumen: 0
	});

	let notifications: any[] = $state([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			// Ambil token dari localStorage atau cookie jika perlu,
			// tapi biasanya axios/fetch interceptor sudah handle auth header jika pakai cookie/localStorage logic yang ada
			// Asumsi: Auth handled by cookie or global interceptor.
			// Jika butuh auth header manual:
			const token = localStorage.getItem('token');

			const response = await fetch(`${PUBLIC_API_URL}/admin/dashboard`, {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				}
			});

			if (response.ok) {
				const result = await response.json();
				if (result.success) {
					stats = result.data.stats;
					notifications = result.data.notifications;
				}
			}
		} catch (error) {
			console.error('Gagal memuat data dashboard:', error);
		} finally {
			loading = false;
		}
	});

	function formatNumber(num: number) {
		return new Intl.NumberFormat('id-ID').format(num);
	}
</script>

<svelte:head>
	<title>Dashboard OPD - PPID Sulsel</title>
</svelte:head>

<div>
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard Overview</h1>
		{#if user?.skpd}
			<h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{user.skpd.nm_skpd}</h3>
		{/if}
	</div>

	{#if loading}
		<div class="flex h-64 items-center justify-center">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
			></div>
		</div>
	{:else}
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			<!-- Permohonan -->
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
			>
				<div class="mb-4 flex items-start justify-between">
					<div
						class="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							>
							</path>
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
						{formatNumber(stats.total_permohonan)}
					</h2>
				</div>
			</div>

			<!-- Keberatan -->
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-red-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-red-500"
			>
				<div class="mb-4 flex items-start justify-between">
					<div class="rounded-lg bg-red-50 p-2 text-red-600 dark:bg-red-900/20 dark:text-red-400">
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
						{formatNumber(stats.total_keberatan)}
					</h2>
				</div>
			</div>

			<!-- Berita Baru -->
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-amber-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-amber-500"
			>
				<div class="mb-4 flex items-start justify-between">
					<div
						class="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							>
							</path>
						</svg>
					</div>
				</div>
				<div>
					<p class="text-sm font-medium text-slate-500 dark:text-slate-400">Berita Baru</p>
					<h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
						{formatNumber(stats.total_berita)}
					</h2>
				</div>
			</div>

			<!-- Dokumen -->
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500"
			>
				<div class="mb-4 flex items-start justify-between">
					<div
						class="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							>
							</path>
						</svg>
					</div>
				</div>
				<div>
					<p class="text-sm font-medium text-slate-500 dark:text-slate-400">Dokumen</p>
					<h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
						{#if stats.total_dokumen >= 1000}
							{(stats.total_dokumen / 1000).toFixed(1)}k
						{:else}
							{formatNumber(stats.total_dokumen)}
						{/if}
					</h2>
				</div>
			</div>
		</div>

		<!-- Notifikasi & Feedback Admin -->
		<div class="mt-8">
			<div class="mb-4 flex items-center justify-between">
				<div>
					<h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
						Notifikasi & Feedback
					</h3>
					<p class="text-xs text-slate-500">Pesan terbaru dari sistem dan administrator PPID</p>
				</div>
				<a
					href="/opd/notifications"
					class="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
				>
					Lihat Semua
				</a>
			</div>

			<div class="grid grid-cols-1 gap-4">
				{#each notifications as notif}
					<div
						class="group rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md {notif.read_at
							? 'border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-800'
							: 'border-blue-200 bg-blue-50/30 dark:border-blue-500/50 dark:bg-blue-900/10'}"
					>
						<div class="flex items-start gap-4">
							<div class="mt-1 flex-shrink-0">
								{#if notif.type === 'success'}
									<div
										class="rounded-xl bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400"
									>
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 13l4 4L19 7"
											></path>
										</svg>
									</div>
								{:else if notif.type === 'error'}
									<div
										class="rounded-xl bg-red-100 p-2 text-red-600 dark:bg-red-900/30 dark:text-red-400"
									>
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M6 18L18 6M6 6l12 12"
											></path>
										</svg>
									</div>
								{:else}
									<div
										class="rounded-xl bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
									>
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											></path>
										</svg>
									</div>
								{/if}
							</div>
							<div class="min-w-0 flex-1">
								<div class="flex items-start justify-between gap-2">
									<div>
										<h4 class="text-sm font-bold text-slate-800 dark:text-slate-100">
											{notif.title}
										</h4>
										<p class="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
											<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
												></path>
											</svg>
											<!-- Gunakan library timeago atau format manual -->
											{new Date(notif.created_at).toLocaleDateString()}
											{new Date(notif.created_at).toLocaleTimeString()}
										</p>
									</div>
								</div>
								<p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
									{notif.message}
								</p>
								{#if notif.url}
									<a
										href={notif.url}
										class="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
									>
										Lihat Detail
										<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M14 5l7 7m0 0l-7 7m7-7H3"
											></path>
										</svg>
									</a>
								{/if}
							</div>
						</div>
					</div>
				{/each}

				{#if notifications.length === 0}
					<div
						class="rounded-2xl border border-slate-100 bg-white py-12 text-center dark:border-slate-700 dark:bg-slate-800"
					>
						<div class="flex flex-col items-center gap-2 text-slate-400">
							<svg
								class="h-12 w-12 opacity-20"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
								>
								</path>
							</svg>
							<p class="text-sm italic">Belum ada notifikasi baru.</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
