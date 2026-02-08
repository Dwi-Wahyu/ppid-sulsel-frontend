<script lang="ts">
	import { onMount } from 'svelte';
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
			const response = await fetch(`${PUBLIC_API_URL}/admin/profil/pemerintah`, {
				credentials: 'include'
			});
			const result = await response.json();
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

			const response = await fetch(`${PUBLIC_API_URL}/admin/profil/pemerintah`, {
				method: 'POST',
				credentials: 'include',
				body: formDataToSend
			});

			const result = await response.json();

			if (result.success) {
				if (result.data.foto_gubernur) {
					formData.foto_gubernur = result.data.foto_gubernur;
				}
				if (result.data.foto_wakil) {
					formData.foto_wakil = result.data.foto_wakil;
				}
				currentData = { ...formData };
				uploadedGubernur = null;
				uploadedWakil = null;
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
	<title>Profil Pemprov - Admin</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-7xl">
		<!-- Header -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="mb-2 text-3xl font-bold text-slate-800 dark:text-white">
					Profil Pemerintah Provinsi
				</h1>
				<p class="text-slate-600 dark:text-slate-400">
					Kelola konten halaman Profil Pemerintah Provinsi Sulawesi Selatan
				</p>
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

				<div class="mb-6 grid gap-6 md:grid-cols-2">
					<div>
						<label
							for="foto_gubernur"
							class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Foto Gubernur
						</label>

						{#if currentData.foto_gubernur}
							<div class="mb-4">
								<img
									src={`${PUBLIC_API_URL}/storage/${currentData.foto_gubernur}`}
									alt="Gubernur Sulawesi Selatan"
									class="h-80 w-64 rounded-xl object-cover shadow-lg"
								/>
							</div>
						{/if}

						<FilePond
							id="foto_gubernur"
							name="foto_gubernur"
							bind:value={uploadedGubernur}
							acceptedFileTypes={['image/jpeg', 'image/png', 'image/jpg']}
							label="Foto Gubernur"
						/>
						<p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
							Format: JPG, PNG • Maksimal: 5MB
						</p>

						<div class="mt-4 space-y-4">
							<div>
								<label
									for="ig_gubernur"
									class="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400"
									>Instagram Gubernur</label
								>
								<input
									type="text"
									id="ig_gubernur"
									bind:value={formData.ig_gubernur}
									placeholder="https://instagram.com/..."
									class="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-ppid-primary focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
								/>
							</div>
							<div>
								<label
									for="fb_gubernur"
									class="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400"
									>Facebook Gubernur</label
								>
								<input
									type="text"
									id="fb_gubernur"
									bind:value={formData.fb_gubernur}
									placeholder="https://facebook.com/..."
									class="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-ppid-primary focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
								/>
							</div>
						</div>
					</div>

					<div>
						<label
							for="foto_wakil"
							class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Foto Wakil Gubernur
						</label>

						{#if currentData.foto_wakil}
							<div class="mb-4">
								<img
									src={`${PUBLIC_API_URL}/storage/${currentData.foto_wakil}`}
									alt="Wakil Gubernur Sulawesi Selatan"
									class="h-80 w-64 rounded-xl object-cover shadow-lg"
								/>
							</div>
						{/if}

						<FilePond
							id="foto_wakil"
							name="foto_wakil"
							bind:value={uploadedWakil}
							acceptedFileTypes={['image/jpeg', 'image/png', 'image/jpg']}
							label="Foto Wakil Gubernur"
						/>
						<p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
							Format: JPG, PNG • Maksimal: 5MB
						</p>

						<div class="mt-4 space-y-4">
							<div>
								<label
									for="ig_wakil"
									class="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400"
									>Instagram Wakil Gubernur</label
								>
								<input
									type="text"
									id="ig_wakil"
									bind:value={formData.ig_wakil}
									placeholder="https://instagram.com/..."
									class="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-ppid-primary focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
								/>
							</div>
							<div>
								<label
									for="fb_wakil"
									class="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400"
									>Facebook Wakil Gubernur</label
								>
								<input
									type="text"
									id="fb_wakil"
									bind:value={formData.fb_wakil}
									placeholder="https://facebook.com/..."
									class="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-ppid-primary focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
								/>
							</div>
						</div>
					</div>
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
