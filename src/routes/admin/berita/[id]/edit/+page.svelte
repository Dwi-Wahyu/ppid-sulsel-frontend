<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL, PUBLIC_BACKEND_URL } from '$env/static/public';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import { api } from '$lib/api';
	import type { PageProps } from './$types';
	import SearchableSelect from '$lib/components/SearchableSelect.svelte';

	let { params }: PageProps = $props();

	// --- Types ---
	interface SKPD {
		id_skpd: string;
		nm_skpd: string;
	}

	interface Berita {
		id_berita: number;
		judul: string;
		deskripsi: string;
		img_berita: string | null;
		tgl_upload: string;
		verify: 'y' | 'n' | 't';
		id_skpd: string | null;
	}

	interface ApiResponse<T> {
		success: boolean;
		data: T;
		message?: string;
	}

	// --- State (Svelte 5 Runes) ---
	let judul = $state('');
	let deskripsi = $state('');
	let id_skpd = $state('');
	let verify = $state('n');
	let img_berita = $state<any>(null);
	let currentImage = $state<string | null>(null);
	let skpdList = $state<SKPD[]>([]);
	let isLoading = $state(true);
	let isSaving = $state(false);

	// Notification State
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Confirmation State
	let showConfirm = $state(false);

	onMount(async () => {
		await Promise.all([fetchBerita(), fetchSKPD()]);
	});

	async function fetchBerita() {
		try {
			// Menggunakan api.get untuk mengambil detail berita
			const result = (await api.get(`/admin/berita/${params.id}`)) as ApiResponse<Berita>;

			const data = result.data;

			judul = data.judul;
			deskripsi = data.deskripsi;
			id_skpd = data.id_skpd || '';
			verify = data.verify;
			currentImage = data.img_berita;
		} catch (error: any) {
			console.error('Gagal memuat berita:', error);
			notificationType = 'error';
			notificationMessage = error.message || 'Gagal memuat data berita';
			showNotification = true;
		}
	}

	async function fetchSKPD() {
		try {
			// Menggunakan api.get untuk mengambil daftar SKPD
			const result = await api.get('/admin/skpd');
			if (result.success) {
				skpdList = result.data || [];
			}
		} catch (error) {
			console.error('Gagal mengambil SKPD:', error);
		} finally {
			isLoading = false;
		}
	}

	async function handleSubmit() {
		isSaving = true;
		showConfirm = false;

		try {
			const formData = new FormData();
			formData.append('judul', judul);
			formData.append('deskripsi', deskripsi);
			formData.append('id_skpd', id_skpd);
			formData.append('verify', verify);

			// Laravel "Method Spoofing": Gunakan POST dengan _method=PUT untuk upload file
			formData.append('_method', 'PUT');

			// Logika pengambilan file dari FilePond (mengambil file asli)
			if (img_berita && img_berita.length > 0) {
				const fileToUpload = img_berita[0].file;
				formData.append('img_berita', fileToUpload);
			}

			const result = await api.post(`/admin/berita/${params.id}`, formData);

			if (result.success) {
				notificationType = 'success';
				notificationMessage = 'Berita berhasil diperbarui';
				showNotification = true;

				setTimeout(() => {
					goto('/admin/berita');
				}, 1500);
			}
		} catch (error: any) {
			console.error('Update Error:', error);
			notificationType = 'error';
			notificationMessage = error.message || 'Terjadi kesalahan saat menyimpan data';
			showNotification = true;
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>Edit Berita - Admin PPID</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<div
		class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<div class="border-b border-slate-100 p-6 dark:border-slate-700">
			<h3 class="text-lg font-bold text-slate-800 dark:text-white">Form Edit Berita</h3>
		</div>

		{#if isLoading}
			<div class="flex flex-col items-center justify-center gap-3 p-12">
				<div
					class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
				></div>
				<p class="text-sm text-slate-500">Memuat data berita...</p>
			</div>
		{:else}
			<form
				onsubmit={(e) => {
					e.preventDefault();
					showConfirm = true; // Munculkan dialog konfirmasi sebelum submit
				}}
				class="space-y-6 p-6"
			>
				<div class="space-y-2">
					<label for="judul" class="text-sm font-semibold text-slate-700 dark:text-slate-300"
						>Judul Berita</label
					>
					<input
						type="text"
						id="judul"
						bind:value={judul}
						required
						class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
						placeholder="Masukkan judul berita"
					/>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="space-y-2">
						<label for="id_skpd" class="text-sm font-semibold text-slate-700 dark:text-slate-300"
							>SKPD Terkait</label
						>

						<SearchableSelect
							options={skpdList}
							bind:value={id_skpd}
							idKey="id_skpd"
							labelKey="nm_skpd"
							placeholder={isLoading ? 'Memuat SKPD...' : 'Cari SKPD...'}
						/>
					</div>

					<div class="space-y-2">
						<label for="verify" class="text-sm font-semibold text-slate-700 dark:text-slate-300"
							>Status Verifikasi</label
						>
						<select
							id="verify"
							bind:value={verify}
							required
							class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
						>
							<option value="n">Belum Verifikasi</option>
							<option value="y">Terverifikasi</option>
							<option value="t">Ditolak</option>
						</select>
					</div>
				</div>

				{#if currentImage && !img_berita}
					<div class="space-y-2">
						<h1 class="text-sm font-semibold text-slate-700 dark:text-slate-300">
							Thumbnail Saat Ini
						</h1>
						<div
							class="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50"
						>
							<img
								src={`${PUBLIC_BACKEND_URL}/uploads/berita/${currentImage}`}
								alt="Thumbnail Berita"
								class="h-20 w-20 rounded-lg object-cover shadow-sm"
							/>
							<div class="overflow-hidden">
								<p class="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
									{currentImage}
								</p>
								<p class="text-xs text-slate-500">Unggah file baru untuk mengganti gambar ini.</p>
							</div>
						</div>
					</div>
				{/if}

				<div class="space-y-2">
					<h1 class="text-sm font-semibold text-slate-700 dark:text-slate-300">
						{currentImage ? 'Ganti Thumbnail (Opsional)' : 'Thumbnail'}
					</h1>
					<FilePond
						bind:value={img_berita}
						name="img_berita"
						acceptedFileTypes={['image/png', 'image/jpeg', 'image/webp']}
						label="Klik atau seret gambar ke sini"
					/>
				</div>

				<div class="space-y-2">
					<label for="deskripsi" class="text-sm font-semibold text-slate-700 dark:text-slate-300"
						>Konten Berita</label
					>
					<TinyMCE bind:value={deskripsi} id="deskripsi" height={500} />
				</div>

				<div class="flex justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-700">
					<button
						type="button"
						onclick={() => goto('/admin/berita')}
						class="rounded-xl px-6 py-3 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isSaving}
						class="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:opacity-50"
					>
						{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>

<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan Perubahan?"
	description="Pastikan data berita sudah benar sebelum memperbarui sistem."
	confirmText="Ya, Simpan"
	onConfirm={handleSubmit}
	isLoading={isSaving}
/>

<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'BERHASIL' : 'GAGAL'}
	description={notificationMessage}
/>
