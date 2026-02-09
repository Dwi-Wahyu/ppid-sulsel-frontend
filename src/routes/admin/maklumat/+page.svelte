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
		file_banner: string | null;
	}

	let formData = $state<ProfilData>({
		nm_profil: 'Maklumat Pelayanan',
		deskripsi: '',
		file_banner: null
	});

	let currentData = $state<ProfilData>({
		nm_profil: 'Maklumat Pelayanan',
		deskripsi: '',
		file_banner: null
	});

	let uploadedFile = $state<any>(null);
	let isLoading = $state(true);
	let isSaving = $state(false);

	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	const isPDF = $derived(
		currentData.file_banner ? currentData.file_banner.endsWith('.pdf') : false
	);

	onMount(async () => {
		try {
			// Mengakses endpoint /admin/maklumat melalui proxy
			const result = await api.get('/admin/maklumat');
			if (result.success && result.data) {
				formData = {
					nm_profil: result.data.nm_profil || 'Maklumat Pelayanan',
					deskripsi: result.data.deskripsi || '',
					file_banner: result.data.file_banner || null
				};
				currentData = { ...formData };
			}
		} catch (error) {
			console.error('Error fetching maklumat:', error);
		} finally {
			isLoading = false;
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSaving = true;

		try {
			// Gunakan FormData untuk mengirimkan file banner
			const formDataToSend = new FormData();
			formDataToSend.append('tipe', 'maklumat');
			formDataToSend.append('nm_profil', formData.nm_profil);
			formDataToSend.append('deskripsi', formData.deskripsi);

			if (uploadedFile) {
				formDataToSend.append('file_banner', uploadedFile);
			}

			// Mengirim ke proxy. SvelteKit Server akan menyisipkan token Sanctum
			const result = await api.post('/admin/maklumat', formDataToSend);

			if (result.success) {
				if (result.data.file_banner) {
					formData.file_banner = result.data.file_banner;
				}
				currentData = { ...formData };
				uploadedFile = null;
				notificationType = 'success';
				notificationMessage = 'Maklumat pelayanan berhasil diperbarui!';
			}
		} catch (error: any) {
			notificationType = 'error';
			notificationMessage = error.message || 'Terjadi kesalahan saat menyimpan data';
		} finally {
			isSaving = false;
			showNotification = true;
		}
	}
</script>

<svelte:head>
	<title>Maklumat Pelayanan - Admin</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-7xl">
		<header class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="mb-2 text-3xl font-bold text-slate-800 dark:text-white">Maklumat Pelayanan</h1>
				<p class="text-slate-600 dark:text-slate-400">
					Kelola konten halaman Maklumat Pelayanan Informasi Publik
				</p>
			</div>
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
							>Judul Halaman</label
						>
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
							for="file_banner"
							class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
							>Banner Maklumat (Gambar/PDF)</label
						>

						{#if currentData.file_banner}
							<div
								class="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20"
							>
								{#if isPDF}
									<div class="flex items-center gap-3">
										<svg
											class="h-10 w-10 text-red-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											><path
												d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
												stroke-width="2"
											/></svg
										>
										<a
											href={`${PUBLIC_API_URL}/storage/${currentData.file_banner}`}
											target="_blank"
											class="text-sm font-medium text-blue-600 hover:underline"
											>Lihat PDF Terunggah</a
										>
									</div>
								{:else}
									<img
										src={`${PUBLIC_API_URL}/storage/${currentData.file_banner}`}
										alt="Banner"
										class="max-h-64 rounded-lg object-contain shadow-sm"
									/>
								{/if}
							</div>
						{/if}

						<FilePond
							id="file_banner"
							name="file_banner"
							bind:value={uploadedFile}
							acceptedFileTypes={['image/jpeg', 'image/png', 'application/pdf']}
							label="Seret & Letakkan file atau <span class='filepond--label-action'>Telusuri</span>"
						/>
					</div>

					<div class="mb-6">
						<label
							for="deskripsi"
							class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
							>Konten Maklumat</label
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
