<script lang="ts">
	import { onMount } from 'svelte';
	// Impor helper api yang sudah mendukung Proxy SvelteKit
	import { api } from '$lib/api';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	interface ProfilData {
		nm_profil: string;
		deskripsi: string;
	}

	// State menggunakan Runes Svelte 5
	let formData = $state<ProfilData>({
		nm_profil: 'Visi dan Misi',
		deskripsi: ''
	});

	let currentData = $state<ProfilData>({
		nm_profil: 'Visi dan Misi',
		deskripsi: ''
	});

	let isLoading = $state(true);
	let isSaving = $state(false);

	// Notification states
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	onMount(async () => {
		try {
			/**
			 * Mengambil data via proxy.
			 * Endpoint disesuaikan dengan Route::apiResource('visi-misi') di api.php
			 */
			const result = await api.get('/admin/visi-misi');

			if (result.success && result.data) {
				// Pastikan struktur data sesuai dengan return dari Controller Laravel
				formData = {
					nm_profil: result.data.nm_profil || 'Visi dan Misi',
					deskripsi: result.data.deskripsi || ''
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
			/**
			 * Mengirim data ke proxy menggunakan helper api.post.
			 * Token access_token akan disisipkan otomatis di hooks.server.ts
			 */
			const result = await api.post('/admin/visi-misi', {
				tipe: 'visi-misi',
				nm_profil: formData.nm_profil,
				deskripsi: formData.deskripsi
			});

			if (result.success) {
				currentData = { ...formData };
				notificationType = 'success';
				notificationMessage = 'Data Visi dan Misi berhasil disimpan!';
			}
		} catch (error: any) {
			console.error('Error saving data:', error);
			notificationType = 'error';
			// Menangkap pesan error dari validasi Laravel (status 422)
			notificationMessage = error.message || 'Terjadi kesalahan saat menyimpan data';
		} finally {
			isSaving = false;
			showNotification = true;
		}
	}
</script>

<svelte:head>
	<title>Visi dan Misi - Admin</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="mb-2 text-3xl font-bold text-slate-800 dark:text-white">Visi dan Misi</h1>
				<p class="text-slate-600 dark:text-slate-400">Kelola konten halaman Visi dan Misi</p>
			</div>
		</div>

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
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
					</div>
					<h2 class="text-xl font-bold text-slate-800 dark:text-white">Editor Konten</h2>
				</div>

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
							aria-required="true"
							class="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-ppid-primary focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
						/>
					</div>

					<div class="mb-6">
						<label
							for="deskripsi"
							class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Konten Halaman
						</label>
						<TinyMCE id="deskripsi" bind:value={formData.deskripsi} height={400} />
					</div>

					<div class="flex justify-end gap-3">
						<button
							type="submit"
							disabled={isSaving}
							aria-busy={isSaving}
							class="hover:bg-opacity-90 flex items-center gap-2 rounded-xl bg-ppid-primary px-8 py-3 font-semibold text-white shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if isSaving}
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
								></div>
								Menyimpan...
							{:else}
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
								Simpan Perubahan
							{/if}
						</button>
					</div>
				</form>
			</div>

			{#if currentData.deskripsi}
				<div
					class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="mb-6 flex items-center gap-3">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
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
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/>
							</svg>
						</div>
						<h2 class="text-xl font-bold text-slate-800 dark:text-white">Preview Konten</h2>
					</div>
					<div class="prose max-w-none prose-slate dark:prose-invert">
						{@html currentData.deskripsi}
					</div>
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
