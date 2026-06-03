<script lang="ts">
	import { api } from '$lib/api';
	import { invalidateAll } from '$app/navigation';
	import { getImageUrl } from '$lib/get-image-url';
	import TrackingCardPengajuan from '$lib/components/TrackingCardPengajuan.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import FilePond from '$lib/components/FilePond.svelte';

	let { data } = $props();

	// Temukan disposisi untuk OPD ini
	const myDisposisi = $derived(
		data.pengajuan.disposisi?.find((d: any) => d.id_skpd === data.user?.id_skpd)
	);

	// Ambil respon terbaru dari OPD ini (jika ada)
	const myRespon = $derived(
		myDisposisi?.respon && myDisposisi.respon.length > 0
			? myDisposisi.respon[myDisposisi.respon.length - 1]
			: null
	);

	// State
	let showOpdResponseModal = $state(false);
	let opdResponseFile = $state<File | null>(null);
	let opdResponseNote = $state('');
	let opdResponseStatus = $state('selesai');
	let isSubmitting = $state(false);

	// Notification State
	let showNotification = $state(false);
	let notificationTheme = $state<'success' | 'error'>('success');
	let notificationTitle = $state('');
	let notificationDescription = $state('');

	function closeOpdResponseModal() {
		showOpdResponseModal = false;
		opdResponseFile = null;
		opdResponseNote = '';
	}

	async function handleSubmitOpdResponse(e: SubmitEvent) {
		e.preventDefault();
		if (!myDisposisi) return;

		isSubmitting = true;

		try {
			const formData = new FormData();
			formData.append('respon', opdResponseNote);
			formData.append('status', opdResponseStatus);
			if (opdResponseFile) {
				formData.append('file', opdResponseFile);
			}

			const response = await api.post(
				`/admin/pengajuan-keberatan/disposisi/${myDisposisi.id_disposisi}/respon`,
				formData
			);

			if (response.success) {
				notificationTheme = 'success';
				notificationTitle = 'Berhasil!';
				notificationDescription = 'Jawaban Anda telah berhasil dikirim.';
				closeOpdResponseModal();
				await invalidateAll();
			} else {
				throw new Error(response.message || 'Gagal mengirim jawaban.');
			}
		} catch (error: any) {
			notificationTheme = 'error';
			notificationTitle = 'Gagal!';
			notificationDescription = error.message || 'Terjadi kesalahan sistem.';
		} finally {
			isSubmitting = false;
			showNotification = true;
		}
	}

	function handleBackdropClick(e: MouseEvent, closeFn: () => void) {
		if (e.target === e.currentTarget) {
			closeFn();
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

<svelte:head>
	<title>Detail Pengajuan Keberatan - OPD Panel</title>
</svelte:head>

<div class="mb-8">
	<div class="flex items-center gap-3">
		<button
			onclick={() => history.back()}
			aria-label="Kembali"
			class="rounded-xl bg-white p-2 text-slate-500 shadow-sm transition-all hover:text-ppid-primary dark:bg-slate-800"
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path
					d="M19 12H5M12 19l-7-7 7-7"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Detail Pengajuan Keberatan</h1>
			<p class="text-slate-500">Kelola dan tinjau detail pengajuan keberatan informasi.</p>
		</div>
	</div>
</div>

<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
	<!-- Main Info -->
	<div class="space-y-8 lg:col-span-2">
		<!-- Detail Keberatan -->
		<div class="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm dark:bg-slate-800">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-bold text-slate-900 dark:text-white">Informasi Pengajuan</h2>
				<span
					class="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300"
				>
					{data.pengajuan.no_pendaftaran}
				</span>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-1">
					<p class="text-xs font-bold tracking-wider text-slate-400 uppercase">Nama Pemohon</p>
					<p class="text-base font-semibold text-slate-900 dark:text-white">
						{data.pengajuan.nama_pemohon}
					</p>
				</div>
				<div class="space-y-1">
					<p class="text-xs font-bold tracking-wider text-slate-400 uppercase">Tujuan Penggunaan</p>
					<p class="text-base font-semibold text-slate-900 dark:text-white">
						{data.pengajuan.tujuan || '-'}
					</p>
				</div>
				<div class="space-y-1 md:col-span-2">
					<p class="text-xs font-bold tracking-wider text-slate-400 uppercase">Alasan Keberatan</p>
					<div class="mt-2">
						<ul class="space-y-2">
							{#each data.pengajuan.alasan_pengajuan || [] as alasan}
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
					</div>
				</div>
				<div class="space-y-1 md:col-span-2">
					<p class="text-xs font-bold tracking-wider text-slate-400 uppercase">Kasus Posisi</p>
					<p
						class="mt-2 rounded-lg bg-slate-50 p-4 whitespace-pre-wrap text-base font-semibold text-slate-900 dark:bg-slate-700/50 dark:text-white"
					>
						{data.pengajuan.kasus || '-'}
					</p>
				</div>
			</div>
		</div>

		<!-- Respon Admin -->
		{#if data.pengajuan.feedback}
			<div
				class="rounded-2xl border border-blue-100 bg-blue-50/50 p-8 dark:border-blue-900/30 dark:bg-blue-900/10"
			>
				<div class="mb-4 flex items-center gap-3 text-blue-700 dark:text-blue-400">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path
							d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
							stroke-width="2"
						/>
					</svg>
					<h2 class="text-lg font-bold">Instruksi Admin PPID</h2>
				</div>
				<p class="leading-relaxed text-blue-900/80 dark:text-blue-200/80">
					{data.pengajuan.feedback}
				</p>
			</div>
		{/if}

		<!-- Jawaban OPD -->
		<div class="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm dark:bg-slate-800">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-bold text-slate-900 dark:text-white">Jawaban/Respon Anda</h2>
				{#if !myRespon}
					<button
						onclick={() => (showOpdResponseModal = true)}
						class="rounded-xl bg-ppid-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-ppid-primary/20 transition-all hover:bg-ppid-primary/90"
					>
						Kirim Jawaban
					</button>
				{/if}
			</div>

			{#if myRespon}
				<div class="space-y-6">
					<div class="rounded-xl bg-slate-50 p-6 dark:bg-slate-900/50">
						<p class="leading-relaxed text-slate-700 dark:text-slate-300">
							{myRespon.isi_respon}
						</p>
					</div>
					{#if myRespon.file}
						<div
							class="flex items-center gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-700"
						>
							<div
								class="flex h-12 w-12 items-center justify-center rounded-lg bg-ppid-primary/10 text-ppid-primary"
							>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path
										d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
										stroke-width="2"
									/>
									<path d="M14 2v6h6" stroke-width="2" />
								</svg>
							</div>
							<div class="flex-1">
								<p class="text-sm font-bold text-slate-900 dark:text-white">
									Dokumen Lampiran Jawaban
								</p>
								<p class="text-xs text-slate-500">File PDF/Dokumen Pendukung</p>
							</div>
							<a
								href={getImageUrl(`respon-disposisi/${myRespon.file}`)}
								target="_blank"
								class="rounded-lg bg-ppid-primary px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-ppid-primary/90"
							>
								Unduh File
							</a>
						</div>
					{/if}
				</div>
			{:else}
				<div class="py-12 text-center">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300 dark:bg-slate-900"
					>
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path
								d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.8.9"
								stroke-width="2"
							/>
							<path d="M16 5l-2 2h4" stroke-width="2" />
						</svg>
					</div>
					<p class="text-slate-500">Belum ada jawaban yang dikirimkan untuk pengajuan ini.</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- Sidebar -->
	<div class="space-y-8">
		<!-- Tracking Card -->
		<TrackingCardPengajuan
			disposisi={data.pengajuan.disposisi}
			id_skpd={data.user?.id_skpd}
		/>

		<!-- Quick Actions -->
		<div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:bg-slate-800">
			<h3 class="mb-4 text-sm font-bold tracking-widest text-slate-400 uppercase">Aksi Cepat</h3>
			<div class="space-y-3">
				<a
					href="/ppid-pelaksana/{data.pengajuan.id_skpd}"
					target="_blank"
					class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-100 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke-width="2" />
						<polyline points="15 3 21 3 21 9" stroke-width="2" />
						<line x1="10" y1="14" x2="21" y2="3" stroke-width="2" />
					</svg>
					Lihat Profil SKPD
				</a>
			</div>
		</div>
	</div>
</div>

<!-- Modal: Kirim Jawaban/Respon -->
{#if showOpdResponseModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		onclick={(e) => handleBackdropClick(e, closeOpdResponseModal)}
		onkeydown={(e) => e.key === 'Escape' && closeOpdResponseModal()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		aria-labelledby="response-modal-title"
	>
		<div
			class="w-full max-w-2xl animate-[scale-in_0.2s_ease-out] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="presentation"
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

			<form onsubmit={handleSubmitOpdResponse} class="p-6">
				<div class="space-y-6">
					<div
						class="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10"
					>
						<div class="flex gap-3">
							<svg
								class="h-5 w-5 text-amber-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									stroke-width="2"
								/>
							</svg>
							<p class="text-sm text-amber-800 dark:text-amber-200">
								Pastikan jawaban yang Anda berikan sudah lengkap dan menyertakan dokumen pendukung
								jika diperlukan.
							</p>
						</div>
					</div>

					<div>
						<label
							for="opd-note"
							class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Catatan/Isi Jawaban <span class="text-red-500">*</span>
						</label>
						<textarea
							id="opd-note"
							bind:value={opdResponseNote}
							rows="5"
							required
							placeholder="Tuliskan jawaban atau respon resmi dari OPD Anda..."
							class="w-full rounded-xl border border-slate-200 px-4 py-3 ring-ppid-primary/20 transition-all outline-none focus:border-ppid-primary focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
						></textarea>
					</div>

					<div>
						<label
							for="opd-status"
							class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Status Akhir <span class="text-red-500">*</span>
						</label>
						<select
							id="opd-status"
							bind:value={opdResponseStatus}
							class="w-full rounded-xl border border-slate-200 px-4 py-3 ring-ppid-primary/20 transition-all outline-none focus:border-ppid-primary focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
						>
							<option value="diproses">Masih Diproses</option>
							<option value="selesai">Selesai / Terjawab</option>
							<option value="ditolak">Ditolak</option>
						</select>
					</div>

					<div>
						<label
							for="opd-file"
							class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Upload Dokumen Lampiran (Opsional)
						</label>
						<FilePond
							id="opd-file"
							bind:value={opdResponseFile}
							acceptedFileTypes={['application/pdf', 'application/zip', 'image/jpeg', 'image/png']}
							label="Seret dokumen atau <span class='filepond--label-action'>Telusuri</span>"
						/>
						<p class="mt-2 text-xs text-slate-500">Format: PDF, ZIP, JPG, PNG (Max 10MB)</p>
					</div>

					<div class="flex gap-3 pt-2">
						<button
							type="button"
							onclick={closeOpdResponseModal}
							class="flex-1 rounded-xl border-2 border-slate-100 py-3 font-bold text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-900"
						>
							Batal
						</button>
						<button
							type="submit"
							disabled={isSubmitting || !opdResponseNote}
							class="flex-1 rounded-xl bg-ppid-primary py-3 font-bold text-white shadow-lg shadow-ppid-primary/20 transition-all hover:bg-ppid-primary/90 disabled:opacity-50"
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
	theme={notificationTheme}
	title={notificationTitle}
	description={notificationDescription}
/>
