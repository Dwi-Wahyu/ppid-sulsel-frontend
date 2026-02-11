<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api'; // Menggunakan helper proxy
	import { PUBLIC_API_URL } from '$env/static/public';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	interface ProfilData {
		nm_profil: string;
		deskripsi: string;
		foto_kepala: string | null;
	}

	let formData = $state<ProfilData>({
		nm_profil: 'Sambutan',
		deskripsi: '',
		foto_kepala: null
	});

	let currentData = $state<ProfilData>({
		nm_profil: 'Sambutan',
		deskripsi: '',
		foto_kepala: null
	});

	let uploadedFile = $state<any>(null);
	let isLoading = $state(true);
	let isSaving = $state(false);

	// Notification states
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	onMount(async () => {
		try {
			// Mengakses via proxy. Endpoint sesuai api.php: /admin/sambutan
			const result = await api.get('/admin/sambutan');

			if (result.success && result.data) {
				formData = {
					nm_profil: result.data.nm_profil || 'Sambutan',
					deskripsi: result.data.deskripsi || '',
					foto_kepala: result.data.foto_kepala || null
				};
				currentData = { ...formData };
			}
		} catch (error) {
			console.error('Error fetching sambutan:', error);
		} finally {
			isLoading = false;
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSaving = true;

		try {
			// Gunakan FormData untuk mendukung pengunggahan file
			const formDataToSend = new FormData();
			formDataToSend.append('tipe', 'sambutan');
			formDataToSend.append('nm_profil', formData.nm_profil);
			formDataToSend.append('deskripsi', formData.deskripsi);

			if (uploadedFile) {
				formDataToSend.append('foto_kepala', uploadedFile);
			}

			// Kirim ke proxy menggunakan method POST
			const result = await api.post('/admin/sambutan', formDataToSend);

			if (result.success) {
				if (result.data.foto_kepala) {
					formData.foto_kepala = result.data.foto_kepala;
				}
				currentData = { ...formData };
				uploadedFile = null;
				notificationType = 'success';
				notificationMessage = 'Sambutan berhasil diperbarui!';
			}
		} catch (error: any) {
			console.error('Error saving:', error);
			notificationType = 'error';
			notificationMessage = error.message || 'Terjadi kesalahan saat menyimpan data';
		} finally {
			isSaving = false;
			showNotification = true;
		}
	}
</script>

<svelte:head>
	<title>Sambutan - Admin</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8">
			<h1 class="mb-2 text-3xl font-bold text-slate-800 dark:text-white">Sambutan</h1>
			<p class="text-slate-600 dark:text-slate-400">Kelola konten halaman Sambutan</p>
		</div>

		{#if isLoading}
			<div class="flex justify-center py-20">
				<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-ppid-primary"></div>
			</div>
		{:else}
			<div
				class="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<form onsubmit={handleSubmit}>
					<div class="mb-6">
						<label
							for="nm_profil"
							class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Judul Sambutan
						</label>
						<input
							type="text"
							id="nm_profil"
							bind:value={formData.nm_profil}
							required
							class="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-ppid-primary focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
						/>
					</div>

					<div class="mb-6">
						<label
							for="foto_kepala"
							class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Foto Kepala PPID
						</label>

						{#if currentData.foto_kepala}
							<div class="mb-4">
								<img
									src={`${PUBLIC_API_URL}/storage/${currentData.foto_kepala}`}
									alt="Kepala PPID"
									class="h-80 w-64 rounded-xl object-cover shadow-lg"
								/>
							</div>
						{/if}

						<FilePond
							id="foto_kepala"
							name="foto_kepala"
							bind:value={uploadedFile}
							acceptedFileTypes={['image/jpeg', 'image/png', 'image/jpg']}
							label="Seret & Letakkan foto atau <span class='filepond--label-action'>Telusuri</span>"
						/>
					</div>

					<div class="mb-6">
						<label
							for="deskripsi"
							class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Konten Sambutan
						</label>
						<TinyMCE id="deskripsi" bind:value={formData.deskripsi} height={400} />
					</div>

					<div class="flex justify-end">
						<button
							type="submit"
							disabled={isSaving}
							class="hover:bg-opacity-90 flex items-center gap-2 rounded-xl bg-ppid-primary px-8 py-3 font-semibold text-white shadow-md transition-all disabled:opacity-50"
						>
							{#if isSaving}
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
								></div>
								Menyimpan...
							{:else}
								Simpan Perubahan
							{/if}
						</button>
					</div>
				</form>
			</div>
		{/if}
	</div>
</div>

<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'Berhasil!' : 'Gagal!'}
	description={notificationMessage}
/>
