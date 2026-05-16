<script lang="ts">
	import TrackingCardPengajuan from '$lib/components/TrackingCardPengajuan.svelte';
	import { invalidateAll } from '$app/navigation';
	import { api } from '$lib/api.js';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	let { data } = $props();
	const pengajuan = $derived(data.pengajuan);
	const all_skpd = $derived(data.extra.all_skpd);

	// Form States
	let showResponseModal = $state(false);
	let showDisposisiModal = $state(false);
	let feedbackText = $state('');

	// Initialize selected SKPD with those already assigned to prevent re-assignment logically, 
    // but here we filter out already assigned from available list.
    let assignedSkpdIds = $derived(
		pengajuan.disposisi?.map((d: { skpd_id: string }) => d.skpd_id) || []
	);
	
	let availableSkpd = $derived(
		all_skpd.filter((skpd: { id_skpd: string }) => !assignedSkpdIds.includes(skpd.id_skpd))
	);

	let selectedSkpd = $state<string[]>([]);
	let catatanDisposisi = $state('');
	let searchSkpd = $state('');
	let isSubmitting = $state(false);

	// Notification State
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	const filteredSkpd = $derived(
		availableSkpd.filter((s: { nm_skpd: string }) =>
			s.nm_skpd.toLowerCase().includes(searchSkpd.toLowerCase())
		)
	);

	function toggleSkpd(skpdId: string) {
		if (selectedSkpd.includes(skpdId)) {
			selectedSkpd = selectedSkpd.filter((id) => id !== skpdId);
		} else {
			selectedSkpd = [...selectedSkpd, skpdId];
		}
	}

	function closeDisposisiModal() {
		showDisposisiModal = false;
		selectedSkpd = [];
		catatanDisposisi = '';
		searchSkpd = '';
	}

	function closeResponseModal() {
		showResponseModal = false;
		feedbackText = '';
	}

	// Handle backdrop click
	function handleBackdropClick(event: MouseEvent, closeFunc: () => void) {
		if (event.target === event.currentTarget) {
			closeFunc();
		}
	}

	async function handleDisposisi(e: Event) {
		e.preventDefault();
		if (selectedSkpd.length === 0) return alert('Pilih minimal satu OPD');
		isSubmitting = true;
		try {
			await api.post(`/admin/pengajuan-keberatan/${pengajuan.id_pengajuan}/disposisi`, {
				skpd_ids: selectedSkpd,
				catatan: catatanDisposisi || 'Mohon tindak lanjuti pengajuan keberatan ini.'
			});

			closeDisposisiModal();
			await invalidateAll();

			notificationType = 'success';
			notificationMessage = 'Sukses mengirim disposisi';
			showNotification = true;
		} catch (err: any) {
			notificationType = 'error';
			notificationMessage = 'Gagal mengirim disposisi';
			showNotification = true;
		} finally {
			isSubmitting = false;
		}
	}

	async function handleFeedback(e: Event) {
		e.preventDefault();
		if (!feedbackText) return alert('Isi pesan tanggapan');
		isSubmitting = true;
		try {
			await api.post(`/admin/pengajuan-keberatan/${pengajuan.id_pengajuan}/feedback`, {
				feedback: feedbackText
			});
			closeResponseModal();
			await invalidateAll();

			notificationType = 'success';
			notificationMessage = 'Sukses mengirim tanggapan';
			showNotification = true;
		} catch (err: any) {
			notificationType = 'error';
			notificationMessage = 'Gagal mengirim tanggapan';
			showNotification = true;
		} finally {
			isSubmitting = false;
		}
	}

	function getStatusConfig(status: string) {
		switch (status) {
			case 'n':
				return { label: 'Baru', color: 'bg-slate-100 text-slate-700' };
			case 'p':
				return { label: 'Menunggu Verifikasi', color: 'bg-amber-100 text-amber-700' };
			case 'y':
				return { label: 'Disetujui', color: 'bg-emerald-100 text-emerald-700' };
			case 'd':
				return { label: 'Disposisi', color: 'bg-purple-100 text-purple-700' };
			case 'a':
				return { label: 'Dijawab', color: 'bg-blue-100 text-blue-700' };
			case 't':
				return { label: 'Ditolak', color: 'bg-red-100 text-red-700' };
			default:
				return { label: 'Unknown', color: 'bg-slate-100 text-slate-700' };
		}
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			if (showResponseModal) closeResponseModal();
			if (showDisposisiModal) closeDisposisiModal();
		}
	}}
/>

<svelte:head>
	<title>Detail Pengajuan Keberatan #{pengajuan.no_pendaftaran}</title>
</svelte:head>

<!-- Header -->
<div
	class="mb-6 overflow-hidden rounded-2xl bg-linear-to-br from-ppid-primary to-ppid-primary-dark p-8 text-white shadow-xl"
>
	<div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
		<div class="flex flex-1 items-start gap-4">
			<a
				href="/admin/pengajuan-keberatan"
				class="mt-1 shrink-0 rounded-lg p-2 transition-colors hover:bg-white/10"
				aria-label="Kembali ke daftar pengajuan"
			>
				<svg
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</a>
			<div>
				<h1 class="text-2xl font-bold">Detail Pengajuan Keberatan</h1>
				<p class="mt-1 font-mono text-sm tracking-wider text-white/80 uppercase">
					Ref: {pengajuan.no_pendaftaran} — {pengajuan.nama_pemohon}
				</p>
			</div>
		</div>
		<div class="flex shrink-0 items-center gap-3">
			<span class="rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-sm font-bold">
				{getStatusConfig(pengajuan.status).label}
			</span>
			<!-- Tombol Disposisi cepat di header -->
			<button
				type="button"
				onclick={() => (showDisposisiModal = true)}
				class="rounded-lg border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-bold transition-colors hover:bg-white/20"
			>
				{pengajuan.disposisi && pengajuan.disposisi.length > 0
					? '+ Tambah OPD'
					: 'Disposisi ke OPD'}
			</button>
		</div>
	</div>
</div>

<!-- Main Content -->
<div class="grid gap-6 lg:grid-cols-3">
	<!-- Left: Details -->
	<div class="space-y-6 lg:col-span-2">
		<!-- Identitas Pemohon -->
		<div
			class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div
				class="border-b border-white/10 bg-linear-to-r from-ppid-primary to-ppid-primary-light p-4"
			>
				<h2 class="flex items-center gap-2 text-lg font-bold text-white">
					<svg
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						/>
					</svg>
					Identitas Pemohon
				</h2>
			</div>
			<div class="p-6">
				<dl class="grid gap-4 md:grid-cols-2">
					<div>
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">Nama Lengkap</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{pengajuan.nama_pemohon}
						</dd>
					</div>
					<div>
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">Email</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{pengajuan.email_pemohon}
						</dd>
					</div>
					<div>
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">Pekerjaan</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{pengajuan.pekerjaan?.nama_pekerjaan || '-'}
						</dd>
					</div>
					<div>
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">Domisili</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{pengajuan.domisili_pemohon?.nama_daerah || '-'}, {pengajuan.domisili_pemohon?.provinsi || '-'}
						</dd>
					</div>
					<div class="md:col-span-2">
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">Alamat</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{pengajuan.alamat_pemohon}
						</dd>
					</div>
				</dl>
			</div>
		</div>

		<!-- Informasi Kuasa (Jika Ada) -->
		{#if pengajuan.nama_kuasa}
		<div
			class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div
				class="border-b border-white/10 bg-linear-to-r from-ppid-primary to-ppid-primary-light p-4"
			>
				<h2 class="flex items-center gap-2 text-lg font-bold text-white">
					<svg
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
						/>
					</svg>
					Informasi Kuasa
				</h2>
			</div>
			<div class="p-6">
				<dl class="grid gap-4 md:grid-cols-2">
					<div>
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">Nama Kuasa</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{pengajuan.nama_kuasa}
						</dd>
					</div>
					<div>
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">No. Telp Kuasa</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{pengajuan.no_telp_kuasa || '-'}
						</dd>
					</div>
					<div>
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">Domisili Kuasa</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{pengajuan.domisili_kuasa?.nama_daerah || '-'}, {pengajuan.domisili_kuasa?.provinsi || '-'}
						</dd>
					</div>
					<div class="md:col-span-2">
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">Alamat Kuasa</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{pengajuan.alamat_kuasa}
						</dd>
					</div>
				</dl>
			</div>
		</div>
		{/if}

		<!-- Detail Keberatan -->
		<div
			class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div
				class="border-b border-white/10 bg-linear-to-r from-ppid-primary to-ppid-primary-light p-4"
			>
				<h2 class="flex items-center gap-2 text-lg font-bold text-white">
					<svg
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
					Detail Keberatan
				</h2>
			</div>
			<div class="p-6">
				<dl class="space-y-6">
					<div>
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">
							Tujuan Penggunaan Informasi
						</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{pengajuan.tujuan || '-'}
						</dd>
					</div>
					<div>
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">
							Alasan Pengajuan Keberatan
						</dt>
						<dd class="mt-2">
							<ul class="space-y-2">
								{#each pengajuan.alasan_pengajuan as alasan}
									<li class="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
										<svg
											class="mt-0.5 h-5 w-5 shrink-0 text-red-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/></svg
										>
										<span>{alasan.alasan}</span>
									</li>
								{/each}
							</ul>
						</dd>
					</div>
					<div>
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">
							Kasus Posisi
						</dt>
						<dd
							class="mt-2 rounded-lg bg-slate-50 p-4 whitespace-pre-wrap text-slate-900 dark:bg-slate-700/50 dark:text-slate-100"
						>
							{pengajuan.kasus}
						</dd>
					</div>
				</dl>
			</div>
		</div>

		<!-- Tracking Disposisi OPD -->
		<TrackingCardPengajuan disposisi={pengajuan.disposisi} />
	</div>

	<!-- Right: Actions & Info -->
	<div class="space-y-6">
		<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
			<h3 class="mb-4 text-sm font-bold tracking-widest text-slate-400 uppercase">Informasi Waktu</h3>
			<div class="space-y-4">
				<div class="flex justify-between border-b border-slate-100 pb-4 text-sm dark:border-slate-700">
					<span class="text-slate-500 dark:text-slate-400">Dikirim Pada</span>
					<span class="font-semibold text-slate-900 dark:text-slate-100"
						>{formatDate(pengajuan.created_at)}</span
					>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-slate-500 dark:text-slate-400">Metode Respon</span>
					<span class="font-semibold text-slate-900 capitalize dark:text-slate-100">{pengajuan.metode_respon}</span>
				</div>
			</div>
		</div>

		<!-- Tindakan Admin -->
		{#if pengajuan.status !== 'd' && pengajuan.status !== 'a'}
			<div
				class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div
					class="border-b border-white/10 bg-linear-to-r from-ppid-primary to-ppid-primary-light p-4"
				>
					<h3 class="flex items-center gap-2 text-lg font-bold text-white">
						<svg
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
						Tindakan Admin
					</h3>
				</div>
				<div class="p-4">
					<p class="mb-4 text-sm text-slate-600 dark:text-slate-400">
						Pilih tindakan untuk pengajuan ini:
					</p>
					<div class="space-y-4">
						<!-- Beri Tanggapan -->
						<button
							type="button"
							onclick={() => (showResponseModal = true)}
							class="group relative w-full overflow-hidden rounded-xl border-2 border-emerald-100 bg-white p-1 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg dark:border-emerald-900/50 dark:bg-slate-800"
							aria-label="Buka form tanggapan"
						>
							<div
								class="absolute inset-0 bg-linear-to-r from-emerald-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-emerald-900/20"
							></div>
							<div class="relative flex items-center gap-4 p-4">
								<div
									class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-900/50 dark:text-emerald-400"
								>
									<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<div>
									<h4 class="font-bold text-slate-900 dark:text-white">Beri Tanggapan</h4>
									<p class="text-xs text-slate-500 dark:text-slate-400">
										Selesaikan pengajuan secara langsung.
									</p>
								</div>
								<div
									class="ml-auto text-emerald-500 opacity-0 transition-all group-hover:opacity-100"
								>
									<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										/></svg
									>
								</div>
							</div>
						</button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Panel Disposisi -->
		<div
			class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div
				class="border-b border-white/10 bg-linear-to-r from-ppid-primary to-ppid-primary-light p-4"
			>
				<h3 class="flex items-center gap-2 text-lg font-bold text-white">
					<svg
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
						/>
					</svg>
					{pengajuan.disposisi && pengajuan.disposisi.length > 0
						? 'Tambah OPD Lain'
						: 'Disposisi ke OPD'}
					{#if pengajuan.disposisi && pengajuan.disposisi.length > 0}
						<span class="ml-auto rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold">
							{pengajuan.disposisi.length} OPD
						</span>
					{/if}
				</h3>
			</div>
			<div class="p-4">
				<p class="mb-4 text-sm text-slate-600 dark:text-slate-400">
					{pengajuan.disposisi && pengajuan.disposisi.length > 0
						? 'Teruskan ke OPD tambahan untuk ditindaklanjuti.'
						: 'Teruskan pengajuan ke SKPD terkait untuk ditindaklanjuti.'}
				</p>
				<button
					type="button"
					onclick={() => (showDisposisiModal = true)}
					class="group relative w-full overflow-hidden rounded-xl border-2 border-purple-100 bg-white p-1 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500 hover:shadow-lg dark:border-purple-900/50 dark:bg-slate-800"
					aria-label="Buka form disposisi"
				>
					<div
						class="absolute inset-0 bg-linear-to-r from-purple-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-purple-900/20"
					></div>
					<div class="relative flex items-center gap-4 p-4">
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ppid-primary/10 text-ppid-primary transition-colors group-hover:bg-ppid-primary group-hover:text-white dark:bg-ppid-primary/20 dark:text-ppid-primary-light"
						>
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
								/>
							</svg>
						</div>
						<div>
							<h4 class="font-bold text-slate-900 dark:text-white">
								{pengajuan.disposisi && pengajuan.disposisi.length > 0
									? 'Tambah OPD Tujuan'
									: 'Buat Disposisi'}
							</h4>
							<p class="text-xs text-slate-500 dark:text-slate-400">
								Pilih OPD/SKPD untuk menindaklanjuti pengajuan ini.
							</p>
						</div>
						<div class="ml-auto text-purple-500 opacity-0 transition-all group-hover:opacity-100">
							<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/></svg
							>
						</div>
					</div>
				</button>
			</div>
		</div>
	</div>
</div>

<!-- Modal: Beri Tanggapan -->
{#if showResponseModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		onclick={(e) => handleBackdropClick(e, closeResponseModal)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="response-modal-title"
	>
		<div
			class="w-full max-w-2xl overflow-hidden animate-[scale-in_0.2s_ease-out] rounded-2xl bg-white shadow-2xl dark:bg-slate-800"
			onclick={(e) => e.stopPropagation()}
		>
			<div
				class="flex items-center justify-between border-b border-emerald-200 bg-linear-to-r from-emerald-600 to-emerald-700 p-6"
			>
				<h3 id="response-modal-title" class="flex items-center gap-2 text-xl font-bold text-white">
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					Form Tanggapan Keberatan
				</h3>
				<button
					type="button"
					onclick={closeResponseModal}
					class="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
					aria-label="Tutup modal"
				>
					<svg
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
			<form
				onsubmit={handleFeedback}
				class="p-6"
			>
				<div class="space-y-5">
					<div
						class="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20"
					>
						<p class="text-sm text-emerald-800 dark:text-emerald-200">
							<span class="font-semibold">ℹ️ Info:</span> Status otomatis akan berubah menjadi
							<span class="font-bold">"Dijawab"</span> setelah Anda memberikan tanggapan.
						</p>
					</div>

					<div>
						<label
							for="pesan"
							class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Pesan Tanggapan <span class="text-red-500">*</span>
						</label>
						<textarea
							id="pesan"
							name="pesan"
							bind:value={feedbackText}
							rows="6"
							required
							placeholder="Tuliskan alasan atau keterangan untuk pemohon..."
							class="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						></textarea>
					</div>

					<div class="flex gap-3 pt-4">
						<button
							type="button"
							onclick={closeResponseModal}
							class="flex-1 rounded-lg border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
						>
							Batal
						</button>
						<button
							type="submit"
                            disabled={isSubmitting}
							class="flex-1 rounded-lg bg-linear-to-r from-emerald-600 to-emerald-700 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50"
						>
							{isSubmitting ? 'Mengirim...' : 'Kirim Tanggapan'}
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Modal: Disposisi -->
{#if showDisposisiModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		onclick={(e) => handleBackdropClick(e, closeDisposisiModal)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="disposition-modal-title"
	>
		<div
			class="w-full max-w-2xl overflow-hidden animate-[scale-in_0.2s_ease-out] rounded-2xl bg-white shadow-2xl dark:bg-slate-800"
			onclick={(e) => e.stopPropagation()}
		>
			<div
				class="flex items-center justify-between border-b border-white/10 bg-linear-to-r from-ppid-primary to-ppid-primary-light p-6"
			>
				<h3
					id="disposition-modal-title"
					class="flex items-center gap-2 text-xl font-bold text-white"
				>
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
						/>
					</svg>
					Form Disposisi
				</h3>
				<button
					type="button"
					onclick={closeDisposisiModal}
					class="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
					aria-label="Tutup modal"
				>
					<svg
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
			<form
				onsubmit={handleDisposisi}
				class="p-6"
			>
				<div class="space-y-5">
					{#if availableSkpd.length === 0}
						<div
							class="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-600 dark:bg-slate-700"
						>
							<svg
								class="mx-auto h-12 w-12 text-slate-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<p class="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
								Semua OPD sudah didisposisi
							</p>
						</div>
					{:else}
                        <div class="relative">
                            <input
                                type="text"
                                bind:value={searchSkpd}
                                placeholder="Cari OPD..."
                                class="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                            />
                        </div>

						<div>
							<label class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
								Pilih OPD/SKPD Tujuan <span class="text-red-500">*</span>
								{#if selectedSkpd.length > 0}
									<span
										class="ml-2 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
									>
										{selectedSkpd.length} dipilih
									</span>
								{/if}
							</label>
							<div
								class="max-h-60 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3 dark:border-slate-600"
							>
								{#each filteredSkpd as skpd}
									<label
										class="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20 {selectedSkpd.includes(skpd.id_skpd) ? 'bg-purple-50 dark:bg-purple-900/20' : ''}"
									>
										<input
											type="checkbox"
											name="id_skpd"
											value={skpd.id_skpd}
											checked={selectedSkpd.includes(skpd.id_skpd)}
											onchange={() => toggleSkpd(skpd.id_skpd)}
											class="h-4 w-4 rounded border-slate-300 text-ppid-primary focus:ring-2 focus:ring-ppid-primary"
										/>
										<span class="flex-1 text-sm font-medium text-slate-900 dark:text-slate-100">
											{skpd.nm_skpd}
										</span>
									</label>
								{/each}
							</div>
						</div>

						<div>
							<label
								for="catatanDisposisi"
								class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
							>
								Catatan Disposisi (Opsional)
							</label>
							<textarea
								id="catatanDisposisi"
								name="pesan"
								bind:value={catatanDisposisi}
								rows="4"
								placeholder="Tambahkan catatan atau instruksi untuk OPD..."
								class="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
							></textarea>
						</div>

						<div class="flex gap-3 pt-4">
							<button
								type="button"
								onclick={closeDisposisiModal}
								class="flex-1 rounded-lg border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
							>
								Batal
							</button>
							<button
								type="submit"
								disabled={isSubmitting || selectedSkpd.length === 0}
								class="flex-1 rounded-lg bg-linear-to-r from-ppid-primary to-ppid-primary-light px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-ppid-primary-hover hover:to-ppid-primary disabled:cursor-not-allowed disabled:opacity-50"
							>
								{isSubmitting ? 'Memproses...' : 'Buat Disposisi'}
							</button>
						</div>
					{/if}
				</div>
			</form>
		</div>
	</div>
{/if}

<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'BERHASIL' : 'GAGAL'}
	description={notificationMessage}
/>

<style>
	@keyframes scale-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes slide-in {
		from {
			opacity: 0;
			transform: translateX(100%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>