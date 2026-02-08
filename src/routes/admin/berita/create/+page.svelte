<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	interface SKPD {
		id_skpd: string;
		nm_skpd: string;
	}

	let judul = $state('');
	let deskripsi = $state('');
	let id_skpd = $state('');
	let verify = $state('t');
	let img_berita = $state<any>(null);

	let skpdList = $state<SKPD[]>([]);
	let isLoading = $state(true);
	let isSaving = $state(false);

	// Notification
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Confirmation
	let showConfirm = $state(false);

	onMount(async () => {
		await fetchSKPD();
	});

	async function fetchSKPD() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/skpd`, {
				credentials: 'include'
			});
			const result = await response.json();
			if (result.data) {
				skpdList = result.data;
			}
		} catch (error) {
			console.error('Failed to fetch SKPD:', error);
		} finally {
			isLoading = false;
		}
	}

	async function handleSubmit() {
		isSaving = true;

		try {
			const formData = new FormData();
			formData.append('judul', judul);
			formData.append('deskripsi', deskripsi);
			if (id_skpd) formData.append('id_skpd', id_skpd);
			formData.append('verify', verify);

			if (img_berita) {
				formData.append('img_berita', img_berita);
			}

			const response = await fetch(`${PUBLIC_API_URL}/admin/berita`, {
				method: 'POST',
				credentials: 'include',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				notificationType = 'success';
				notificationMessage = 'Berita berhasil ditambahkan';
				showNotification = true;

				setTimeout(() => {
					goto('/admin/berita');
				}, 1500);
			} else {
				notificationType = 'error';
				notificationMessage = result.message || 'Gagal menyimpan berita';
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
	<title>Tambah Berita - Admin PPID</title>
</svelte:head>

<div class="mx-auto max-w-4xl">
	<div
		class="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<!-- Header -->
		<div class="border-b border-slate-100 p-6 dark:border-slate-700">
			<h3 class="text-lg font-bold text-ppid-primary dark:text-white">Form Tambah Berita</h3>
		</div>

		<!-- Form -->
		<form
			onsubmit={(e) => {
				e.preventDefault();
				showConfirm = true;
			}}
			class="space-y-6 p-6"
		>
			<!-- Judul -->
			<div>
				<label
					for="judul"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Judul Berita
				</label>
				<input
					type="text"
					id="judul"
					bind:value={judul}
					required
					aria-required="true"
					class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-ppid-accent focus:ring-1 focus:ring-ppid-accent focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
					placeholder="Masukkan judul berita"
				/>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- SKPD -->
				<div>
					<label
						for="id_skpd"
						class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
					>
						SKPD Terkait
					</label>
					<select
						id="id_skpd"
						bind:value={id_skpd}
						class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-ppid-accent focus:ring-1 focus:ring-ppid-accent focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
					>
						<option value="">-- Pilih SKPD --</option>
						{#each skpdList as skpd}
							<option value={skpd.id_skpd}>{skpd.nm_skpd}</option>
						{/each}
					</select>
				</div>

				<!-- Status Verifikasi -->
				<div>
					<label
						for="verify"
						class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
					>
						Status Verifikasi
					</label>
					<select
						id="verify"
						bind:value={verify}
						required
						class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-ppid-accent focus:ring-1 focus:ring-ppid-accent focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
					>
						<option value="n">Belum Verifikasi</option>
						<option value="y">Terverifikasi</option>
						<option value="t">Ditolak</option>
					</select>
				</div>
			</div>

			<!-- Gambar Sampul -->
			<div>
				<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
					Gambar Sampul
				</label>
				<FilePond
					bind:value={img_berita}
					name="img_berita"
					acceptedFileTypes={['image/png', 'image/jpeg', 'image/gif']}
					label="Seret & Letakkan file atau <span class='filepond--label-action'>Telusuri</span>"
				/>
			</div>

			<!-- Konten Berita -->
			<div>
				<label
					for="deskripsi"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Konten Berita
				</label>
				<TinyMCE bind:value={deskripsi} id="deskripsi" height={500} />
			</div>

			<!-- Actions -->
			<div class="flex justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-700">
				<a
					href="/admin/berita"
					class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
				>
					Batal
				</a>
				<button
					type="submit"
					disabled={isSaving}
					aria-busy={isSaving}
					class="hover:bg-ppid-dark rounded-lg bg-ppid-primary px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isSaving ? 'Menyimpan...' : 'Simpan Berita'}
				</button>
			</div>
		</form>
	</div>
</div>

<!-- Confirmation Dialog -->
<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan Berita?"
	description="Apakah Anda yakin ingin menyimpan berita ini?"
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
