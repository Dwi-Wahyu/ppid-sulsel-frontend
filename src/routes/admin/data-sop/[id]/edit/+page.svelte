<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	interface SOP {
		id: number;
		judul: string;
		file: string;
		jumlah_download: number;
	}

	let sopId = $state('');
	let judul = $state('');
	let file = $state<any>(null);
	let currentFile = $state<string | null>(null);
	let isLoading = $state(true);
	let isSaving = $state(false);

	// Notification
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Confirmation
	let showConfirm = $state(false);

	onMount(async () => {
		sopId = window.location.pathname.split('/')[3]; // Extract ID from URL
		await fetchSOP();
	});

	async function fetchSOP() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/data-sop/${sopId}`, {
				credentials: 'include'
			});
			const result = await response.json();

			if (result.success) {
				const data: SOP = result.data;
				judul = data.judul;
				currentFile = data.file;
			}
		} catch (error) {
			console.error('Failed to fetch SOP:', error);
			notificationType = 'error';
			notificationMessage = 'Gagal memuat data SOP';
			showNotification = true;
		} finally {
			isLoading = false;
		}
	}

	async function handleSubmit() {
		isSaving = true;

		try {
			const formData = new FormData();
			formData.append('judul', judul);
			formData.append('_method', 'PUT');

			if (file) {
				formData.append('file', file);
			}

			const response = await fetch(`${PUBLIC_API_URL}/admin/data-sop/${sopId}`, {
				method: 'POST',
				credentials: 'include',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				notificationType = 'success';
				notificationMessage = 'SOP berhasil diperbarui';
				showNotification = true;

				setTimeout(() => {
					goto('/admin/data-sop');
				}, 1500);
			} else {
				notificationType = 'error';
				notificationMessage = result.message || 'Gagal memperbarui SOP';
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
	<title>Edit SOP - Admin</title>
</svelte:head>

<div class="mx-auto max-w-4xl space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a
			href="/admin/data-sop"
			class="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition-all hover:text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:hover:text-slate-300"
			aria-label="Kembali ke daftar SOP"
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
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
		</a>
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Edit SOP</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">Perbarui informasi atau dokumen SOP.</p>
		</div>
	</div>

	{#if isLoading}
		<div
			class="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div class="flex flex-col items-center gap-3">
				<svg
					class="h-8 w-8 animate-spin text-indigo-600"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					aria-hidden="true"
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
		<form
			onsubmit={(e) => {
				e.preventDefault();
				showConfirm = true;
			}}
			class="space-y-6"
		>
			<div
				class="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<!-- Judul -->
				<div>
					<label
						for="judul"
						class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
					>
						Judul Dokumen SOP <span class="text-rose-500">*</span>
					</label>
					<input
						type="text"
						id="judul"
						bind:value={judul}
						required
						aria-required="true"
						class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
						placeholder="Contoh: SOP Pelayanan Informasi Publik"
					/>
				</div>

				<!-- Current File Info -->
				{#if currentFile && !file}
					<div>
						<label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
							File Saat Ini
						</label>
						<div
							class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/50"
						>
							<div
								class="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-800"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6 text-indigo-600 dark:text-indigo-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<div>
								<p class="text-sm font-medium text-slate-900 dark:text-slate-100">File Saat Ini:</p>
								<a
									href={`${PUBLIC_API_URL.replace('/api', '')}/storage/sop/${currentFile}`}
									target="_blank"
									rel="noopener noreferrer"
									class="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
								>
									{currentFile}
								</a>
							</div>
						</div>
					</div>
				{/if}

				<!-- File Upload -->
				<div>
					<label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
						{currentFile ? 'File Baru (Opsional)' : 'File Dokumen'}
					</label>
					<FilePond
						bind:value={file}
						name="file"
						acceptedFileTypes={[
							'application/pdf',
							'application/msword',
							'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
							'application/vnd.ms-excel',
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
							'image/jpeg',
							'image/png'
						]}
						label={currentFile
							? "Seret & Letakkan file atau <span class='filepond--label-action'>Telusuri</span> untuk mengganti file"
							: "Seret & Letakkan file atau <span class='filepond--label-action'>Telusuri</span>"}
					/>
					<p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
						Biarkan kosong jika tidak ingin mengubah file. Format: PDF, DOC, DOCX, XLS, XLSX, JPG,
						PNG (Max 5MB).
					</p>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex items-center justify-end gap-3">
				<a
					href="/admin/data-sop"
					class="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
				>
					Batal
				</a>
				<button
					type="submit"
					disabled={isSaving}
					aria-busy={isSaving}
					class="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isSaving ? 'Menyimpan...' : 'Perbarui SOP'}
				</button>
			</div>
		</form>
	{/if}
</div>

<!-- Confirmation Dialog -->
<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan Perubahan?"
	description="Apakah Anda yakin ingin menyimpan perubahan SOP ini?"
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
