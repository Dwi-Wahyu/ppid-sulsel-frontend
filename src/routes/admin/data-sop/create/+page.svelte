	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	let judul = $state('');
	let file = $state<any>(null);
	let isSaving = $state(false);

	// Notification
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Confirmation
	let showConfirm = $state(false);

	async function handleSubmit() {
		if (!file) {
			notificationType = 'error';
			notificationMessage = 'File dokumen harus diisi';
			showNotification = true;
			return;
		}

		isSaving = true;

		try {
			const formData = new FormData();
			formData.append('judul', judul);
			formData.append('file', file);

			// Menggunakan api.post untuk mengirim FormData
			const result = await api.post('/admin/sop', formData);

			if (result.success) {
				notificationType = 'success';
				notificationMessage = 'SOP berhasil ditambahkan';
				showNotification = true;

				setTimeout(() => {
					goto('/admin/data-sop');
				}, 1500);
			} else {
				throw new Error(result.message || 'Gagal menyimpan SOP');
			}
		} catch (error: any) {
			console.error('Error saving SOP:', error);
			notificationType = 'error';
			notificationMessage = error.message || 'Terjadi kesalahan saat menyimpan data';
			showNotification = true;
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>Input SOP - Admin PPID</title>
</svelte:head>

<div class="mx-auto max-w-4xl">
	<!-- Back Button -->
	<div class="mb-6 flex items-center gap-4">
		<a
			href="/admin/data-sop"
			class="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-400 shadow-sm transition-all hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:hover:text-slate-300"
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
			<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Input SOP Baru</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">
				Silakan lengkapi formulir di bawah ini untuk menambahkan SOP baru.
			</p>
		</div>
	</div>

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
					class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition-all focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-ppid-primary"
					placeholder="Contoh: SOP Pelayanan Informasi Publik"
				/>
			</div>

			<!-- File Upload -->
			<div>
				<label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
					File Dokumen <span class="text-rose-500">*</span>
				</label>
				<FilePond
					bind:value={file}
					name="file"
					acceptedFileTypes={[
						'application/pdf',
						'application/msword',
						'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
						'image/jpeg',
						'image/png'
					]}
					label="Seret & Letakkan file atau <span class='filepond--label-action'>Telusuri</span>"
				/>
				<p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
					Format yang didukung: PDF, DOC, DOCX, JPG, JPEG, PNG. Maksimal 5MB.
				</p>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex items-center justify-end gap-3">
			<a
				href="/admin/data-sop"
				class="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
			>
				Batal
			</a>
			<button
				type="submit"
				disabled={isSaving}
				aria-busy={isSaving}
				class="rounded-xl bg-gradient-to-r from-ppid-primary to-ppid-primary-light px-8 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-ppid-primary-light hover:to-ppid-primary hover:shadow-lg focus:ring-2 focus:ring-ppid-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isSaving ? 'Menyimpan...' : 'Simpan SOP'}
			</button>
		</div>
	</form>
</div>

<!-- Confirmation Dialog -->
<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan SOP?"
	description="Apakah Anda yakin ingin menyimpan dokumen SOP ini?"
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
