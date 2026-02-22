<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// State form terikat dengan data dari SSR
	let formData = $state({
		nm_profil: data.profil?.nm_profil || 'Profil Pemerintah Provinsi',
		deskripsi: data.profil?.deskripsi || '',
		ig_gubernur: data.profil?.ig_gubernur || '',
		fb_gubernur: data.profil?.fb_gubernur || '',
		ig_wakil: data.profil?.ig_wakil || '',
		fb_wakil: data.profil?.fb_wakil || ''
	});

	// File state untuk FilePond
	let uploadedGubernur = $state<any>(null);
	let uploadedWakil = $state<any>(null);

	let isSaving = $state(false);
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Handle feedback dari server action
	$effect(() => {
		if (form) {
			notificationType = form.success ? 'success' : 'error';
			notificationMessage = form.message;
			showNotification = true;
			if (form.success) {
				uploadedGubernur = null;
				uploadedWakil = null;
			}
		}
	});
</script>

<svelte:head>
	<title>Profil Pemprov - Admin</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-7xl">
		<header class="mb-8">
			<h1 class="mb-2 text-3xl font-bold text-slate-800 dark:text-white">
				Profil Pemerintah Provinsi
			</h1>
			<p class="text-slate-600 dark:text-slate-400">
				Kelola konten halaman Profil Pemerintah Provinsi Sulawesi Selatan
			</p>
		</header>

		<div
			class="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<form
				method="POST"
				use:enhance={() => {
					isSaving = true;
					return async ({ update }) => {
						await update();
						isSaving = false;
					};
				}}
				enctype="multipart/form-data"
			>
				<input type="hidden" name="tipe" value="pemerintah" />
				<input type="hidden" name="deskripsi" value={formData.deskripsi} />

				<div class="mb-6">
					<label
						for="nm_profil"
						class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
					>
						Judul Halaman
					</label>
					<input
						type="text"
						name="nm_profil"
						id="nm_profil"
						bind:value={formData.nm_profil}
						required
						class="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-ppid-primary focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
					/>
				</div>

				<div class="mb-6 grid gap-6 md:grid-cols-2">
					<div class="space-y-4">
						<h1 class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
							Foto Gubernur
						</h1>
						{#if data.profil?.foto_gubernur}
							<img
								src={`${PUBLIC_BACKEND_URL}/uploads/${data.profil.foto_gubernur}`}
								alt="Gubernur"
								class="h-64 w-full rounded-xl object-cover shadow-md"
							/>
						{/if}
						<FilePond
							bind:value={uploadedGubernur}
							name="foto_gubernur"
							acceptedFileTypes={['image/jpeg', 'image/png']}
							label="Upload Foto Gubernur"
						/>
						<input
							type="text"
							name="ig_gubernur"
							bind:value={formData.ig_gubernur}
							placeholder="Instagram Gubernur"
							class="w-full rounded-lg border-2 border-slate-200 p-2 dark:bg-slate-700"
						/>
						<input
							type="text"
							name="fb_gubernur"
							bind:value={formData.fb_gubernur}
							placeholder="Facebook Gubernur"
							class="w-full rounded-lg border-2 border-slate-200 p-2 dark:bg-slate-700"
						/>
					</div>

					<div class="space-y-4">
						<h1 class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
							Foto Wakil Gubernur
						</h1>
						{#if data.profil?.foto_wakil}
							<img
								src={`${PUBLIC_BACKEND_URL}/uploads/${data.profil.foto_wakil}`}
								alt="Wakil Gubernur"
								class="h-64 w-full rounded-xl object-cover shadow-md"
							/>
						{/if}
						<FilePond
							bind:value={uploadedWakil}
							name="foto_wakil"
							acceptedFileTypes={['image/jpeg', 'image/png']}
							label="Upload Foto Wakil Gubernur"
						/>
						<input
							type="text"
							name="ig_wakil"
							bind:value={formData.ig_wakil}
							placeholder="Instagram Wakil Gubernur"
							class="w-full rounded-lg border-2 border-slate-200 p-2 dark:bg-slate-700"
						/>
						<input
							type="text"
							name="fb_wakil"
							bind:value={formData.fb_wakil}
							placeholder="Facebook Wakil Gubernur"
							class="w-full rounded-lg border-2 border-slate-200 p-2 dark:bg-slate-700"
						/>
					</div>
				</div>

				<div class="mb-6">
					<label
						for="deskripsi"
						class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>Konten Halaman</label
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
	</div>
</div>

<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'Berhasil!' : 'Gagal!'}
	description={notificationMessage}
/>
