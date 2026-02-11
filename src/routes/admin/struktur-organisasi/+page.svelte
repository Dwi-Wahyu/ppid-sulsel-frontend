<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api'; // Menggunakan helper proxy
	import { PUBLIC_API_URL } from '$env/static/public';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	interface SettingData {
		struktur_organisasi_path: string | null;
	}

	let currentData = $state<SettingData>({
		struktur_organisasi_path: null
	});

	let uploadedFile = $state<any>(null);
	let isLoading = $state(true);
	let isSaving = $state(false);

	// Notification states
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	const current_path = $derived(currentData.struktur_organisasi_path);

	onMount(async () => {
		try {
			// Mengakses via proxy. Endpoint sesuai api.php: /admin/struktur-organisasi
			const result = await api.get('/admin/struktur-organisasi');
			if (result.success && result.data) {
				// Ambil path dari response JSON index
				currentData.struktur_organisasi_path = result.data.struktur_organisasi_path || null;
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

		if (!uploadedFile) {
			notificationType = 'error';
			notificationMessage = 'Silakan pilih file PDF untuk diupload';
			showNotification = true;
			isSaving = false;
			return;
		}

		try {
			// Gunakan FormData untuk mengirim file PDF
			const formDataToSend = new FormData();
			formDataToSend.append('struktur_organisasi', uploadedFile);

			// Kirim ke proxy menggunakan method POST
			const result = await api.post('/admin/struktur-organisasi', formDataToSend);

			if (result.success) {
				// Controller store() mengembalikan model Setting (properti 'value' berisi path)
				if (result.data && result.data.value) {
					currentData.struktur_organisasi_path = result.data.value;
				}
				uploadedFile = null;
				notificationType = 'success';
				notificationMessage = 'Struktur organisasi berhasil diperbarui!';
			}
		} catch (error: any) {
			console.error('Error saving:', error);
			notificationType = 'error';
			notificationMessage =
				error.message || 'Gagal menyimpan data (Pastikan format PDF & maks 5MB)';
		} finally {
			isSaving = false;
			showNotification = true;
		}
	}
</script>

<svelte:head>
	<title>Struktur Organisasi - Admin</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-7xl">
		<header class="mb-8">
			<h1 class="mb-2 text-3xl font-bold text-slate-800 dark:text-white">Struktur Organisasi</h1>
			<p class="text-slate-600 dark:text-slate-400">
				Kelola struktur organisasi PPID Sulawesi Selatan
			</p>
		</header>

		{#if isLoading}
			<div class="flex justify-center py-20">
				<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-ppid-primary"></div>
			</div>
		{:else}
			<div
				class="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="mb-6 flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full bg-ppid-primary text-white"
					>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							/></svg
						>
					</div>
					<h2 class="text-xl font-bold text-slate-800 dark:text-white">Upload File PDF</h2>
				</div>

				<form onsubmit={handleSubmit}>
					<div class="mb-6">
						<label
							for="struktur_organisasi"
							class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Pilih File PDF Struktur Organisasi
						</label>

						<FilePond
							id="struktur_organisasi"
							name="struktur_organisasi"
							bind:value={uploadedFile}
							acceptedFileTypes={['application/pdf']}
							label="Seret & Letakkan file PDF atau <span class='filepond--label-action'>Telusuri</span>"
						/>
						<p class="mt-2 text-xs text-slate-500">Format: PDF • Ukuran maksimal: 5MB</p>
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

			{#if current_path}
				<div
					class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<div
						class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-8 py-5 dark:border-slate-700 dark:bg-slate-900"
					>
						<h2 class="text-lg font-bold text-slate-900 dark:text-white">Preview Saat Ini</h2>
						<a
							href={`${PUBLIC_API_URL}/${current_path}`}
							download
							class="rounded-lg bg-ppid-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
						>
							Download PDF
						</a>
					</div>

					<div class="p-8">
						<div class="overflow-hidden rounded-xl border-2 border-slate-200">
							<iframe
								src={`${PUBLIC_API_URL}/${current_path}`}
								class="w-full bg-white"
								style="height: 800px;"
								title="Preview Struktur Organisasi"
							>
								<p class="p-8 text-center text-slate-600">
									Browser tidak mendukung pratinjau. <a
										href={`${PUBLIC_API_URL}/${current_path}`}
										class="text-blue-600 underline">Klik di sini untuk download</a
									>.
								</p>
							</iframe>
						</div>
					</div>
				</div>
			{:else}
				<div
					class="rounded-2xl border border-dashed border-slate-300 p-20 text-center text-slate-500"
				>
					<p class="italic">Belum ada file struktur organisasi yang diunggah.</p>
				</div>
			{/if}
		{/if}
	</div>
</div>

<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'Berhasil!' : 'Gagal!'}
	description={notificationMessage}
/>
