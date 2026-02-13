<script lang="ts">
	import PengajuanDialog from '$lib/components/PengajuanDialog.svelte';
	import { invalidateAll } from '$app/navigation';
	import { api } from '$lib/api.js';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import TrackingCardPengajuan from '$lib/components/TrackingCardPengajuan.svelte';

	let { data } = $props();
	const pengajuan = $derived(data.pengajuan);

	// Form States
	let isSubmitting = $state(false);

	// Tambahkan state baru di bagian Form States
	let showOpdResponseModal = $state(false);
	let opdResponseText = $state('');
	let opdStatus = $state('selesai');
	let opdFile = $state<File | null>(null);

	// Notification State
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	async function handleOpdResponse(e: Event) {
		e.preventDefault();
		if (!opdResponseText) return alert('Isi pesan respon terlebih dahulu');

		// Cari ID disposisi yang ditujukan untuk SKPD user saat ini
		// data.user.id_skpd diasumsikan berasal dari data session user
		const userDisposisi = pengajuan.disposisi.find(
			(d: any) => d.id_skpd === data.user?.id_skpd && d.status !== 'selesai'
		);

		if (!userDisposisi) return alert('Data disposisi tidak ditemukan atau sudah selesai.');

		isSubmitting = true;

		// Menggunakan FormData untuk mendukung pengiriman file
		const formData = new FormData();
		formData.append('respon', opdResponseText);
		formData.append('status', opdStatus);
		if (opdFile) {
			formData.append('file', opdFile);
		}

		try {
			// Gunakan ID disposisi yang ditemukan pada endpoint
			await api.post(
				`/admin/pengajuan-keberatan/disposisi/${userDisposisi.id_disposisi}/respon`,
				formData
			);

			showOpdResponseModal = false;
			opdResponseText = '';
			opdFile = null; // Reset file
			notificationType = 'success';
			notificationMessage = 'Respon berhasil dikirim';
			showNotification = true;
			await invalidateAll();
		} catch (err: any) {
			notificationType = 'error';
			notificationMessage = err.message || 'Gagal mengirim respon';
			showNotification = true;
		} finally {
			isSubmitting = false; //
		}
	}

	function getStatusClass(status: string) {
		switch (status) {
			case 'n':
				return 'bg-amber-100 text-amber-800 border-amber-200';
			case 'y':
				return 'bg-emerald-100 text-emerald-800 border-emerald-200';
			default:
				return 'bg-slate-100 text-slate-800 border-slate-200';
		}
	}
</script>

<svelte:head>
	<title>Detail Pengajuan Keberatan - {pengajuan.no_pendaftaran}</title>
</svelte:head>

<main class="min-h-screen">
	<div class="mx-auto max-w-6xl">
		<header class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
			<div class="flex items-center gap-4">
				<a
					href="/admin/pengajuan-keberatan"
					class="rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
					aria-label="Kembali ke daftar"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/></svg
					>
				</a>
				<div>
					<h1 class="text-2xl font-black text-slate-900 dark:text-white">Detail Pengajuan</h1>
					<p class="font-mono text-sm tracking-wider text-slate-500 uppercase">
						Ref: {pengajuan.no_pendaftaran}
					</p>
				</div>
			</div>

			<div class="flex gap-2">
				<button
					onclick={() => (showOpdResponseModal = true)}
					class="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-95"
				>
					Kirim Jawaban OPD
				</button>
			</div>
		</header>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<div class="space-y-8 lg:col-span-2">
				<section
					aria-labelledby="applicant-info"
					class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<h2 id="applicant-info" class="mb-6 flex items-center gap-2 text-lg font-bold">
						<span class="h-6 w-1.5 rounded-full bg-blue-600"></span>
						Informasi Pemohon
					</h2>
					<div class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
								>Nama Lengkap</span
							>
							<p class="mt-1 font-semibold text-slate-900 dark:text-white">
								{pengajuan.nama_pemohon}
							</p>
						</div>
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase">Email</span>
							<p class="mt-1 font-semibold text-slate-900 dark:text-white">
								{pengajuan.email_pemohon}
							</p>
						</div>
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
								>No. Telepon</span
							>
							<p class="mt-1 font-semibold text-slate-900 dark:text-white">
								{pengajuan.no_telp_pemohon}
							</p>
						</div>
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
								>Domisili</span
							>
							<p class="mt-1 font-semibold text-slate-900 dark:text-white">
								{pengajuan.domisili_pemohon.nama_daerah} - {pengajuan.domisili_pemohon.provinsi}
							</p>
						</div>
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
								>Pekerjaan</span
							>
							<p class="mt-1 font-semibold text-slate-900 dark:text-white">
								{pengajuan.pekerjaan.nama_pekerjaan}
							</p>
						</div>
						<div class="md:col-span-2">
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase">Alamat</span>
							<p class="mt-1 font-semibold text-slate-900 dark:text-white">
								{pengajuan.alamat_pemohon}
							</p>
						</div>
					</div>
				</section>

				<!-- <section
					aria-labelledby="applicant-proxy"
					class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<h2 id="applicant-proxy" class="mb-6 flex items-center gap-2 text-lg font-bold">
						<span class="h-6 w-1.5 rounded-full bg-blue-600"></span>
						Informasi Kuasa Pemohon
					</h2>
					<div class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
								>Nama Lengkap</span
							>
							<p class="mt-1 font-semibold text-slate-900 dark:text-white">
								{pengajuan.nama_kuasa}
							</p>
						</div>
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase">Email</span>
							<p class="mt-1 font-semibold text-slate-900 dark:text-white">
								{pengajuan.email_kuasa}
							</p>
						</div>
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
								>No. Telepon</span
							>
							<p class="mt-1 font-semibold text-slate-900 dark:text-white">
								{pengajuan.no_telp_kuasa}
							</p>
						</div>
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
								>Domisili</span
							>
							<p class="mt-1 font-semibold text-slate-900 dark:text-white">
								{pengajuan.domisili_kuasa.nama_daerah} - {pengajuan.domisili_kuasa.provinsi}
							</p>
						</div>
					</div>
				</section> -->

				<section
					aria-labelledby="objection-content"
					class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<h2 id="objection-content" class="mb-6 flex items-center gap-2 text-lg font-bold">
						<span class="h-6 w-1.5 rounded-full bg-red-600"></span>
						Detail Keberatan
					</h2>
					<div class="space-y-6">
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
								>Alasan Pengajuan</span
							>
							<ul class="mt-2 space-y-2">
								{#each pengajuan.alasan_pengajuan as alasan}
									<li class="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
										<svg
											class="mt-0.5 h-5 w-5 text-red-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
											/></svg
										>
										{alasan.alasan}
									</li>
								{/each}
							</ul>
						</div>
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
								>Kasus Posisi</span
							>
							<div
								class="prose mt-2 max-w-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm prose-slate dark:border-slate-700 dark:bg-slate-900 dark:prose-invert"
							>
								{pengajuan.kasus}
							</div>
						</div>
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
								>Tujuan Penggunaan</span
							>
							<p class="mt-1 text-sm text-slate-700 dark:text-slate-300">{pengajuan.tujuan}</p>
						</div>
					</div>
				</section>
			</div>

			<div class="space-y-8">
				<div
					class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<span class="mb-4 block text-xs font-bold tracking-widest text-slate-400 uppercase"
						>Status Pengajuan</span
					>
					<div
						class={`rounded-xl border-2 py-4 text-center text-lg font-black ${getStatusClass(pengajuan.status)}`}
					>
						{pengajuan.status_label}
					</div>
					<div class="mt-6 space-y-4">
						<div class="flex justify-between text-sm">
							<span class="text-slate-500">Dikirim Pada</span>
							<span class="font-semibold"
								>{new Date(pengajuan.created_at).toLocaleDateString('id-ID', {
									dateStyle: 'long'
								})}</span
							>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-slate-500">Metode Respon</span>
							<span class="font-semibold capitalize">{pengajuan.metode_respon}</span>
						</div>
					</div>
				</div>

				<div
					class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<span class="mb-4 block text-xs font-bold tracking-widest text-slate-400 uppercase">
						Respon
					</span>
				</div>
			</div>
		</div>
	</div>
</main>

<PengajuanDialog bind:open={showOpdResponseModal} title="Kirim Jawaban OPD">
	<form onsubmit={handleOpdResponse} class="space-y-4">
		<div>
			<label
				for="opd-status"
				class="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300"
			>
				Status Tindak Lanjut
			</label>
			<select
				id="opd-status"
				bind:value={opdStatus}
				class="w-full rounded-xl border-slate-200 focus:border-emerald-600 focus:ring-emerald-600 dark:border-slate-700 dark:bg-slate-900"
			>
				<option value="selesai">Selesai / Sudah Dijawab</option>
				<option value="diproses">Sedang Diproses</option>
				<option value="ditolak">Ditolak / Bukan Kewenangan</option>
			</select>
		</div>

		<div>
			<label
				for="opd-feedback"
				class="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300"
			>
				Isi Jawaban/Respon
			</label>
			<textarea
				id="opd-feedback"
				bind:value={opdResponseText}
				rows="5"
				required
				placeholder="Tuliskan detail jawaban atau tindak lanjut dari OPD Anda..."
				class="w-full rounded-xl border-slate-200 focus:border-emerald-600 focus:ring-emerald-600 dark:border-slate-700 dark:bg-slate-900"
			></textarea>
		</div>

		<div>
			<label
				for="file-upload"
				class="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300"
			>
				Lampiran File (Opsional)
			</label>
			<input
				id="file-upload"
				type="file"
				accept=".pdf,.doc,.docx,.jpg,.png"
				onchange={(e) => (opdFile = e.currentTarget.files?.[0] || null)}
				class="w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-700 dark:file:text-slate-200"
			/>
			<p class="mt-1 text-xs text-slate-500">Maksimal 5MB (PDF, DOC, JPG, PNG)</p>
		</div>

		<div class="flex justify-end gap-2">
			<button
				type="button"
				onclick={() => (showOpdResponseModal = false)}
				class="px-4 py-2 text-sm font-bold text-slate-500"
			>
				Batal
			</button>
			<button
				type="submit"
				disabled={isSubmitting}
				class="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
			>
				{isSubmitting ? 'Mengirim...' : 'Kirim Jawaban'}
			</button>
		</div>
	</form>
</PengajuanDialog>

<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'BERHASIL' : 'GAGAL'}
	description={notificationMessage}
/>
