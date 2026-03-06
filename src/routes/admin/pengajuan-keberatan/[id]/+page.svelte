<script lang="ts">
	import PengajuanDialog from '$lib/components/PengajuanDialog.svelte';
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

	// Perbaikan: Inisialisasi dengan existing_skpd_ids agar otomatis tercentang
	let selectedSkpd = $state<string[]>(data.extra.existing_skpd_ids || []);

	let catatanDisposisi = $state('');
	let searchSkpd = $state('');
	let isSubmitting = $state(false);

	// Notification State
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	const filteredSkpd = $derived(
		all_skpd.filter((s: { nm_skpd: string }) =>
			s.nm_skpd.toLowerCase().includes(searchSkpd.toLowerCase())
		)
	);

	// Fungsi untuk mengirim Disposisi
	async function handleDisposisi() {
		if (selectedSkpd.length === 0) return alert('Pilih minimal satu OPD');
		isSubmitting = true;
		try {
			await api.post(`/admin/pengajuan-keberatan/${pengajuan.id_pengajuan}/disposisi`, {
				skpd_ids: selectedSkpd,
				catatan: catatanDisposisi || 'Mohon tindak lanjuti pengajuan keberatan ini.'
			});

			showDisposisiModal = false;
			catatanDisposisi = '';
			// Tidak perlu mengosongkan selectedSkpd agar tetap sinkron dengan data terbaru setelah invalidate
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
			showResponseModal = false;
			feedbackText = '';
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
	<title>Detail Pengajuan - {pengajuan.no_pendaftaran}</title>
</svelte:head>

<main class="min-h-screen p-4 md:p-8">
	<div class="mx-auto max-w-6xl">
		<header class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
			<div class="flex items-center gap-4">
				<a
					title="Kembali"
					href="/admin/pengajuan-keberatan"
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
					<p class="font-mono text-sm tracking-wider text-slate-500 uppercase">
						{pengajuan.no_pendaftaran}
					</p>
				</div>
			</div>

			<div class="flex gap-2">
				<button
					onclick={() => (showDisposisiModal = true)}
					class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
				>
					{pengajuan.disposisi.length > 0 ? 'Tambah Disposisi' : 'Disposisi ke OPD'}
				</button>

				{#if pengajuan.status !== 'd' && pengajuan.status !== 'a'}
					<button
						onclick={() => (showResponseModal = true)}
						class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700"
					>
						Beri Tanggapan
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
								>Pekerjaan</span
							>
							<p class="mt-1 font-semibold text-slate-900 dark:text-white">
								{pengajuan.pekerjaan.nama_pekerjaan}
							</p>
						</div>
						<div>
							<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
								>Domisili</span
							>
							<p class="mt-1 font-semibold text-slate-900 dark:text-white">
								{pengajuan.domisili_pemohon?.nama_daerah || '-'}, {pengajuan.domisili_pemohon
									?.provinsi || '-'}
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

				{#if pengajuan.nama_kuasa}
					<section
						class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
					>
						<h2 class="mb-6 flex items-center gap-2 text-lg font-bold">
							<span class="h-6 w-1.5 rounded-full bg-amber-500"></span>
							Informasi Kuasa
						</h2>
						<div class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
							<div>
								<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
									>Nama Kuasa</span
								>
								<p class="mt-1 font-semibold text-slate-900 dark:text-white">
									{pengajuan.nama_kuasa}
								</p>
							</div>
							<div>
								<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
									>No. Telp Kuasa</span
								>
								<p class="mt-1 font-semibold text-slate-900 dark:text-white">
									{pengajuan.no_telp_kuasa || '-'}
								</p>
							</div>
							<div>
								<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
									>Domisili Kuasa</span
								>
								<p class="mt-1 font-semibold text-slate-900 dark:text-white">
									{pengajuan.domisili_kuasa?.nama_daerah || '-'}, {pengajuan.domisili_kuasa
										?.provinsi || '-'}
								</p>
							</div>
							<div class="md:col-span-2">
								<span class="text-xs font-bold tracking-widest text-slate-400 uppercase"
									>Alamat Kuasa</span
								>
								<p class="mt-1 font-semibold text-slate-900 dark:text-white">
									{pengajuan.alamat_kuasa}
								</p>
							</div>
						</div>
					</section>
				{/if}

				<section
					class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<h2 class="mb-6 flex items-center gap-2 text-lg font-bold">
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
								class="prose mt-2 max-w-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
							>
								{pengajuan.kasus}
							</div>
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

					{#if pengajuan.disposisi.length > 0}
						<div class="mt-6 border-t border-slate-100 pt-6 dark:border-slate-700">
							<span class="mb-3 block text-xs font-bold tracking-widest text-slate-400 uppercase"
								>Didisposisikan Ke:</span
							>
							<div class="space-y-2">
								{#each pengajuan.disposisi as d}
									<div
										class="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-xs font-semibold dark:bg-slate-900"
									>
										<div class="h-2 w-2 rounded-full bg-purple-500"></div>
										<span class="text-slate-700 dark:text-slate-300"
											>{d.skpd?.nm_skpd || 'OPD Terkait'}</span
										>
									</div>
								{/each}
							</div>
						</div>
					{/if}

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

				<TrackingCardPengajuan disposisi={pengajuan.disposisi} />
			</div>
		</div>
	</div>
</main>

<PengajuanDialog bind:open={showResponseModal} title="Berikan Tanggapan">
	<form onsubmit={handleFeedback} class="space-y-4">
		<div>
			<label for="feedback" class="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300"
				>Pesan Tanggapan</label
			>
			<textarea
				id="feedback"
				bind:value={feedbackText}
				rows="5"
				required
				placeholder="Tulis alasan..."
				class="w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
			></textarea>
		</div>
		<div class="flex justify-end gap-2">
			<button
				type="button"
				onclick={() => (showResponseModal = false)}
				class="px-4 py-2 text-sm font-bold text-slate-500">Batal</button
			>
			<button
				type="submit"
				disabled={isSubmitting}
				class="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-lg disabled:opacity-50"
			>
				{isSubmitting ? 'Mengirim...' : 'Kirim Tanggapan'}
			</button>
		</div>
	</form>
</PengajuanDialog>

<PengajuanDialog bind:open={showDisposisiModal} title="Disposisi ke OPD">
	<div class="space-y-4">
		<div class="relative">
			<input
				type="text"
				bind:value={searchSkpd}
				placeholder="Cari OPD..."
				class="w-full rounded-xl border-slate-200 pl-4 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
			/>
		</div>
		<div
			class="max-h-60 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2 dark:border-slate-700"
		>
			{#each filteredSkpd as skpd}
				<label
					class="flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50"
				>
					<input
						type="checkbox"
						value={skpd.id_skpd}
						bind:group={selectedSkpd}
						class="rounded text-blue-600"
					/>
					<span class="text-sm font-medium dark:text-slate-300">{skpd.nm_skpd}</span>
				</label>
			{/each}
		</div>
		<div>
			<label for="catatan" class="mb-1 block text-xs font-bold text-slate-500 uppercase"
				>Catatan Disposisi</label
			>
			<textarea
				id="catatan"
				bind:value={catatanDisposisi}
				rows="3"
				class="w-full rounded-xl border-slate-200 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
			></textarea>
		</div>
		<div class="flex items-center justify-between pt-2">
			<span class="text-xs font-bold text-slate-500">{selectedSkpd.length} OPD Terpilih</span>
			<div class="flex gap-2">
				<button
					type="button"
					onclick={() => (showDisposisiModal = false)}
					class="px-4 py-2 text-sm font-bold text-slate-500">Batal</button
				>
				<button
					type="button"
					class="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-lg"
					onclick={handleDisposisi}
					disabled={isSubmitting || selectedSkpd.length === 0}
				>
					{isSubmitting ? 'Memproses...' : 'Kirim Disposisi'}
				</button>
			</div>
		</div>
	</div>
</PengajuanDialog>

<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'BERHASIL' : 'GAGAL'}
	description={notificationMessage}
/>
