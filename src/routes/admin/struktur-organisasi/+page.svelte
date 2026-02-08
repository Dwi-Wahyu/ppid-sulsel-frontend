<script lang="ts">
	import { onMount } from 'svelte';
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
			const response = await fetch(`${PUBLIC_API_URL}/admin/profil/struktur-organisasi`, {
				credentials: 'include'
			});
			const result = await response.json();
			if (result.success && result.data) {
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

		try {
			const formDataToSend = new FormData();

			if (uploadedFile) {
				formDataToSend.append('struktur_organisasi', uploadedFile);
			} else {
				notificationType = 'error';
				notificationMessage = 'Silakan pilih file PDF untuk diupload';
				showNotification = true;
				isSaving = false;
				return;
			}

			const response = await fetch(`${PUBLIC_API_URL}/admin/profil/struktur-organisasi`, {
				method: 'POST',
				credentials: 'include',
				body: formDataToSend
			});

			const result = await response.json();

			if (result.success) {
				if (result.data.struktur_organisasi_path) {
					currentData.struktur_organisasi_path = result.data.struktur_organisasi_path;
				}
				uploadedFile = null;
				notificationType = 'success';
				notificationMessage = 'Struktur organisasi berhasil diperbarui!';
			} else {
				notificationType = 'error';
				notificationMessage = result.message || 'Gagal menyimpan data';
			}
		} catch (error) {
			notificationType = 'error';
			notificationMessage = 'Terjadi kesalahan saat menyimpan data';
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
		<!-- Header -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="mb-2 text-3xl font-bold text-slate-800 dark:text-white">Struktur Organisasi</h1>
				<p class="text-slate-600 dark:text-slate-400">
					Kelola struktur organisasi PPID Sulawesi Selatan
				</p>
			</div>
		</div>

		<!-- Upload Section -->
		<div
			class="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div class="mb-6 flex items-center gap-3">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-full bg-ppid-primary text-white"
					aria-hidden="true"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
						/>
					</svg>
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

					{#if current_path}
						<div
							class="mb-4 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20"
						>
							<div class="flex items-center gap-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="shrink-0"
									><path
										d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
									/><polyline points="14 2 14 8 20 8" /></svg
								>
								<span class="truncate">{current_path.split('/').pop()}</span>
							</div>
							<a
								href={`${PUBLIC_API_URL}/storage/${current_path}`}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
								Lihat File
							</a>
						</div>
					{/if}

					<FilePond
						id="struktur_organisasi"
						name="struktur_organisasi"
						bind:value={uploadedFile}
						acceptedFileTypes={['application/pdf']}
						label="Seret & Letakkan file PDF atau <span class='filepond--label-action'>Telusuri</span>"
					/>
					<p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
						Format: PDF • Ukuran maksimal: 5MB
					</p>
				</div>

				<div class="flex justify-end gap-3">
					<button
						type="submit"
						disabled={isSaving}
						aria-busy={isSaving}
						class="flex items-center gap-2 rounded-xl bg-linear-to-r from-ppid-primary to-[#2A4A7E] px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-[#2A4A7E] hover:to-ppid-primary hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
					</button>
				</div>
			</form>
		</div>

		<!-- PDF Preview Section -->
		{#if current_path}
			<div
				class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div
					class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-8 py-5 dark:border-slate-700 dark:bg-slate-900"
				>
					<div class="flex items-center gap-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-ppid-primary dark:text-white"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<h2 class="text-lg font-bold text-slate-900 dark:text-white">
							Preview Struktur Organisasi
						</h2>
					</div>
					<a
						href={`${PUBLIC_API_URL}/storage/${current_path}`}
						download
						class="flex items-center gap-2 rounded-lg bg-ppid-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2A4A7E]"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
							/>
						</svg>
						Download PDF
					</a>
				</div>

				<div class="p-8">
					<div
						class="overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-50 shadow-inner dark:border-slate-700 dark:bg-slate-900"
					>
						<iframe
							src={`${PUBLIC_API_URL}/storage/${current_path}`}
							class="w-full border-0 bg-white dark:bg-slate-800"
							style="height: 800px;"
							title="Preview Struktur Organisasi PPID"
						>
							<p class="p-8 text-center text-slate-600 dark:text-slate-400">
								Browser Anda tidak mendukung pratinjau PDF.
								<a
									href={`${PUBLIC_API_URL}/storage/${current_path}`}
									class="font-semibold text-ppid-primary hover:underline dark:text-blue-400"
								>
									Klik di sini untuk download PDF
								</a>
							</p>
						</iframe>
					</div>
				</div>
			</div>
		{:else}
			<div
				class="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="text-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mx-auto mb-4 h-20 w-20 text-slate-300 dark:text-slate-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
						/>
					</svg>
					<h3 class="mb-2 text-lg font-bold text-slate-700 dark:text-slate-300">
						Belum Ada File Struktur Organisasi
					</h3>
					<p class="text-slate-500 dark:text-slate-400">
						Upload file PDF struktur organisasi menggunakan form di atas.
					</p>
				</div>
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
