<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api'; // Helper Proxy API
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	interface SKPD {
		id_skpd: string;
		nm_skpd: string;
	}

	// State Management
	let judul = $state('');
	let deskripsi = $state('');
	let id_skpd = $state('');
	let verify = $state('n');

	/**
	 * PERBAIKAN: Pastikan menangani berkas dari FilePond dengan benar.
	 * Laravel mengharapkan berkas fisik tunggal.
	 */
	let img_berita = $state<any>(null);

	let skpdList = $state<SKPD[]>([]);
	let isLoading = $state(true);
	let isSaving = $state(false);
	let showConfirm = $state(false);
	let errors = $state<Record<string, string[]>>({});

	let notification = $state({
		show: false,
		type: 'success' as 'success' | 'error',
		message: ''
	});

	onMount(async () => {
		await fetchSKPD();
	});

	async function fetchSKPD() {
		try {
			const result = await api.get('/admin/skpd');
			if (result.success) skpdList = result.data || [];
		} finally {
			isLoading = false;
		}
	}

	async function handleSubmit() {
		isSaving = true;
		showConfirm = false;
		errors = {};

		try {
			const data = new FormData();
			data.append('judul', judul);
			data.append('deskripsi', deskripsi);
			data.append('id_skpd', id_skpd);
			data.append('verify', verify);

			/**
			 * LOGIKA UNGGAH:
			 * Jika FilePond mengembalikan array, ambil indeks pertama.
			 * Laravel mewajibkan 'img_berita' berupa image.
			 */
			if (img_berita) {
				const fileToUpload = Array.isArray(img_berita) ? img_berita[0] : img_berita;
				data.append('img_berita', fileToUpload);
			}

			if (img_berita && img_berita.length > 0) {
				// Mengambil file asli dari item pertama FilePond
				const rawFile = img_berita[0].file;
				data.append('img_berita', rawFile);
			}

			// Kirim via helper api.post yang menangani FormData secara otomatis
			const result = await api.post('/admin/berita', data);

			if (result.success) {
				notification = {
					show: true,
					type: 'success',
					message: 'Berita dan gambar berhasil disimpan.'
				};
				setTimeout(() => goto('/admin/berita'), 1500);
			}
		} catch (error: any) {
			console.error('Upload Error:', error);
			if (error.errors) {
				errors = error.errors;
				notification = {
					show: true,
					type: 'error',
					message: errors.img_berita ? errors.img_berita[0] : 'Gagal memvalidasi data.'
				};
			} else {
				notification = {
					show: true,
					type: 'error',
					message: error.message || 'Terjadi kesalahan sistem.'
				};
			}
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>Tambah Berita - Admin PPID</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-5xl">
		<header class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 class="text-3xl font-black text-slate-800 uppercase dark:text-white">Tambah Berita</h1>
				<p class="text-sm font-medium text-slate-500">
					Publikasikan informasi terbaru ke masyarakat.
				</p>
			</div>
			<a
				href="/admin/berita"
				class="rounded-xl border-2 border-slate-100 bg-white px-6 py-3 text-sm font-bold text-slate-400 transition-colors hover:text-slate-600 dark:border-slate-800 dark:bg-slate-800"
			>
				KEMBALI KE DAFTAR
			</a>
		</header>

		<div
			class="rounded-4xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800"
		>
			<form
				onsubmit={(e) => {
					e.preventDefault();
					showConfirm = true;
				}}
				class="space-y-8 p-10"
			>
				<div class="space-y-2">
					<label
						for="judul"
						class="block text-[10px] font-black tracking-widest text-slate-500 uppercase"
						>Judul Berita</label
					>
					<input
						type="text"
						id="judul"
						bind:value={judul}
						required
						class="w-full rounded-2xl border-2 {errors.judul
							? 'border-red-400'
							: 'border-slate-100'} px-5 py-4 text-sm font-bold outline-none focus:border-ppid-primary dark:bg-slate-900"
					/>
					{#if errors.judul}<p class="text-xs font-bold text-red-500">{errors.judul[0]}</p>{/if}
				</div>

				<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
					<div class="space-y-2">
						<label
							for="id_skpd"
							class="block text-[10px] font-black tracking-widest text-slate-500 uppercase"
							>SKPD Pengirim</label
						>
						<select
							id="id_skpd"
							bind:value={id_skpd}
							required
							class="w-full rounded-2xl border-2 {errors.id_skpd
								? 'border-red-400'
								: 'border-slate-100'} px-5 py-4 text-sm font-bold outline-none focus:border-ppid-primary dark:bg-slate-900 dark:text-white"
						>
							<option value="">-- Pilih Unit Kerja --</option>
							{#each skpdList as skpd}<option value={skpd.id_skpd}>{skpd.nm_skpd}</option>{/each}
						</select>
					</div>

					<div class="space-y-2">
						<label
							for="verify"
							class="block text-[10px] font-black tracking-widest text-slate-500 uppercase"
							>Status Verifikasi</label
						>
						<select
							id="verify"
							bind:value={verify}
							class="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-bold outline-none focus:border-ppid-primary dark:bg-slate-900 dark:text-white"
						>
							<option value="n">Draft / Belum Verifikasi</option>
							<option value="y">Terbit / Verifikasi</option>
							<option value="t">Tolak</option>
						</select>
					</div>
				</div>

				<div class="space-y-2">
					<h1 class="block text-[10px] font-black tracking-widest text-slate-500 uppercase">
						Gambar Utama (Max 2MB)
					</h1>
					<div
						class="rounded-3xl border-2 {errors.img_berita
							? 'border-red-400'
							: 'border-dashed border-slate-200'} p-2 dark:border-slate-700"
					>
						<FilePond
							bind:value={img_berita}
							name="img_berita"
							acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
							label="Klik atau seret gambar ke sini"
						/>
					</div>
					{#if errors.img_berita}<p class="text-xs font-bold text-red-500">
							{errors.img_berita[0]}
						</p>{/if}
				</div>

				<div class="space-y-2">
					<label
						for="deskripsi"
						class="block text-[10px] font-black tracking-widest text-slate-500 uppercase"
						>Isi Berita</label
					>
					<div class={errors.deskripsi ? 'rounded-2xl border-2 border-red-400' : ''}>
						<TinyMCE bind:value={deskripsi} id="deskripsi" height={400} />
					</div>
				</div>

				<footer class="flex justify-end gap-4 border-t border-slate-50 pt-10 dark:border-slate-700">
					<button
						type="button"
						onclick={() => goto('/admin/berita')}
						class="px-8 py-4 text-xs font-black text-slate-400 uppercase transition-colors hover:text-slate-600"
						>Batal</button
					>
					<button
						type="submit"
						disabled={isSaving}
						class="rounded-2xl bg-ppid-primary px-12 py-4 text-xs font-black text-white shadow-xl shadow-ppid-primary/30 transition-all hover:opacity-90 disabled:opacity-50"
					>
						{isSaving ? 'MEMPROSES...' : 'SIMPAN BERITA'}
					</button>
				</footer>
			</form>
		</div>
	</div>
</div>

<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan Berita?"
	description="Pastikan gambar dan konten sudah sesuai standar publikasi."
	theme="primary"
	onConfirm={handleSubmit}
	isLoading={isSaving}
/>
<NotificationDialog
	bind:show={notification.show}
	theme={notification.type}
	title={notification.type === 'success' ? 'BERHASIL' : 'GAGAL'}
	description={notification.message}
/>
