<script lang="ts">
	import PengajuanDialog from '$lib/components/PengajuanDialog.svelte';
	import TrackingCardPengajuan from '$lib/components/TrackingCardPengajuan.svelte';
	import { invalidateAll } from '$app/navigation';
	import { api } from '$lib/api.js';

	let { data } = $props();
	const pengajuan = $derived(data.pengajuan);
	const all_skpd = $derived(data.extra.all_skpd);

	// Form States
	let showResponseModal = $state(false);
	let showDisposisiModal = $state(false);
	let feedbackText = $state('');
	let selectedSkpd = $state<string[]>([]);
	let catatanDisposisi = $state('');
	let searchSkpd = $state('');
	let isSubmitting = $state(false);

	const filteredSkpd = $derived(
		all_skpd.filter((s: { nm_skpd: string }) =>
			s.nm_skpd.toLowerCase().includes(searchSkpd.toLowerCase())
		)
	);

	// Fungsi untuk mengirim Disposisi ke banyak OPD
	async function handleDisposisi() {
		if (selectedSkpd.length === 0) return alert('Pilih minimal satu OPD');

		isSubmitting = true;
		try {
			await api.post(`/admin/pengajuan-keberatan/${pengajuan.id_pengajuan}/disposisi`, {
				skpd_ids: selectedSkpd,
				catatan: 'Mohon tindak lanjuti pengajuan keberatan ini.'
			});

			alert('Disposisi berhasil dikirim');
			showDisposisiModal = false;
			catatanDisposisi = '';
			selectedSkpd = [];
			await invalidateAll(); // Refresh data halaman
		} catch (err: any) {
			alert(err.message || 'Gagal mengirim disposisi');
		} finally {
			isSubmitting = false;
		}
	}

	// Fungsi untuk memberikan Tanggapan/Feedback akhir kepada pemohon
	async function handleFeedback(e: Event) {
		e.preventDefault();
		if (!feedbackText) return alert('Isi pesan tanggapan');

		isSubmitting = true;
		try {
			await api.post(`/admin/pengajuan-keberatan/${pengajuan.id_pengajuan}/feedback`, {
				feedback: feedbackText
			});

			alert('Tanggapan berhasil dikirim ke pemohon');
			showResponseModal = false;
			catatanDisposisi = '';
			feedbackText = '';
			await invalidateAll();
		} catch (err: any) {
			alert(err.message || 'Gagal mengirim tanggapan');
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
					onclick={() => (showDisposisiModal = true)}
					class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold transition-all hover:shadow-md active:scale-95 dark:border-slate-700 dark:bg-slate-800"
				>
					Disposisi ke OPD
				</button>
				<button
					onclick={() => (showResponseModal = true)}
					class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
				>
					Beri Tanggapan
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

				<TrackingCardPengajuan disposisi={pengajuan.disposisi} />
			</div>
		</div>
	</div>
</main>

<PengajuanDialog bind:open={showResponseModal} title="Berikan Tanggapan">
	<form onsubmit={handleFeedback} class="space-y-4">
		<div>
			<label for="feedback" class="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
				Pesan Tanggapan
			</label>
			<textarea
				id="feedback"
				bind:value={feedbackText}
				rows="5"
				required
				placeholder="Tulis alasan diterima atau ditolaknya keberatan ini..."
				class="w-full rounded-xl border-slate-200 focus:border-blue-600 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900"
			></textarea>
		</div>
		<div class="flex justify-end gap-2">
			<button
				type="button"
				onclick={() => (showResponseModal = false)}
				class="px-4 py-2 text-sm font-bold text-slate-500"
			>
				Batal
			</button>
			<button
				type="submit"
				disabled={isSubmitting}
				class="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20 disabled:opacity-50"
			>
				{isSubmitting ? 'Mengirim...' : 'Kirim Tanggapan'}
			</button>
		</div>
	</form>
</PengajuanDialog>

<PengajuanDialog bind:open={showDisposisiModal} title="Disposisi ke OPD">
	<div class="space-y-4">
		<div class="relative">
			<span
				class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg
				>
			</span>
			<input
				type="text"
				bind:value={searchSkpd}
				placeholder="Cari OPD..."
				class="w-full rounded-xl border-slate-200 pl-10 text-sm dark:border-slate-700 dark:bg-slate-900"
			/>
		</div>
		<div
			class="max-h-60 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2 dark:border-slate-700"
		>
			{#each filteredSkpd as skpd}
				<label
					class="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
				>
					<input
						type="checkbox"
						value={skpd.id_skpd}
						bind:group={selectedSkpd}
						class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
					/>
					<span class="text-sm font-medium">{skpd.nm_skpd}</span>
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
				placeholder="Tambahkan instruksi khusus untuk OPD..."
				class="w-full rounded-xl border-slate-200 text-sm focus:border-blue-600 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900"
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
					class="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20"
					onclick={handleDisposisi}
					disabled={isSubmitting || selectedSkpd.length === 0}
				>
					{isSubmitting ? 'Memproses...' : 'Kirim Disposisi'}
				</button>
			</div>
		</div>
	</div>
</PengajuanDialog>
