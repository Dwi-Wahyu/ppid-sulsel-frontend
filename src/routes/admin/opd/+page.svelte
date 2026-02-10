<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	interface Stats {
		total_permohonan: number;
		total_keberatan: number;
		total_berita: number;
		total_dokumen: number;
		permohonan_trend: number;
	}

	interface Notification {
		id_notification: number;
		title: string;
		message: string;
		type: 'success' | 'error' | 'info';
		url: string | null;
		read_at: string | null;
		created_at: string;
	}

	let stats = $state<Stats>({
		total_permohonan: 0,
		total_keberatan: 0,
		total_berita: 0,
		total_dokumen: 0,
		permohonan_trend: 0
	});

	let notifications = $state<Notification[]>([]);
	let skpdName = $state('');
	let isLoading = $state(true);

	onMount(async () => {
		await fetchOpdDashboard();
	});

	async function fetchOpdDashboard() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/opd-dashboard`, {
				credentials: 'include'
			});
			const data = await response.json();

			if (data.success) {
				stats = data.stats;
				notifications = data.notifications || [];
				skpdName = data.skpdName || '';
			}
		} catch (error) {
			console.error('Failed to fetch OPD dashboard data:', error);
		} finally {
			isLoading = false;
		}
	}

	async function markAsRead(notificationId: number, url: string | null = null) {
		try {
			await fetch(`${PUBLIC_API_URL}/admin/notifications/${notificationId}/read`, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' }
			});

			if (url) {
				window.location.href = url;
			} else {
				await fetchOpdDashboard();
			}
		} catch (error) {
			console.error('Failed to mark notification as read:', error);
		}
	}

	async function deleteNotification(notificationId: number) {
		if (!confirm('Apakah Anda yakin ingin menghapus notifikasi ini?')) return;

		try {
			await fetch(`${PUBLIC_API_URL}/admin/notifications/${notificationId}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			await fetchOpdDashboard();
		} catch (error) {
			console.error('Failed to delete notification:', error);
		}
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
	<div>
		<h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard Overview</h1>
		<h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{skpdName}</h3>
	</div>

	{#if isLoading}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each Array(4) as _}
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
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			<!-- Permohonan -->
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
			>
				<div class="mb-4 flex items-start justify-between">
					<div
						class="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
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
					<div class="rounded-lg bg-red-50 p-2 text-red-600 dark:bg-red-900/20 dark:text-red-400">
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
						class="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
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

			<!-- Dokumen -->
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500"
			>
				<div class="mb-4 flex items-start justify-between">
					<div
						class="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
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
						{stats.total_dokumen >= 1000
							? (stats.total_dokumen / 1000).toFixed(1) + 'k'
							: stats.total_dokumen.toLocaleString()}
					</h2>
				</div>
			</div>
		</div>

		<!-- Notifications & Feedback -->
		<div class="mt-8">
			<div class="mb-4 flex items-center justify-between">
				<div>
					<h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
						Notifikasi & Feedback
					</h3>
					<p class="text-xs text-slate-500">Pesan terbaru dari sistem dan administrator PPID</p>
				</div>
				<a
					href="/admin/notifications"
					class="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
				>
					Lihat Semua
				</a>
			</div>

			<div class="grid grid-cols-1 gap-4">
				{#if notifications.length > 0}
					{#each notifications as notif}
						<div
							class="group rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md {notif.read_at
								? 'border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-800'
								: 'border-blue-200 bg-blue-50/30 dark:border-blue-500/50 dark:bg-blue-900/10'}"
						>
							<div class="flex items-start gap-4">
								<div class="mt-1 shrink-0">
									{#if notif.type == 'success'}
										<div
											class="rounded-xl bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400"
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
													d="M5 13l4 4L19 7"
												></path>
											</svg>
										</div>
									{:else if notif.type == 'error'}
										<div
											class="rounded-xl bg-red-100 p-2 text-red-600 dark:bg-red-900/30 dark:text-red-400"
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
													d="M6 18L18 6M6 6l12 12"
												></path>
											</svg>
										</div>
									{:else}
										<div
											class="rounded-xl bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
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
												{formatRelativeTime(notif.created_at)}
											</p>
										</div>
										<div
											class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
										>
											{#if !notif.read_at}
												<button
													type="button"
													onclick={() => markAsRead(notif.id_notification)}
													class="p-1.5 text-slate-400 transition-colors hover:text-blue-600"
													title="Tandai Dibaca"
													aria-label="Tandai notifikasi {notif.title} telah dibaca"
												>
													<svg
														class="h-4 w-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														aria-hidden="true"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M5 13l4 4L19 7"
														></path>
													</svg>
												</button>
											{/if}
											<button
												type="button"
												onclick={() => deleteNotification(notif.id_notification)}
												class="p-1.5 text-slate-400 transition-colors hover:text-red-600"
												title="Hapus"
												aria-label="Hapus notifikasi {notif.title}"
											>
												<svg
													class="h-4 w-4"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													aria-hidden="true"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													></path>
												</svg>
											</button>
										</div>
									</div>
									<p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
										{notif.message}
									</p>
									{#if notif.url}
										<button
											type="button"
											onclick={() => markAsRead(notif.id_notification, notif.url)}
											class="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
										>
											Lihat Detail
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
													d="M14 5l7 7m0 0l-7 7m7-7H3"
												></path>
											</svg>
										</button>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				{:else}
					<div
						class="rounded-2xl border border-slate-100 bg-white py-12 text-center dark:border-slate-700 dark:bg-slate-800"
					>
						<div class="flex flex-col items-center gap-2 text-slate-400">
							<svg
								class="h-12 w-12 opacity-20"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
								></path>
							</svg>
							<p class="text-sm italic">Belum ada notifikasi baru.</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
