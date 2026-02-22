<script lang="ts">
	import { enhance } from '$app/forms';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	let { data, form } = $props();

	let formData = $state({
		nm_profil: data.profil?.nm_profil || 'Profil PPID',
		deskripsi: data.profil?.deskripsi || ''
	});

	let isSaving = $state(false);
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Reaktif terhadap hasil form action
	$effect(() => {
		if (form) {
			notificationType = form.success ? 'success' : 'error';
			notificationMessage = form.message;
			showNotification = true;
			isSaving = false;
		}
	});
</script>

<svelte:head>
	<title>Profil PPID - Admin</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="mb-2 text-3xl font-bold text-slate-800 dark:text-white">Profil PPID</h1>
				<p class="text-slate-600 dark:text-slate-400">Kelola konten halaman Profil PPID</p>
			</div>
		</div>

		<div
			class="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div class="mb-6 flex items-center gap-3">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-full bg-ppid-primary text-white"
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

			<form
				method="POST"
				use:enhance={() => {
					isSaving = true;
					return async ({ update }) => {
						await update();
						isSaving = false;
					};
				}}
			>
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

				<div class="mb-6">
					<label
						for="deskripsi"
						class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
					>
						Konten Halaman
					</label>
					<input type="hidden" name="deskripsi" value={formData.deskripsi} />
					<TinyMCE id="deskripsi" bind:value={formData.deskripsi} height={400} />
				</div>

				<div class="flex justify-end">
					<button
						type="submit"
						disabled={isSaving}
						class="hover:bg-opacity-90 flex items-center gap-2 rounded-xl bg-ppid-primary px-6 py-3 font-semibold text-white shadow-md transition-all disabled:opacity-50"
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
	</div>
</div>

<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'Berhasil!' : 'Gagal!'}
	description={notificationMessage}
/>
