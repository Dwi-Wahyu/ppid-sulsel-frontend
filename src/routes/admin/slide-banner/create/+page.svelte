<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	let nm_slide = $state<any>(null);
	let isSaving = $state(false);

	// Notification
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Confirmation
	let showConfirm = $state(false);

	async function handleSubmit() {
		if (!nm_slide) {
			notificationType = 'error';
			notificationMessage = 'Gambar banner harus diisi';
			showNotification = true;
			return;
		}

		isSaving = true;

		try {
			const formData = new FormData();
			formData.append('nm_slide', nm_slide);

			const response = await fetch(`${PUBLIC_API_URL}/admin/slide-banner`, {
				method: 'POST',
				credentials: 'include',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				notificationType = 'success';
				notificationMessage = 'Banner berhasil ditambahkan';
				showNotification = true;

				setTimeout(() => {
					goto('/admin/slide-banner');
				}, 1500);
			} else {
				notificationType = 'error';
				notificationMessage = result.message || 'Gagal menyimpan banner';
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
	<title>Tambah Banner - Admin PPID</title>
</svelte:head>

<div class="mx-auto max-w-4xl">
	<!-- Back Button -->
	<div class="mb-6 flex items-center gap-4">
		<a
			href="/admin/slide-banner"
			class="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition-all hover:text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:hover:text-slate-300"
			aria-label="Kembali ke daftar banner"
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
			<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Form Tambah Banner</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">
				Upload gambar banner untuk halaman utama.
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
			<!-- Gambar Banner -->
			<div>
				<label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
					Gambar Banner <span class="text-rose-500">*</span>
				</label>
				<FilePond
					bind:value={nm_slide}
					name="nm_slide"
					acceptedFileTypes={['image/png', 'image/jpeg', 'image/gif']}
					label="Seret & Letakkan file atau <span class='filepond--label-action'>Telusuri</span>"
					imagePreviewHeight={300}
					imageCropAspectRatio="2752:1536"
					imageValidateSizeMinWidth={2752}
					imageValidateSizeMinHeight={1536}
				/>
				<p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
					Format: JPG, PNG, GIF (Max: 5MB). Minimal dimensi: 2752×1536 (boleh lebih besar). Gambar
					akan di-crop otomatis dengan rasio yang benar.
				</p>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex items-center justify-end gap-3">
			<a
				href="/admin/slide-banner"
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
				{isSaving ? 'Menyimpan...' : 'Simpan Banner'}
			</button>
		</div>
	</form>
</div>

<!-- Confirmation Dialog -->
<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan Banner?"
	description="Apakah Anda yakin ingin menyimpan banner ini?"
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
