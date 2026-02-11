<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	interface Banner {
		id_slide: number;
		nm_slide: string;
	}

	let bannerId = $state('');
	let nm_slide = $state<any>(null);
	let currentImage = $state<string | null>(null);
	let isLoading = $state(true);
	let isSaving = $state(false);

	// Notification
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Confirmation
	let showConfirm = $state(false);

	onMount(async () => {
		bannerId = window.location.pathname.split('/')[3]; // Extract ID from URL
		await fetchBanner();
	});

	async function fetchBanner() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/slide-banner/${bannerId}`, {
				credentials: 'include'
			});
			const result = await response.json();

			if (result.success) {
				const data: Banner = result.data;
				currentImage = data.nm_slide;
			}
		} catch (error) {
			console.error('Failed to fetch banner:', error);
			notificationType = 'error';
			notificationMessage = 'Gagal memuat data banner';
			showNotification = true;
		} finally {
			isLoading = false;
		}
	}

	async function handleSubmit() {
		isSaving = true;

		try {
			const formData = new FormData();
			formData.append('_method', 'PUT');
			if (nm_slide) {
				formData.append('nm_slide', nm_slide);
			}

			const response = await fetch(`${PUBLIC_API_URL}/admin/slide-banner/${bannerId}`, {
				method: 'POST',
				credentials: 'include',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				notificationType = 'success';
				notificationMessage = 'Banner berhasil diperbarui';
				showNotification = true;

				setTimeout(() => {
					goto('/admin/slide-banner');
				}, 1500);
			} else {
				notificationType = 'error';
				notificationMessage = result.message || 'Gagal memperbarui banner';
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
	<title>Edit Banner - Admin PPID</title>
</svelte:head>

<div class="mx-auto max-w-4xl space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
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
			<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Form Edit Banner</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">Perbarui gambar banner.</p>
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
				<!-- Current Image Preview -->
				{#if currentImage && !nm_slide}
					<div>
						<label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
							Gambar Saat Ini
						</label>
						<div
							class="relative rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50"
						>
							<img
								src={`${PUBLIC_API_URL.replace('/api', '')}/storage/slide-banner/${currentImage}`}
								alt="Current banner"
								class="max-h-64 w-full rounded-lg object-contain"
							/>
						</div>
					</div>
				{/if}

				<!-- Gambar Banner Baru -->
				<div>
					<label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
						{currentImage ? 'Gambar Baru (Opsional)' : 'Gambar Banner'}
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
						Biarkan kosong jika tidak ingin mengubah gambar. Format: JPG, PNG, GIF (Max: 5MB).
						Minimal dimensi: 2752×1536 (boleh lebih besar).
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
					{isSaving ? 'Menyimpan...' : 'Perbarui Banner'}
				</button>
			</div>
		</form>
	{/if}
</div>

<!-- Confirmation Dialog -->
<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan Perubahan?"
	description="Apakah Anda yakin ingin menyimpan perubahan banner ini?"
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
