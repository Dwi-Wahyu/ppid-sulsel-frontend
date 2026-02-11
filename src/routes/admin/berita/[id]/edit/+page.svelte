<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_API_URL } from '$env/static/public';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

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

	let beritaId = $state<string>('');
	let judul = $state('');
	let deskripsi = $state('');
	let id_skpd = $state('');
	let verify = $state('t');
	let img_berita = $state<any>(null);
	let currentImage = $state<string | null>(null);

	let skpdList = $state<SKPD[]>([]);
	let isLoading = $state(true);
	let isSaving = $state(false);

	// Notification
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Confirmation
	let showConfirm = $state(false);

	onMount(async () => {
		beritaId = window.location.pathname.split('/')[3]; // Extract ID from URL
		await Promise.all([fetchBerita(), fetchSKPD()]);
	});

	async function fetchBerita() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/berita/${beritaId}`, {
				credentials: 'include'
			});
			const result = await response.json();

			if (result.success) {
				const data: Berita = result.data;
				judul = data.judul;
				deskripsi = data.deskripsi;
				id_skpd = data.id_skpd || '';
				verify = data.verify;
				currentImage = data.img_berita;
			}
		} catch (error) {
			console.error('Failed to fetch berita:', error);
			notificationType = 'error';
			notificationMessage = 'Gagal memuat data berita';
			showNotification = true;
		}
	}

	async function fetchSKPD() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/skpd`, {
				credentials: 'include'
			});
			const result = await response.json();
			if (result.data) {
				skpdList = result.data;
			}
		} catch (error) {
			console.error('Failed to fetch SKPD:', error);
		} finally {
			isLoading = false;
		}
	}

	async function handleSubmit() {
		isSaving = true;

		try {
			const formData = new FormData();
			formData.append('judul', judul);
			formData.append('deskripsi', deskripsi);
			if (id_skpd) formData.append('id_skpd', id_skpd);
			formData.append('verify', verify);
			formData.append('_method', 'PUT');

			if (img_berita) {
				formData.append('img_berita', img_berita);
			}

			const response = await fetch(`${PUBLIC_API_URL}/admin/berita/${beritaId}`, {
				method: 'POST',
				credentials: 'include',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				notificationType = 'success';
				notificationMessage = 'Berita berhasil diperbarui';
				showNotification = true;

				setTimeout(() => {
					goto('/admin/berita');
				}, 1500);
			} else {
				notificationType = 'error';
				notificationMessage = result.message || 'Gagal memperbarui berita';
				showNotification = true;
			}
		} catch (error) {
			notificationType = 'error';
			notificationMessage = 'Terjadi kesalahan saat menyimpan data';
			showNotification = true;
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>Edit Berita - Admin PPID</title>
</svelte:head>

<div class="mx-auto max-w-4xl">
	<div
		class="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<!-- Header -->
		<div class="border-b border-slate-100 p-6 dark:border-slate-700">
			<h3 class="text-lg font-bold text-ppid-primary dark:text-white">Form Edit Berita</h3>
		</div>

		{#if isLoading}
			<div class="flex items-center justify-center p-12">
				<div class="flex flex-col items-center gap-3">
					<svg
						class="h-8 w-8 animate-spin text-ppid-primary"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					<p class="text-sm text-slate-500 dark:text-slate-400">Memuat data...</p>
				</div>
			</div>
		{:else}
			<!-- Form -->
			<form
				onsubmit={(e) => {
					e.preventDefault();
					showConfirm = true;
				}}
				class="space-y-6 p-6"
			>
				<!-- Judul -->
				<div>
					<label
						for="judul"
						class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
					>
						Judul Berita
					</label>
					<input
						type="text"
						id="judul"
						bind:value={judul}
						required
						aria-required="true"
						class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-ppid-accent focus:ring-1 focus:ring-ppid-accent focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
						placeholder="Masukkan judul berita"
					/>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<!-- SKPD -->
					<div>
						<label
							for="id_skpd"
							class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>
							SKPD Terkait
						</label>
						<select
							id="id_skpd"
							bind:value={id_skpd}
							class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-ppid-accent focus:ring-1 focus:ring-ppid-accent focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
						>
							<option value="">-- Pilih SKPD --</option>
							{#each skpdList as skpd}
								<option value={skpd.id_skpd}>{skpd.nm_skpd}</option>
							{/each}
						</select>
					</div>

					<!-- Status Verifikasi -->
					<div>
						<label
							for="verify"
							class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>
							Status Verifikasi
						</label>
						<select
							id="verify"
							bind:value={verify}
							required
							class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-ppid-accent focus:ring-1 focus:ring-ppid-accent focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
						>
							<option value="n">Belum Verifikasi</option>
							<option value="y">Terverifikasi</option>
							<option value="t">Ditolak</option>
						</select>
					</div>
				</div>

				<!-- Current Image Preview -->
				{#if currentImage && !img_berita}
					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
							Gambar Saat Ini
						</label>
						<div
							class="relative flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50"
						>
							<img
								src={`${PUBLIC_API_URL.replace('/api', '')}/storage/berita/${currentImage}`}
								alt="Current"
								class="h-20 w-20 rounded-lg object-cover"
							/>
							<div class="flex-1">
								<p class="text-sm font-medium text-slate-700 dark:text-slate-300">
									{currentImage}
								</p>
								<p class="text-xs text-slate-500 dark:text-slate-400">
									Upload gambar baru untuk menggantinya
								</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Gambar Sampul -->
				<div>
					<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
						{currentImage ? 'Gambar Baru (Opsional)' : 'Gambar Sampul'}
					</label>
					<FilePond
						bind:value={img_berita}
						name="img_berita"
						acceptedFileTypes={['image/png', 'image/jpeg', 'image/gif']}
						label="Seret & Letakkan file atau <span class='filepond--label-action'>Telusuri</span>"
					/>
				</div>

				<!-- Konten Berita -->
				<div>
					<label
						for="deskripsi"
						class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
					>
						Konten Berita
					</label>
					<TinyMCE bind:value={deskripsi} id="deskripsi" height={500} />
				</div>

				<!-- Actions -->
				<div class="flex justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-700">
					<a
						href="/admin/berita"
						class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
					>
						Batal
					</a>
					<button
						type="submit"
						disabled={isSaving}
						aria-busy={isSaving}
						class="hover:bg-ppid-dark rounded-lg bg-ppid-primary px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>

<!-- Confirmation Dialog -->
<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan Perubahan?"
	description="Apakah Anda yakin ingin menyimpan perubahan berita ini?"
	confirmText="Ya, Simpan"
	theme="primary"
	onConfirm={handleSubmit}
	isLoading={isSaving}
/>

<!-- Notification -->
<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'Berhasil!' : 'Gagal!'}
	description={notificationMessage}
/>
