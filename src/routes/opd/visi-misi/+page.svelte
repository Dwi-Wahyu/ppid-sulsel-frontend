<script lang="ts">
	import { api } from '$lib/api';
	import { invalidateAll } from '$app/navigation';
	import { untrack } from 'svelte';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import FilePond from '$lib/components/FilePond.svelte';
	import { getImageUrl } from '$lib/get-image-url';

	let { data } = $props();

	// State management
	let loading = $state(false);
	let showNotification = $state(false);
	let notificationMessage = $state('');
	let notificationType = $state<'success' | 'danger'>('success');

	// Form states
	let visimisiType = $state<'text' | 'file'>(untrack(() => data.skpd?.visimisi_type || 'text'));
	let visimisi_text = $state(untrack(() => data.skpd?.visimisi_text || ''));
	let currentVisimisi = $state(untrack(() => data.skpd?.visimisi || ''));
	let uploadedVisimisi = $state<File | null>(null);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!data.skpd) return;
		loading = true;

		try {
			const formData = new FormData();
			formData.append('_method', 'PUT');
			formData.append('visimisi_type', visimisiType);

			if (visimisiType === 'text') {
				formData.append('visimisi', visimisi_text);
			} else if (uploadedVisimisi) {
				formData.append('visimisi', uploadedVisimisi);
			}

			const response = await api.post(`/admin/skpd/${data.skpd.id_skpd}/visi-misi`, formData);

			if (response.success) {
				notificationType = 'success';
				notificationMessage = 'Visi & Misi berhasil diperbarui';
				currentVisimisi = response.data.visimisi;
				await invalidateAll();
			} else {
				throw new Error(response.message || 'Gagal memperbarui data');
			}
		} catch (error: any) {
			notificationType = 'danger';
			notificationMessage = error.message || 'Terjadi kesalahan sistem';
		} finally {
			loading = false;
			showNotification = true;
		}
	}
</script>

<svelte:head>
	<title>Kelola Visi & Misi - OPD Panel</title>
</svelte:head>

<div class="mb-8">
	<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Visi & Misi</h1>
	<p class="text-slate-500">Kelola konten visi dan misi instansi Anda.</p>
</div>

<div class="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm dark:bg-slate-800">
	{#if data.skpd}
		<form onsubmit={handleSubmit} class="space-y-8">
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<div id="format-label" class="text-sm font-semibold text-slate-700 dark:text-slate-300">
						Format Konten
					</div>
					<!-- <div role="group" aria-labelledby="format-label" class="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
						<button
							type="button"
							class="rounded-md px-4 py-1.5 text-xs font-bold transition-all {visimisiType === 'text'
								? 'bg-white text-ppid-primary shadow-sm dark:bg-slate-800'
								: 'text-slate-500 hover:text-slate-700'}"
							onclick={() => (visimisiType = 'text')}
						>
							Teks Editor
						</button>
						<button
							type="button"
							class="rounded-md px-4 py-1.5 text-xs font-bold transition-all {visimisiType === 'file'
								? 'bg-white text-ppid-primary shadow-sm dark:bg-slate-800'
								: 'text-slate-500 hover:text-slate-700'}"
							onclick={() => (visimisiType = 'file')}
						>
							File PDF
						</button>
					</div> -->
				</div>

				{#if visimisiType === 'file'}
					<div class="space-y-2">
						<label
							for="visimisi-file"
							class="block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Unggah File PDF
						</label>
						<FilePond
							id="visimisi-file"
							name="visimisi"
							allowMultiple={false}
							acceptedFileTypes={['application/pdf']}
							bind:value={uploadedVisimisi}
							label={'Seret PDF visi misi atau <span class="filepond--label-action">Telusuri</span>'}
						/>
					</div>
					{#if currentVisimisi && currentVisimisi
							.toLowerCase()
							.endsWith('.pdf') && !uploadedVisimisi}
						<p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
							<a
								href={getImageUrl('visimisi-skpd/' + currentVisimisi)}
								target="_blank"
								class="text-ppid-primary hover:underline">Lihat PDF saat ini</a
							>
						</p>
					{/if}
				{:else}
					<TinyMCE bind:value={visimisi_text} height={500} />
				{/if}
			</div>

			<div class="flex justify-end pt-4">
				<button
					type="submit"
					disabled={loading}
					class="rounded-xl bg-ppid-primary px-8 py-3 font-bold text-white shadow-lg shadow-ppid-primary/20 transition-all hover:bg-ppid-primary/90 active:scale-95 disabled:opacity-50"
				>
					{loading ? 'Menyimpan...' : 'Simpan Perubahan'}
				</button>
			</div>
		</form>
	{/if}
</div>

<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'Berhasil!' : 'Gagal!'}
	description={notificationMessage}
/>
