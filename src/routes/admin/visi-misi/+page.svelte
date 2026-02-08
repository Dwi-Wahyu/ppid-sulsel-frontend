<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	interface ProfilData {
		nm_profil: string;
		deskripsi: string;
	}

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
			const response = await fetch(`${PUBLIC_API_URL}/admin/profil/visi-misi`, {
				credentials: 'include'
			});
			const result = await response.json();
			if (result.success && result.data) {
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
			const response = await fetch(`${PUBLIC_API_URL}/admin/profil/visi-misi`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({
					tipe: 'visi-misi',
					nm_profil: formData.nm_profil,
					deskripsi: formData.deskripsi
				})
			});

			const result = await response.json();

			if (result.success) {
				currentData = { ...formData };
				notificationType = 'success';
				notificationMessage = 'Data berhasil disimpan!';
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
	<title>Visi dan Misi - Admin</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-7xl">
		<!-- Header -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="mb-2 text-3xl font-bold text-slate-800 dark:text-white">Visi dan Misi</h1>
				<p class="text-slate-600 dark:text-slate-400">Kelola konten halaman Visi dan Misi</p>
			</div>
		</div>

		<!-- Editor Section -->
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

		<!-- Preview Section -->
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
	</div>
</div>

<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'Berhasil!' : 'Gagal!'}
	description={notificationMessage}
/>
