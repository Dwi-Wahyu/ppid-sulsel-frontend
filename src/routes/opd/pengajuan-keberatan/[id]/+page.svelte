<script lang="ts">
	import PengajuanDialog from '$lib/components/PengajuanDialog.svelte';
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

	// Fungsi untuk mengirim respon ke backend [cite: 7, 9]
	async function handleOpdResponse(e: Event) {
		e.preventDefault();
		if (!opdResponseText) return alert('Isi pesan respon terlebih dahulu');
		if (!userDisposisi) return alert('Data disposisi tidak ditemukan.');

		isSubmitting = true;

		// Menggunakan FormData karena terdapat upload file [cite: 9]
		const formData = new FormData();
		formData.append('respon', opdResponseText);
		formData.append('status', opdStatus);
		if (opdFile) {
			formData.append('file', opdFile);
		}

		try {
			// Endpoint sesuai dengan PengajuanKeberatanController.php @responStore [cite: 10]
			await api.post(
				`/admin/pengajuan-keberatan/disposisi/${userDisposisi.id_disposisi}/respon`,
				formData
			);

			showOpdResponseModal = false;
			opdResponseText = '';
			opdFile = null;

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

	function getStatusClass(status: string) {
		switch (status) {
			case 'n':
				return 'bg-amber-100 text-amber-800 border-amber-200';
			case 'y':
				return 'bg-emerald-100 text-emerald-800 border-emerald-200';
			case 'd':
				return 'bg-purple-100 text-purple-800 border-purple-200';
			case 'a':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			default:
				return 'bg-slate-100 text-slate-800 border-slate-200';
		}
	}
</script>

<svelte:head>
	<title>Detail Pengajuan - OPD Response</title>
</svelte:head>

<main class="min-h-screen p-4 md:p-8">
	<div class="mx-auto max-w-6xl">
		<header class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
			<div class="flex items-center gap-4">
				<a
					href="/admin/pengajuan-keberatan"
					title="Kembali"
					class="rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800"
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
				</div>
			</div>

			<div class="flex gap-2">
				{#if userDisposisi && userDisposisi.status !== 'selesai'}
					<button
						onclick={() => (showOpdResponseModal = true)}
						class="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700"
					>
						Kirim Jawaban OPD
					</button>
				{/if}
			</div>
		</header>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<div class="space-y-8 lg:col-span-2">
				<section
					class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<h2 class="mb-6 flex items-center gap-2 text-lg font-bold">
						<span class="h-6 w-1.5 rounded-full bg-blue-600"></span>
						Informasi Pemohon
					</h2>
					<div class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
								>Nama Pemohon</span
							>
							<p class="mt-1 font-semibold text-slate-900 dark:text-white">
								{pengajuan.nama_pemohon}
							</p>
						</div>
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase">Email</span>
							<p class="mt-1 font-semibold text-slate-900 dark:text-white">
								{pengajuan.email}
							</p>
						</div>
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
								>Pekerjaan</span
							>
							<p class="mt-1 font-semibold text-slate-900 dark:text-white">
								{pengajuan.pekerjaan?.nama_pekerjaan || '-'}
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

				<section
					class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<h2 class="mb-6 flex items-center gap-2 text-lg font-bold">
						<span class="h-6 w-1.5 rounded-full bg-red-600"></span>
						Isi Keberatan
					</h2>
					<div class="space-y-6">
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
								>Kasus Posisi</span
							>
							<div
								class="prose mt-2 max-w-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
							>
								{pengajuan.kasus}
							</div>
						</div>
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
								>Alasan Keberatan</span
							>
							<ul class="mt-2 space-y-2">
								{#each pengajuan.alasan_pengajuan as alasan}
									<li
										class="flex items-center gap-2 text-sm text-slate-700 italic dark:text-slate-300"
									>
										• {alasan.alasan}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</section>
			</div>

			<div class="space-y-8">
				<div
					class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<span class="mb-4 block text-xs font-bold tracking-widest text-slate-400 uppercase"
						>Status Global</span
					>
					<div
						class={`rounded-xl border-2 py-4 text-center text-lg font-black ${getStatusClass(pengajuan.status)}`}
					>
						{pengajuan.status_label}
					</div>
				</div>

				{#if userDisposisi && userDisposisi.respon && userDisposisi.respon.length > 0}
					<div
						class="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-6 shadow-sm dark:border-emerald-900/50 dark:bg-slate-800"
					>
						<h3
							class="mb-4 text-sm font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400"
						>
							Jawaban Unit Anda
						</h3>
						<div class="space-y-4">
							<p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
								{userDisposisi.respon[0].isi_respon}
							</p>
							{#if userDisposisi.respon[0].file}
								<a
									href="{PUBLIC_BACKEND_URL}/storage/{userDisposisi.respon[0].file}"
									target="_blank"
									class="flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline"
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
							<div class="border-t border-emerald-100 pt-4 dark:border-emerald-900/30">
								<span class="text-[10px] text-slate-400">STATUS TINDAK LANJUT:</span>
								<span class="ml-1 text-xs font-black text-emerald-600 uppercase"
									>{userDisposisi.status}</span
								>
							</div>
						</div>
					</div>
				{/if}

				<TrackingCardPengajuan disposisi={pengajuan.disposisi} />
			</div>
		</div>
	</div>
</main>

<PengajuanDialog bind:open={showOpdResponseModal} title="Kirim Jawaban/Respon">
	<form onsubmit={handleOpdResponse} class="space-y-5">
		<div>
			<label for="opd-status" class="mb-2 block text-xs font-bold text-slate-500 uppercase"
				>Status Penyelesaian</label
			>
			<select
				id="opd-status"
				bind:value={opdStatus}
				class="w-full rounded-xl border-slate-200 bg-white p-3 text-sm focus:border-emerald-600 focus:ring-emerald-600 dark:border-slate-700 dark:bg-slate-900"
			>
				<option value="selesai">Selesai / Sudah Dijawab</option>
				<option value="diproses">Masih Dalam Proses</option>
				<option value="ditolak">Bukan Kewenangan Kami</option>
			</select>
		</div>

		<div>
			<label for="opd-feedback" class="mb-2 block text-xs font-bold text-slate-500 uppercase"
				>Isi Tanggapan Resmi</label
			>
			<textarea
				id="opd-feedback"
				bind:value={opdResponseText}
				rows="6"
				required
				placeholder="Berikan penjelasan detail terkait tindak lanjut keberatan ini..."
				class="w-full rounded-xl border-slate-200 p-3 text-sm focus:border-emerald-600 focus:ring-emerald-600 dark:border-slate-700 dark:bg-slate-900"
			></textarea>
		</div>

		<div>
			<label for="file-upload" class="mb-2 block text-xs font-bold text-slate-500 uppercase"
				>Unggah Bukti/Dokumen (Opsional)</label
			>
			<input
				id="file-upload"
				type="file"
				accept=".pdf,.doc,.docx,.jpg,.png"
				onchange={(e) => (opdFile = e.currentTarget.files?.[0] || null)}
				class="w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-800 dark:file:text-slate-300"
			/>
			<p class="mt-2 text-[10px] text-slate-400 italic">
				Maksimal 5MB. Format: PDF, DOC, JPG, atau PNG.
			</p>
		</div>

		<div class="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
			<button
				type="button"
				onclick={() => (showOpdResponseModal = false)}
				class="text-sm font-bold text-slate-400 hover:text-slate-600">Batal</button
			>
			<button
				type="submit"
				disabled={isSubmitting}
				class="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 disabled:opacity-50"
			>
				{isSubmitting ? 'Sedang Mengirim...' : 'Kirim Jawaban'}
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
