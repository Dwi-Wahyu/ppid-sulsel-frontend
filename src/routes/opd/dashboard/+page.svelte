<script lang="ts">
	// Mengambil data hasil load dari +page.server.ts
	let { data } = $props();

	// Menggunakan $derived untuk reaktivitas state yang efisien
	let user = $derived(data.user);
	let stats = $derived(data.stats);
	let notifications = $derived(data.notifications);

	// Loading state aktif jika data belum ada atau sedang dalam proses navigasi
	let isLoading = $derived(!stats && !notifications.length);

	// Helper untuk format angka sesuai locale Indonesia [cite: 4]
	function formatNumber(num: number | undefined) {
		if (num === undefined) return 0;
		return new Intl.NumberFormat('id-ID').format(num);
	}
</script>

<svelte:head>
	<title>Dashboard OPD - PPID Sulsel</title>
</svelte:head>

<div class="p-6">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard Overview</h1>
		{#if user?.skpd}
			<h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{user.skpd.nm_skpd}</h3>
		{:else if isLoading}
			<div class="mt-2 h-4 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
		{/if}
	</div>

	{#if isLoading}
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each Array(3) as _}
				<div
					class="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="mb-4 flex justify-between">
						<div class="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
						<div class="h-6 w-12 rounded-full bg-slate-200 dark:bg-slate-700"></div>
					</div>
					<div class="space-y-3">
						<div class="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700"></div>
						<div class="h-8 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-8 space-y-4">
			<div class="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
			{#each Array(2) as _}
				<div
					class="flex animate-pulse gap-4 rounded-2xl border border-slate-100 p-4 dark:border-slate-700"
				>
					<div class="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
					<div class="flex-1 space-y-3">
						<div class="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-700"></div>
						<div class="h-3 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
						{formatNumber(stats.total_permohonan)}
					</h2>
				</div>
			</div>

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
							></path>
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
					<a
						href={notif.url}
						class="group block rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md {notif.read_at
							? 'border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-800'
							: 'border-blue-200 bg-blue-50/30 dark:border-blue-500/50 dark:bg-blue-900/10'}"
					>
						<div class="flex items-start gap-4">
							<div class="mt-1 shrink-0">
								{#if notif.type === 'success'}
									<div
										class="rounded-xl bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400"
									>
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 13l4 4L19 7"
											></path></svg
										>
									</div>
								{:else if notif.type === 'error'}
									<div
										class="rounded-xl bg-red-100 p-2 text-red-600 dark:bg-red-900/30 dark:text-red-400"
									>
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M6 18L18 6M6 6l12 12"
											></path></svg
										>
									</div>
								{:else}
									<div
										class="rounded-xl bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
									>
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											></path></svg
										>
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
											<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
												></path></svg
											>
											{new Date(notif.created_at).toLocaleDateString()}
											{new Date(notif.created_at).toLocaleTimeString()}
										</p>
									</div>
								</div>
								<p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
									{notif.message}
								</p>
							</div>
						</div>
					</a>
				{:else}
					<div
						class="rounded-2xl border border-slate-100 bg-white py-12 text-center dark:border-slate-700 dark:bg-slate-800"
					>
						<p class="text-sm italic text-slate-400">Belum ada notifikasi baru.</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
