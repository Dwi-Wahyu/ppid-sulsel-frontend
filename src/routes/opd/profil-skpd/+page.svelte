<script lang="ts">
	import { api } from '$lib/api';
	import { untrack } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import { getImageUrl } from '$lib/get-image-url';

	let { data } = $props();

	// State management
	let loading = $state(false);
	let showNotification = $state(false);
	let notificationMessage = $state('');
	let notificationType = $state<'success' | 'danger'>('success');

	// Form states
	let skpd = $state(untrack(() => data.skpd || null));
	let uploadedLogo = $state<File | null>(null);
	let alamat = $state(untrack(() => data.skpd?.alamat || ''));
	let no_telp = $state(untrack(() => data.skpd?.no_tlp || ''));
	let website = $state(untrack(() => data.skpd?.website || ''));
	let email = $state(untrack(() => data.skpd?.email || ''));

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!skpd) return;
		loading = true;

		try {
			const formData = new FormData();
			formData.append('_method', 'PUT');
			formData.append('nm_skpd', skpd.nm_skpd || '');
			formData.append('is_active', skpd.is_active || '1');
			formData.append('alamat', alamat);
			formData.append('no_tlp', no_telp);
			formData.append('website', website);
			formData.append('email', email);

			if (uploadedLogo) {
				formData.append('logo', uploadedLogo);
			}

			const response = await api.post(`/admin/skpd/${skpd.id_skpd}`, formData);

			if (response.success) {
				notificationType = 'success';
				notificationMessage = 'Profil SKPD berhasil diperbarui';
				skpd = response.data;
				// Update form states with new data from server
				alamat = response.data.alamat || '';
				no_telp = response.data.no_tlp || '';
				website = response.data.website || '';
				email = response.data.email || '';
				await invalidateAll();
			} else {
				throw new Error(response.message || 'Gagal memperbarui profil');
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
	<title>Profil SKPD - OPD Panel</title>
</svelte:head>

<div class="mb-8">
	<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Profil SKPD</h1>
	<p class="text-slate-500">Kelola informasi identitas instansi Anda.</p>
</div>

{#if skpd}
	<div class="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm dark:bg-slate-800">
		<form onsubmit={handleSubmit} class="space-y-8">
			<!-- Logo Section -->
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<div class="space-y-4">
					<label
						for="logo-upload"
						class="block text-sm font-semibold text-slate-700 dark:text-slate-300"
					>
						Logo Instansi
					</label>
					<FilePond
						id="logo-upload"
						bind:value={uploadedLogo}
						acceptedFileTypes={['image/png', 'image/jpeg']}
						label={'Seret logo atau <span class="filepond--label-action">Telusuri</span>'}
					/>
					{#if skpd.logo && !uploadedLogo}
						<p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
							<a href={getImageUrl('logo-skpd/' + skpd.logo)} target="_blank" class="text-blue-600 hover:underline"
								>Lihat logo saat ini</a
							>
						</p>
					{/if}
				</div>

				<div class="space-y-6 md:col-span-2">
					<!-- Nama SKPD (Read Only) -->
					<div>
						<label
							for="nama-instansi"
							class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Nama Instansi
						</label>
						<input
							id="nama-instansi"
							type="text"
							value={skpd.nm_skpd}
							disabled
							class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 dark:border-slate-700 dark:bg-slate-900"
						/>
					</div>

					<!-- Alamat -->
					<div>
						<label
							for="alamat-kantor"
							class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Alamat Kantor
						</label>
						<textarea
							id="alamat-kantor"
							bind:value={alamat}
							rows="3"
							class="w-full rounded-xl border border-slate-200 px-4 py-3 ring-ppid-primary/20 transition-all outline-none focus:border-ppid-primary focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
						></textarea>
					</div>
				</div>
			</div>

			<hr class="border-slate-100 dark:border-slate-700" />

			<!-- Kontak Grid -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label
						for="no-telp"
						class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
					>
						Nomor Telepon
					</label>
					<input
						id="no-telp"
						type="text"
						bind:value={no_telp}
						class="w-full rounded-xl border border-slate-200 px-4 py-3 ring-ppid-primary/20 transition-all outline-none focus:border-ppid-primary focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
					/>
				</div>

				<div>
					<label
						for="email-resmi"
						class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
					>
						Email Resmi
					</label>
					<input
						id="email-resmi"
						type="email"
						bind:value={email}
						class="w-full rounded-xl border border-slate-200 px-4 py-3 ring-ppid-primary/20 transition-all outline-none focus:border-ppid-primary focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
					/>
				</div>

				<div class="md:col-span-2">
					<label
						for="website-resmi"
						class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
					>
						Alamat Website
					</label>
					<input
						id="website-resmi"
						type="url"
						bind:value={website}
						placeholder="https://..."
						class="w-full rounded-xl border border-slate-200 px-4 py-3 ring-ppid-primary/20 transition-all outline-none focus:border-ppid-primary focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
					/>
				</div>
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
	</div>
{:else if loading}
	<div class="p-12 text-center">
		<div class="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
		<p class="mt-4 text-slate-600">Memuat data profil...</p>
	</div>
{:else}
	<div class="rounded-xl border border-slate-100 bg-white p-12 text-center dark:bg-slate-800">
		<p class="text-slate-600">Data SKPD tidak ditemukan.</p>
	</div>
{/if}

<NotificationDialog
	bind:show={showNotification}
	title={notificationType === 'success' ? 'Berhasil!' : 'Gagal!'}
	description={notificationMessage}
/>
