<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	let { data } = $props();

	let user = $derived(data.user);

	// Form state
	let judul = $state('');
	let deskripsi = $state('');
	let img_berita = $state<any>(null);
	let isSaving = $state(false);
	let showConfirm = $state(false);
	let errors = $state<Record<string, string[]>>({});

	// Validasi sisi klien sebelum membuka dialog konfirmasi
	function validate(): boolean {
		const newErrors: Record<string, string[]> = {};
		if (!judul.trim()) newErrors.judul = ['Judul berita wajib diisi.'];
		if (!img_berita || img_berita.length === 0)
			newErrors.img_berita = ['Thumbnail / gambar berita wajib diunggah.'];
		if (!deskripsi.trim()) newErrors.deskripsi = ['Isi berita wajib diisi.'];
		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	// Notification state
	let notification = $state({
		show: false,
		type: 'success' as 'success' | 'error',
		message: ''
	});

	async function handleSubmit() {
		isSaving = true;
		showConfirm = false;
		errors = {};

		try {
			const formData = new FormData();
			formData.append('judul', judul);
			formData.append('deskripsi', deskripsi);
			formData.append('id_skpd', user?.id_skpd ?? '');
			formData.append('verify', 'n');

			/**
			 * LOGIKA UNGGAH:
			 * Jika FilePond mengembalikan array, ambil indeks pertama.
			 */
			if (img_berita) {
				const fileToUpload = Array.isArray(img_berita) ? img_berita[0] : img_berita;
				formData.append('img_berita', fileToUpload);
			}

			if (img_berita && img_berita.length > 0) {
				// Mengambil file asli dari item pertama FilePond
				const rawFile = img_berita[0].file;
				formData.append('img_berita', rawFile);
			}

			const result = await api.post('/admin/berita', formData);

			if (result.success) {
				notification = {
					show: true,
					type: 'success',
					message: 'Berita berhasil disimpan dan menunggu verifikasi admin.'
				};
				setTimeout(() => goto('/opd/berita'), 1600);
			}
		} catch (error: any) {
			console.error('Create Error:', error);
			if (error.errors) {
				errors = error.errors;
				notification = {
					show: true,
					type: 'error',
					message: 'Periksa kembali data yang diisi.'
				};
			} else {
				notification = {
					show: true,
					type: 'error',
					message: error.message || 'Terjadi kesalahan. Coba lagi.'
				};
			}
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>Tambah Berita - OPD</title>
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
				href="/opd/berita"
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
					if (validate()) showConfirm = true;
				}}
				class="space-y-8 p-10"
			>
				<!-- Judul -->
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
						placeholder="Masukkan judul berita..."
						class="w-full rounded-2xl border-2 {errors.judul
							? 'border-red-400'
							: 'border-slate-100'} px-5 py-4 text-sm font-bold outline-none focus:border-ppid-primary dark:bg-slate-900 dark:text-white"
					/>
					{#if errors.judul}<p class="text-xs font-bold text-red-500">{errors.judul[0]}</p>{/if}
				</div>

				<!-- Info SKPD (read-only) -->
				<div class="space-y-2">
					<p class="block text-[10px] font-black tracking-widest text-slate-500 uppercase">
						SKPD Pengirim
					</p>
					<div
						class="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900/50"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 shrink-0 text-slate-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/></svg
						>
						<span class="text-sm font-bold text-slate-700 dark:text-slate-200">
							{user?.skpd?.nm_skpd ?? 'SKPD tidak diketahui'}
						</span>
					</div>
				</div>

				<!-- Thumbnail -->
				<div class="space-y-2">
					<h2 class="block text-[10px] font-black tracking-widest text-slate-500 uppercase">
						Thumbnail (Max 20MB)
					</h2>

					<FilePond
						bind:value={img_berita}
						name="img_berita"
						acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg', 'image/webp']}
						label="Klik atau seret gambar ke sini"
					/>
					{#if errors.img_berita}<p class="text-xs font-bold text-red-500">
							{errors.img_berita[0]}
						</p>{/if}
				</div>

				<!-- Isi Berita -->
				<div class="space-y-2">
					<label
						for="deskripsi"
						class="block text-[10px] font-black tracking-widest text-slate-500 uppercase"
						>Isi Berita</label
					>
					<div class={errors.deskripsi ? 'rounded-2xl border-2 border-red-400' : ''}>
						<TinyMCE bind:value={deskripsi} id="deskripsi" height={400} />
					</div>
					{#if errors.deskripsi}<p class="text-xs font-bold text-red-500">
							{errors.deskripsi[0]}
						</p>{/if}
				</div>

				<footer class="flex justify-end gap-4 border-t border-slate-50 pt-10 dark:border-slate-700">
					<button
						type="button"
						onclick={() => goto('/opd/berita')}
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
	description="Berita akan dikirim dan menunggu verifikasi dari admin PPID."
	theme="primary"
	confirmText="Ya, Simpan"
	onConfirm={handleSubmit}
	isLoading={isSaving}
/>

<NotificationDialog
	bind:show={notification.show}
	theme={notification.type}
	title={notification.type === 'success' ? 'BERHASIL!' : 'GAGAL!'}
	description={notification.message}
/>
