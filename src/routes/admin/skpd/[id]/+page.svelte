<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { goto, invalidateAll } from '$app/navigation';
	import FilePond from '$lib/components/FilePond.svelte';
	import TinyMCE from '$lib/components/TinyMCE.svelte';

	let { data } = $props();

	// State management
	let loading = $state(false);

	// Form data
	let formData = $state({
		nm_skpd: data.skpd?.nm_skpd || '',
		alamat: data.skpd?.alamat || '',
		email: data.skpd?.email || '',
		no_tlp: data.skpd?.no_tlp || '',
		website: data.skpd?.website || '',
		kadis: data.skpd?.kadis || '',
		sek: data.skpd?.sek || '',
		jenis: data.skpd?.jenis || '',
		is_active: data.skpd?.is_active || '1',
		visimisi: data.skpd?.visimisi || '',
		tupoksi: data.skpd?.tupoksi || ''
	});

	let uploadedLogo: File | null = $state(null);

	// Validation errors
	let errors = $state<Record<string, string[]>>({});

	// Notification
	let notification = $state({
		show: false,
		type: 'success' as 'success' | 'error',
		message: ''
	});

	function showNotification(type: 'success' | 'error', message: string) {
		notification = { show: true, type, message };
		setTimeout(() => {
			notification = { show: false, type: 'success', message: '' };
		}, 5000);
	}

	// Handle update
	async function handleUpdate() {
		loading = true;
		errors = {};

		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('access_token='))
			?.split('=')[1];

		try {
			const submitFormData = new FormData();

			// Append all form fields
			Object.entries(formData).forEach(([key, value]) => {
				if (value !== null && value !== undefined) {
					submitFormData.append(key, value);
				}
			});

			// Append logo if uploaded
			if (uploadedLogo) {
				submitFormData.append('logo', uploadedLogo);
			}

			// Add _method for Laravel PUT simulation
			submitFormData.append('_method', 'PUT');

			const response = await fetch(`${PUBLIC_API_URL}/admin/skpd/${data.skpd?.id_skpd}`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				},
				body: submitFormData
			});

			const result = await response.json();

			if (response.ok && result.success) {
				showNotification('success', result.message || 'SKPD berhasil diperbarui');
				await invalidateAll();
			} else {
				if (result.errors) {
					errors = result.errors;
				}
				showNotification('error', result.message || 'Gagal memperbarui SKPD');
			}
		} catch (error) {
			showNotification('error', 'Terjadi kesalahan pada server');
		} finally {
			loading = false;
		}
	}

	// Navigate back to list
	function goBack() {
		goto('/admin/skpd');
	}
</script>

<svelte:head>
	<title>Detail SKPD - Admin PPID</title>
</svelte:head>

<div class="mb-6 flex items-center gap-3">
	<button
		onclick={goBack}
		class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
		title="Kembali"
	>
		<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 19l-7-7m0 0l7-7m-7 7h18"
			></path>
		</svg>
	</button>
	<div>
		<h2 class="text-xl leading-tight font-semibold text-slate-800 dark:text-slate-100">
			Detail SKPD
		</h2>
		<p class="mt-1 text-sm text-slate-600 dark:text-slate-400">Kelola informasi SKPD</p>
	</div>
</div>

<div
	class="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
>
	<h3 class="mb-6 text-lg font-bold text-blue-600 dark:text-blue-400">
		{data.skpd.nm_skpd}
	</h3>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleUpdate();
		}}
	>
		<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Logo -->
			<div>
				<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
					Logo SKPD
				</label>
				<FilePond
					name="logo"
					allowMultiple={false}
					acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
					bind:value={uploadedLogo}
					label={'Seret & Letakkan file atau <span class="filepond--label-action">Telusuri</span>'}
				/>
				{#if data.skpd.logo && !uploadedLogo}
					<p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
						Logo saat ini:
						<a
							href={`${PUBLIC_API_URL}/storage/${data.skpd.logo}`}
							target="_blank"
							class="text-blue-600 hover:underline dark:text-blue-400"
						>
							Lihat logo
						</a>
					</p>
				{/if}
				{#if errors.logo}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.logo[0]}</p>
				{/if}
			</div>

			<!-- Nama SKPD -->
			<div class="col-span-1 md:col-span-2">
				<label
					for="nm_skpd"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Nama SKPD <span class="text-red-500">*</span>
				</label>
				<input
					id="nm_skpd"
					type="text"
					bind:value={formData.nm_skpd}
					required
					class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
				/>
				{#if errors.nm_skpd}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nm_skpd[0]}</p>
				{/if}
			</div>

			<!-- Alamat -->
			<div class="col-span-1 md:col-span-2">
				<label
					for="alamat"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Alamat
				</label>
				<input
					id="alamat"
					type="text"
					bind:value={formData.alamat}
					class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
				/>
				{#if errors.alamat}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.alamat[0]}</p>
				{/if}
			</div>

			<!-- Email -->
			<div>
				<label
					for="email"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Email
				</label>
				<input
					id="email"
					type="email"
					bind:value={formData.email}
					class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
				/>
				{#if errors.email}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email[0]}</p>
				{/if}
			</div>

			<!-- No Telepon -->
			<div>
				<label
					for="no_tlp"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					No Telepon
				</label>
				<input
					id="no_tlp"
					type="text"
					bind:value={formData.no_tlp}
					class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
				/>
				{#if errors.no_tlp}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.no_tlp[0]}</p>
				{/if}
			</div>

			<!-- Website -->
			<div>
				<label
					for="website"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Website
				</label>
				<input
					id="website"
					type="url"
					bind:value={formData.website}
					class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
				/>
				{#if errors.website}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.website[0]}</p>
				{/if}
			</div>

			<!-- Jenis -->
			<div>
				<label
					for="jenis"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Jenis
				</label>
				<select
					id="jenis"
					bind:value={formData.jenis}
					class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
				>
					<option value="">-- Pilih Jenis --</option>
					<option value="opd">OPD</option>
					<option value="kab">Kabupaten</option>
				</select>
				{#if errors.jenis}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jenis[0]}</p>
				{/if}
			</div>

			<!-- Kepala Dinas -->
			<div>
				<label
					for="kadis"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Kepala Dinas
				</label>
				<input
					id="kadis"
					type="text"
					bind:value={formData.kadis}
					class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
				/>
				{#if errors.kadis}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.kadis[0]}</p>
				{/if}
			</div>

			<!-- Sekretaris -->
			<div>
				<label for="sek" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
					Sekretaris
				</label>
				<input
					id="sek"
					type="text"
					bind:value={formData.sek}
					class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
				/>
				{#if errors.sek}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sek[0]}</p>
				{/if}
			</div>

			<!-- Status Aktif -->
			<div>
				<label
					for="is_active"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Status Aktif
				</label>
				<select
					id="is_active"
					bind:value={formData.is_active}
					class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
				>
					<option value="1">Aktif</option>
					<option value="0">Tidak Aktif</option>
				</select>
				{#if errors.is_active}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.is_active[0]}</p>
				{/if}
			</div>
		</div>

		<div class="mb-6 space-y-6">
			<!-- Visi Misi -->
			<div>
				<label
					for="visimisi"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Visi Misi
				</label>
				<TinyMCE bind:value={formData.visimisi} id="visimisi" height={400} />
				{#if errors.visimisi}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.visimisi[0]}</p>
				{/if}
			</div>

			<!-- Tupoksi -->
			<div>
				<label
					for="tupoksi"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Tupoksi
				</label>
				<TinyMCE bind:value={formData.tupoksi} id="tupoksi" height={400} />
				{#if errors.tupoksi}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tupoksi[0]}</p>
				{/if}
			</div>
		</div>

		<div class="flex items-center justify-end gap-4">
			<button
				type="button"
				onclick={goBack}
				class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
			>
				Batal
			</button>
			<button
				type="submit"
				disabled={loading}
				class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-400 dark:bg-blue-600 dark:hover:bg-blue-700"
			>
				{loading ? 'Menyimpan...' : 'Simpan Perubahan'}
			</button>
		</div>
	</form>
</div>

<!-- Notification -->
{#if notification.show}
	<div
		class="fixed right-4 bottom-4 z-50 max-w-sm rounded-lg p-4 shadow-lg {notification.type ===
		'success'
			? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
			: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}"
	>
		<p class="font-medium">{notification.message}</p>
	</div>
{/if}

<!-- Loading Overlay -->
{#if loading}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
	</div>
{/if}
