<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api'; // Gunakan helper proxy
	import { PUBLIC_API_URL } from '$env/static/public';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	interface ProfilData {
		nm_profil: string;
		deskripsi: string;
		foto_gubernur: string | null;
		foto_wakil: string | null;
		ig_gubernur: string;
		fb_gubernur: string;
		ig_wakil: string;
		fb_wakil: string;
	}

	let formData = $state<ProfilData>({
		nm_profil: 'Profil Pemerintah Provinsi',
		deskripsi: '',
		foto_gubernur: null,
		foto_wakil: null,
		ig_gubernur: '',
		fb_gubernur: '',
		ig_wakil: '',
		fb_wakil: ''
	});

	let currentData = $state<ProfilData>({
		nm_profil: 'Profil Pemerintah Provinsi',
		deskripsi: '',
		foto_gubernur: null,
		foto_wakil: null,
		ig_gubernur: '',
		fb_gubernur: '',
		ig_wakil: '',
		fb_wakil: ''
	});

	let uploadedGubernur = $state<any>(null);
	let uploadedWakil = $state<any>(null);
	let isLoading = $state(true);
	let isSaving = $state(false);

	// Notification states
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	onMount(async () => {
		try {
			// Endpoint disesuaikan dengan Route::apiResource('profil-pemprov')
			const result = await api.get('/admin/profil-pemprov');

			if (result.success && result.data) {
				formData = {
					nm_profil: result.data.nm_profil || 'Profil Pemerintah Provinsi',
					deskripsi: result.data.deskripsi || '',
					foto_gubernur: result.data.foto_gubernur || null,
					foto_wakil: result.data.foto_wakil || null,
					ig_gubernur: result.data.ig_gubernur || '',
					fb_gubernur: result.data.fb_gubernur || '',
					ig_wakil: result.data.ig_wakil || '',
					fb_wakil: result.data.fb_wakil || ''
				};
				currentData = { ...formData };
			}
		} catch (error) {
			console.error('Error fetching profil:', error);
		} finally {
			isLoading = false;
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSaving = true;

		try {
			// Gunakan FormData untuk mengirim data beserta file
			const formDataToSend = new FormData();
			formDataToSend.append('tipe', 'pemerintah');
			formDataToSend.append('nm_profil', formData.nm_profil);
			formDataToSend.append('deskripsi', formData.deskripsi);
			formDataToSend.append('ig_gubernur', formData.ig_gubernur);
			formDataToSend.append('fb_gubernur', formData.fb_gubernur);
			formDataToSend.append('ig_wakil', formData.ig_wakil);
			formDataToSend.append('fb_wakil', formData.fb_wakil);

			if (uploadedGubernur) {
				formDataToSend.append('foto_gubernur', uploadedGubernur);
			}
			if (uploadedWakil) {
				formDataToSend.append('foto_wakil', uploadedWakil);
			}

			// Kirim ke proxy (SvelteKit Server akan menyisipkan token otomatis)
			const result = await api.post('/admin/profil-pemprov', formDataToSend);

			if (result.success) {
				if (result.data.foto_gubernur) formData.foto_gubernur = result.data.foto_gubernur;
				if (result.data.foto_wakil) formData.foto_wakil = result.data.foto_wakil;

				currentData = { ...formData };
				uploadedGubernur = null;
				uploadedWakil = null;
				notificationType = 'success';
				notificationMessage = 'Profil Pemprov berhasil diperbarui!';
			}
		} catch (error: any) {
			console.error('Error saving data:', error);
			notificationType = 'error';
			notificationMessage = error.message || 'Terjadi kesalahan saat menyimpan data';
		} finally {
			isSaving = false;
			showNotification = true;
		}
	}
</script>

<svelte:head>
	<title>Profil Pemprov - Admin</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-7xl">
		<header class="mb-8">
			<h1 class="mb-2 text-3xl font-bold text-slate-800 dark:text-white">
				Profil Pemerintah Provinsi
			</h1>
			<p class="text-slate-600 dark:text-slate-400">
				Kelola konten halaman Profil Pemerintah Provinsi Sulawesi Selatan
			</p>
		</header>

		{#if isLoading}
			<div class="flex justify-center py-20" aria-live="polite">
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
							Judul Halaman
						</label>
						<input
							type="text"
							id="nm_profil"
							bind:value={formData.nm_profil}
							required
							class="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-ppid-primary focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
						/>
					</div>

					<div class="mb-6 grid gap-6 md:grid-cols-2">
						<div class="space-y-4">
							<label
								for="foto_gubernur"
								class="block text-sm font-semibold text-slate-700 dark:text-slate-300"
								>Foto Gubernur</label
							>
							{#if currentData.foto_gubernur}
								<img
									src={`${PUBLIC_API_URL}/storage/${currentData.foto_gubernur}`}
									alt="Gubernur"
									class="h-64 w-full rounded-xl object-cover shadow-md"
								/>
							{/if}
							<FilePond
								bind:value={uploadedGubernur}
								acceptedFileTypes={['image/jpeg', 'image/png']}
								label="Upload Foto Gubernur"
							/>
							<input
								type="text"
								bind:value={formData.ig_gubernur}
								placeholder="Instagram Gubernur"
								class="w-full rounded-lg border-2 border-slate-200 p-2 dark:bg-slate-700 dark:text-white"
							/>
							<input
								type="text"
								bind:value={formData.fb_gubernur}
								placeholder="Facebook Gubernur"
								class="w-full rounded-lg border-2 border-slate-200 p-2 dark:bg-slate-700 dark:text-white"
							/>
						</div>

						<div class="space-y-4">
							<label
								for="foto_wakil"
								class="block text-sm font-semibold text-slate-700 dark:text-slate-300"
								>Foto Wakil Gubernur</label
							>
							{#if currentData.foto_wakil}
								<img
									src={`${PUBLIC_API_URL}/storage/${currentData.foto_wakil}`}
									alt="Wakil Gubernur"
									class="h-64 w-full rounded-xl object-cover shadow-md"
								/>
							{/if}
							<FilePond
								bind:value={uploadedWakil}
								acceptedFileTypes={['image/jpeg', 'image/png']}
								label="Upload Foto Wakil Gubernur"
							/>
							<input
								type="text"
								bind:value={formData.ig_wakil}
								placeholder="Instagram Wakil Gubernur"
								class="w-full rounded-lg border-2 border-slate-200 p-2 dark:bg-slate-700 dark:text-white"
							/>
							<input
								type="text"
								bind:value={formData.fb_wakil}
								placeholder="Facebook Wakil Gubernur"
								class="w-full rounded-lg border-2 border-slate-200 p-2 dark:bg-slate-700 dark:text-white"
							/>
						</div>
					</div>

					<div class="mb-6">
						<label
							for="deskripsi"
							class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
							>Konten Halaman</label
						>
						<TinyMCE id="deskripsi" bind:value={formData.deskripsi} height={400} />
					</div>

					<div class="flex justify-end">
						<button
							type="submit"
							disabled={isSaving}
							class="flex items-center gap-2 rounded-xl bg-ppid-primary px-8 py-3 font-semibold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-50"
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
