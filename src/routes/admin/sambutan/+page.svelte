<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import { PUBLIC_API_URL } from '$env/static/public';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Inisialisasi state dari data SSR
	let formData = $state({
		nm_profil: data.sambutan?.nm_profil || 'Sambutan',
		deskripsi: data.sambutan?.deskripsi || ''
	});

	let uploadedFile = $state<any>(null);
	let isSaving = $state(false);

	// Notification states
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Reaktif terhadap feedback dari Server Action
	$effect(() => {
		if (form) {
			notificationType = form.success ? 'success' : 'error';
			notificationMessage = form.message;
			showNotification = true;
			if (form.success) uploadedFile = null;
		}
	});
</script>

<svelte:head>
	<title>Sambutan - Admin</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8">
			<h1 class="mb-2 text-3xl font-bold text-slate-800 dark:text-white">Sambutan</h1>
			<p class="text-slate-600 dark:text-slate-400">Kelola konten halaman Sambutan</p>
		</div>

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
				<input type="hidden" name="tipe" value="sambutan" />
				<input type="hidden" name="deskripsi" value={formData.deskripsi} />

				<div class="mb-6">
					<label
						for="nm_profil"
						class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
					>
						Judul Sambutan
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

				<div class="mb-6">
					<label
						for="foto_kepala"
						class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
					>
						Foto Kepala PPID
					</label>

					{#if data.sambutan?.foto_kepala}
						<div class="mb-4">
							<img
								src={`${PUBLIC_API_URL}/storage/${data.sambutan.foto_kepala}`}
								alt="Kepala PPID"
								class="h-80 w-64 rounded-xl object-cover shadow-lg"
							/>
						</div>
					{/if}

					<FilePond
						id="foto_kepala"
						name="foto_kepala"
						bind:value={uploadedFile}
						acceptedFileTypes={['image/jpeg', 'image/png', 'image/jpg']}
						label="Seret & Letakkan foto atau <span class='filepond--label-action'>Telusuri</span>"
					/>
				</div>

				<div class="mb-6">
					<label
						for="deskripsi"
						class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
					>
						Konten Sambutan
					</label>
					<TinyMCE id="deskripsi" bind:value={formData.deskripsi} height={400} />
				</div>

				<div class="flex justify-end">
					<button
						type="submit"
						disabled={isSaving}
						class="hover:bg-opacity-90 flex items-center gap-2 rounded-xl bg-ppid-primary px-8 py-3 font-semibold text-white shadow-md transition-all disabled:opacity-50"
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
