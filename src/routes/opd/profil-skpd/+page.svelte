<script lang="ts">
	import { api } from '$lib/api';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';

	let { data } = $props();

	// State management
	let loading = $state(false);
	let skpd = $state<any>(null);

	// State untuk menentukan tipe input tupoksi (file atau teks)
	let tupoksiType = $state<'file' | 'text'>('file');

	let formData = $state({
		nm_skpd: '',
		alamat: '',
		email: '',
		no_tlp: '',
		website: '',
		kadis: '',
		sek: '',
		jenis: '',
		visimisi: '',
		tupoksi_text: '', // State khusus untuk editor TinyMCE
		is_active: '1'
	});

	let uploadedLogo: any = $state(null);
	let uploadedTupoksi: any = $state(null);
	let errors = $state<Record<string, string[]>>({});

	let notification = $state({
		show: false,
		title: '',
		description: '',
		theme: 'success' as 'success' | 'error'
	});

	function triggerNotify(theme: 'success' | 'error', title: string, description: string) {
		notification.theme = theme;
		notification.title = title;
		notification.description = description;
		notification.show = true;
	}

	async function fetchSkpdData() {
		loading = true;
		try {
			const response = await api.get(`/admin/skpd/${data.user?.id_skpd}`);
			if (response.success) {
				skpd = response.data;
				formData = {
					nm_skpd: skpd.nm_skpd || '',
					alamat: skpd.alamat || '',
					email: skpd.email || '',
					no_tlp: skpd.no_tlp || '',
					website: skpd.website || skpd.situs || '',
					kadis: skpd.kadis || '',
					sek: skpd.sek || '',
					jenis: skpd.jenis || '',
					visimisi: skpd.visimisi || '',
					tupoksi_text: '',
					is_active: String(skpd.is_active || '1')
				};

				// Logika deteksi: Jika string tupoksi tidak berakhiran .pdf, anggap itu teks HTML
				if (skpd.tupoksi && !skpd.tupoksi.toLowerCase().endsWith('.pdf')) {
					tupoksiType = 'text';
					formData.tupoksi_text = skpd.tupoksi;
				} else {
					tupoksiType = 'file';
				}
			}
		} catch (error: any) {
			triggerNotify('error', 'Gagal Memuat', error.message || 'Gagal memuat data');
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		fetchSkpdData();
	});

	async function handleUpdate() {
		loading = true;
		errors = {};
		try {
			const submitFormData = new FormData();

			// Tambahkan field dasar ke FormData
			Object.entries(formData).forEach(([key, value]) => {
				if (key !== 'tupoksi_text' && value !== null) {
					submitFormData.append(key, value);
				}
			});

			// Handle Logo
			if (uploadedLogo) {
				const file = Array.isArray(uploadedLogo) ? uploadedLogo[0] : uploadedLogo;
				submitFormData.append('logo', file.file || file);
			}

			// Handle Tupoksi berdasarkan pilihan user
			if (tupoksiType === 'file') {
				if (uploadedTupoksi) {
					const file = Array.isArray(uploadedTupoksi) ? uploadedTupoksi[0] : uploadedTupoksi;
					submitFormData.append('tupoksi', file.file || file);
				}
			} else {
				// Kirim konten TinyMCE sebagai string ke field 'tupoksi'
				submitFormData.append('tupoksi', formData.tupoksi_text);
			}

			submitFormData.append('_method', 'PUT');

			const result = await api.post(`/admin/skpd/${skpd?.id_skpd}`, submitFormData);
			if (result.success) {
				triggerNotify('success', 'Berhasil', result.message || 'Profil SKPD berhasil diperbarui');
				fetchSkpdData();
			}
		} catch (error: any) {
			if (error.errors) errors = error.errors;
			triggerNotify('error', 'Gagal', error.message || 'Gagal memperbarui profil SKPD');
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Profil SKPD - Admin PPID</title>
</svelte:head>

<NotificationDialog
	bind:show={notification.show}
	theme={notification.theme}
	title={notification.title}
	description={notification.description}
/>

<div class="mb-6">
	<h2 class="text-xl leading-tight font-semibold text-slate-800 dark:text-slate-100">
		Profil SKPD
	</h2>
	<p class="mt-1 text-sm text-slate-600 dark:text-slate-400">Kelola informasi profil SKPD Anda</p>
</div>

{#if skpd}
	<div
		class="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleUpdate();
			}}
		>
			<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<h1 class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
						Logo SKPD
					</h1>
					<FilePond
						name="logo"
						allowMultiple={false}
						acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
						bind:value={uploadedLogo}
						label={'Seret logo atau <span class="filepond--label-action">Telusuri</span>'}
					/>
					{#if skpd.logo && !uploadedLogo}
						<p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
							<a
								href="{PUBLIC_BACKEND_URL}/uploads/{skpd.logo}"
								target="_blank"
								class="text-blue-600 hover:underline">Lihat logo saat ini</a
							>
						</p>
					{/if}
				</div>

				<div class="col-span-1 md:col-span-2">
					<label
						for="nm_skpd"
						class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>Nama SKPD *</label
					>
					<input
						id="nm_skpd"
						type="text"
						bind:value={formData.nm_skpd}
						required
						class="w-full rounded-lg border border-slate-300 px-4 py-2 dark:bg-slate-700 dark:text-white"
					/>
					{#if errors.nm_skpd}<p class="mt-1 text-sm text-red-600">{errors.nm_skpd[0]}</p>{/if}
				</div>

				<div class="col-span-1 md:col-span-2">
					<label
						for="alamat"
						class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Alamat</label
					>
					<input
						id="alamat"
						type="text"
						bind:value={formData.alamat}
						class="w-full rounded-lg border border-slate-300 px-4 py-2 dark:bg-slate-700 dark:text-white"
					/>
				</div>

				<div>
					<label
						for="email"
						class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label
					>
					<input
						id="email"
						type="email"
						bind:value={formData.email}
						class="w-full rounded-lg border border-slate-300 px-4 py-2 dark:bg-slate-700 dark:text-white"
					/>
				</div>

				<div>
					<label
						for="no_tlp"
						class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>No Telepon</label
					>
					<input
						id="no_tlp"
						type="text"
						bind:value={formData.no_tlp}
						class="w-full rounded-lg border border-slate-300 px-4 py-2 dark:bg-slate-700 dark:text-white"
					/>
				</div>

				<div>
					<label
						for="website"
						class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Website</label
					>
					<input
						id="website"
						bind:value={formData.website}
						class="w-full rounded-lg border border-slate-300 px-4 py-2 dark:bg-slate-700 dark:text-white"
					/>
				</div>

				<div>
					<label
						for="kadis"
						class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>Kepala Dinas</label
					>
					<input
						id="kadis"
						type="text"
						bind:value={formData.kadis}
						class="w-full rounded-lg border border-slate-300 px-4 py-2 dark:bg-slate-700 dark:text-white"
					/>
				</div>

				<div>
					<label for="sek" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>Sekretaris</label
					>
					<input
						id="sek"
						type="text"
						bind:value={formData.sek}
						class="w-full rounded-lg border border-slate-300 px-4 py-2 dark:bg-slate-700 dark:text-white"
					/>
				</div>
			</div>

			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<h1 class="text-sm font-medium text-slate-700 dark:text-slate-300">
						Tugas Pokok & Fungsi
					</h1>
					<div class="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
						<button
							type="button"
							class="rounded-md px-3 py-1 text-[10px] font-bold transition-all {tupoksiType ===
							'file'
								? 'bg-white text-blue-600 shadow-sm'
								: 'text-slate-500'}"
							onclick={() => (tupoksiType = 'file')}>FILE PDF</button
						>
						<button
							type="button"
							class="rounded-md px-3 py-1 text-[10px] font-bold transition-all {tupoksiType ===
							'text'
								? 'bg-white text-blue-600 shadow-sm'
								: 'text-slate-500'}"
							onclick={() => (tupoksiType = 'text')}>TEKS HTML</button
						>
					</div>
				</div>

				{#if tupoksiType === 'file'}
					<FilePond
						name="tupoksi"
						allowMultiple={false}
						acceptedFileTypes={['application/pdf']}
						bind:value={uploadedTupoksi}
						label={'Seret PDF tupoksi atau <span class="filepond--label-action">Telusuri</span>'}
					/>
					{#if skpd.tupoksi && skpd.tupoksi.toLowerCase().endsWith('.pdf') && !uploadedTupoksi}
						<p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
							<a
								href="{PUBLIC_BACKEND_URL}/uploads/{skpd.tupoksi}"
								target="_blank"
								class="text-blue-600 hover:underline">Lihat PDF saat ini</a
							>
						</p>
					{/if}
				{:else}
					<TinyMCE bind:value={formData.tupoksi_text} height={200} />
				{/if}
			</div>

			<div class="flex items-center justify-end gap-4">
				<button
					type="submit"
					disabled={loading}
					class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-400"
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
