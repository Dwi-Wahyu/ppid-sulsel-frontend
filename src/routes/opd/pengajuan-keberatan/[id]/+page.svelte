<script lang="ts">
	import TrackingCardPengajuan from '$lib/components/TrackingCardPengajuan.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import { invalidateAll } from '$app/navigation';
	import { api } from '$lib/api.js';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';

	let { data } = $props();
	const pengajuan = $derived(data.pengajuan);

	// Form States untuk Respon OPD
	let showOpdResponseModal = $state(false);
	let opdResponseText = $state('');
	let opdStatus = $state('selesai');
	let opdFile = $state<File | null>(null);
	let isSubmitting = $state(false);

	// Notification State
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Mencari data disposisi yang spesifik untuk SKPD user saat ini
	const userDisposisi = $derived(
		pengajuan.disposisi.find((d: any) => d.id_skpd === data.user?.id_skpd)
	);

	async function handleOpdResponse(e: Event) {
		e.preventDefault();
		if (!opdResponseText) return alert('Isi pesan respon terlebih dahulu');
		if (!userDisposisi) return alert('Data disposisi tidak ditemukan.');

		isSubmitting = true;

		const formData = new FormData();
		formData.append('respon', opdResponseText);
		formData.append('status', opdStatus);
		if (opdFile) {
			formData.append('file', opdFile);
		}

		try {
			await api.post(
				`/admin/pengajuan-keberatan/disposisi/${userDisposisi.id_disposisi}/respon`,
				formData
			);

			closeOpdResponseModal();
			notificationType = 'success';
			notificationMessage = 'Respon/Jawaban berhasil dikirim ke Admin Utama';
			showNotification = true;

			await invalidateAll();
		} catch (err: any) {
			notificationType = 'error';
			notificationMessage = err.message || 'Gagal mengirim respon';
			showNotification = true;
		} finally {
			isSubmitting = false;
		}
	}

    function closeOpdResponseModal() {
        showOpdResponseModal = false;
        opdResponseText = '';
        opdFile = null;
    }

    function handleBackdropClick(event: MouseEvent, closeFunc: () => void) {
		if (event.target === event.currentTarget) {
			closeFunc();
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
			if (showOpdResponseModal) closeOpdResponseModal();
		}
	}}
/>

<svelte:head>
	<title>Detail Pengajuan Keberatan - OPD</title>
</svelte:head>

<!-- Header -->
<div
	class="mb-6 overflow-hidden rounded-2xl bg-linear-to-br from-ppid-primary to-ppid-primary-dark p-8 text-white shadow-xl"
>
	<div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
		<div class="flex flex-1 items-start gap-4">
			<a
				href="/opd/pengajuan-keberatan"
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
			{#if userDisposisi && userDisposisi.status !== 'selesai'}
				<button
					type="button"
					onclick={() => (showOpdResponseModal = true)}
					class="rounded-lg border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-bold transition-colors hover:bg-white/20"
				>
					Kirim Jawaban OPD
				</button>
			{/if}
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
					<div class="md:col-span-2">
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">Alamat</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{pengajuan.alamat_pemohon}
						</dd>
					</div>
				</dl>
			</div>
		</div>

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
					Isi Keberatan
				</h2>
			</div>
			<div class="p-6">
				<dl class="space-y-6">
					<div>
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">
							Alasan Pengajuan Keberatan
						</dt>
						<dd class="mt-2">
							<ul class="space-y-2">
								{#each pengajuan.alasan_pengajuan as alasan}
									<li class="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
										<svg
											class="mt-0.5 h-5 w-5 shrink-0 text-ppid-primary"
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
		<TrackingCardPengajuan disposisi={pengajuan.disposisi} id_skpd={data.user?.id_skpd} />
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

		<!-- Tindakan OPD -->
		{#if userDisposisi && userDisposisi.status !== 'selesai'}
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
						Tindakan Unit
					</h3>
				</div>
				<div class="p-4">
					<p class="mb-4 text-sm text-slate-600 dark:text-slate-400">
						Kirimkan jawaban atau respon resmi dari unit Anda:
					</p>
					<button
						type="button"
						onclick={() => (showOpdResponseModal = true)}
						class="group relative w-full overflow-hidden rounded-xl border-2 border-emerald-100 bg-white p-1 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg dark:border-emerald-900/50 dark:bg-slate-800"
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
								<h4 class="font-bold text-slate-900 dark:text-white">Kirim Jawaban</h4>
								<p class="text-xs text-slate-500 dark:text-slate-400">
									Berikan tanggapan resmi dari unit/OPD.
								</p>
							</div>
						</div>
					</button>
				</div>
			</div>
		{/if}

        <!-- Jawaban Unit (Jika Sudah Ada) -->
		{#if userDisposisi && userDisposisi.respon && userDisposisi.respon.length > 0}
            <div
                class="overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-800/50 dark:bg-slate-800"
            >
                <div
                    class="border-b border-emerald-200 bg-linear-to-r from-emerald-600 to-emerald-700 p-4 dark:border-emerald-800/50"
                >
                    <h3 class="flex items-center gap-2 text-sm font-bold text-white uppercase">
                        Jawaban Unit Anda
                    </h3>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                            {userDisposisi.respon[0].isi_respon}
                        </p>
                        {#if userDisposisi.respon[0].file}
                            <a
                                href="{PUBLIC_BACKEND_URL}/uploads/respon-disposisi/{userDisposisi.respon[0].file}"
                                target="_blank"
                                class="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
                            >
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    ><path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                    /></svg
                                >
                                Lihat Dokumen Lampiran
                            </a>
                        {/if}
                        <div class="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
                            <span class="text-[10px] font-bold text-slate-400 uppercase">Status Tindak Lanjut:</span>
                            <span class="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 uppercase"
                                >{userDisposisi.status}</span
                            >
                        </div>
                    </div>
                </div>
            </div>
		{/if}
	</div>
</div>

<!-- Modal: Kirim Jawaban/Respon -->
{#if showOpdResponseModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		onclick={(e) => handleBackdropClick(e, closeOpdResponseModal)}
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
					Kirim Jawaban/Respon
				</h3>
				<button
					type="button"
					onclick={closeOpdResponseModal}
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
			<form onsubmit={handleOpdResponse} class="p-6">
				<div class="space-y-5">
                    <div>
                        <label for="opd-status" class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Status Penyelesaian <span class="text-red-500">*</span>
                        </label>
                        <select
                            id="opd-status"
                            bind:value={opdStatus}
                            class="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                        >
                            <option value="selesai">Selesai / Sudah Dijawab</option>
                            <option value="diproses">Masih Dalam Proses</option>
                            <option value="ditolak">Bukan Kewenangan Kami</option>
                        </select>
                    </div>

					<div>
						<label
							for="opd-feedback"
							class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Isi Tanggapan Resmi <span class="text-red-500">*</span>
						</label>
						<textarea
							id="opd-feedback"
							bind:value={opdResponseText}
							rows="6"
							required
							placeholder="Berikan penjelasan detail terkait tindak lanjut keberatan ini..."
							class="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						></textarea>
					</div>

					<div>
						<label
							for="file-upload"
							class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Unggah Bukti/Dokumen (Opsional, Max 5MB)
						</label>
						<input
							type="file"
							id="file-upload"
							accept=".pdf,.doc,.docx,.jpg,.png"
							onchange={(e) => (opdFile = e.currentTarget.files?.[0] || null)}
							class="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100 focus:border-emerald-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700"
						/>
						<p class="mt-1 text-xs text-slate-500">Format: PDF, DOC, JPG, PNG</p>
					</div>

					<div class="flex gap-3 pt-4">
						<button
							type="button"
							onclick={closeOpdResponseModal}
							class="flex-1 rounded-lg border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
						>
							Batal
						</button>
						<button
							type="submit"
                            disabled={isSubmitting}
							class="flex-1 rounded-lg bg-linear-to-r from-emerald-600 to-emerald-700 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50"
						>
							{isSubmitting ? 'Mengirim...' : 'Kirim Jawaban'}
						</button>
					</div>
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
</style>