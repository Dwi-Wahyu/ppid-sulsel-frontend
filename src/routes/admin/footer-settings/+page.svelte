<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	interface Settings {
		is_stats_visible: boolean;
		footer_logo: string | null;
		footer_description: string;
		footer_phone: string;
		footer_email: string;
		footer_address: string;
		social_facebook: string;
		social_twitter: string;
		social_instagram: string;
		social_youtube: string;
		privacy_policy: string;
		terms_conditions: string;
	}

	let settings = $state<Settings>({
		is_stats_visible: true,
		footer_logo: null,
		footer_description: '',
		footer_phone: '',
		footer_email: '',
		footer_address: '',
		social_facebook: '',
		social_twitter: '',
		social_instagram: '',
		social_youtube: '',
		privacy_policy: '',
		terms_conditions: ''
	});

	let newLogo = $state<any>(null);
	let isLoading = $state(true);
	let isSaving = $state(false);

	// Notification
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Confirmation
	let showConfirm = $state(false);

	onMount(async () => {
		await fetchSettings();
	});

	async function fetchSettings() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/footer-settings`, {
				credentials: 'include'
			});
			const result = await response.json();

			if (result.success) {
				settings = result.data;
			}
		} catch (error) {
			console.error('Failed to fetch settings:', error);
		} finally {
			isLoading = false;
		}
	}

	async function handleSubmit() {
		isSaving = true;

		try {
			const formData = new FormData();
			formData.append('is_stats_visible', settings.is_stats_visible ? '1' : '0');
			formData.append('footer_description', settings.footer_description);
			formData.append('footer_phone', settings.footer_phone);
			formData.append('footer_email', settings.footer_email);
			formData.append('footer_address', settings.footer_address);
			formData.append('social_facebook', settings.social_facebook);
			formData.append('social_twitter', settings.social_twitter);
			formData.append('social_instagram', settings.social_instagram);
			formData.append('social_youtube', settings.social_youtube);
			formData.append('privacy_policy', settings.privacy_policy);
			formData.append('terms_conditions', settings.terms_conditions);

			if (newLogo) {
				formData.append('footer_logo', newLogo);
			}

			const response = await fetch(`${PUBLIC_API_URL}/admin/footer-settings`, {
				method: 'POST',
				credentials: 'include',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				notificationType = 'success';
				notificationMessage = 'Pengaturan footer berhasil diperbarui';
				showNotification = true;
				await fetchSettings();
			} else {
				notificationType = 'error';
				notificationMessage = result.message || 'Gagal memperbarui pengaturan';
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
	<title>Footer Settings - Admin PPID</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div
		class="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<div>
			<h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Footer Settings</h1>
			<p class="mt-1 text-slate-500 dark:text-slate-400">
				Kelola konten footer website (Logo, Kontak, Sosial Media, Legal)
			</p>
		</div>
	</div>

	{#if isLoading}
		<div
			class="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div class="flex flex-col items-center gap-3">
				<svg
					class="h-8 w-8 animate-spin text-blue-600"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				<p class="text-sm text-slate-500 dark:text-slate-400">Memuat pengaturan...</p>
			</div>
		</div>
	{:else}
		<form
			onsubmit={(e) => {
				e.preventDefault();
				showConfirm = true;
			}}
			class="space-y-6"
		>
			<!-- Branding Section -->
			<div
				class="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<h2
					class="border-b border-slate-100 pb-4 text-lg font-bold text-slate-800 dark:border-slate-700 dark:text-slate-100"
				>
					Branding & Logo
				</h2>

				<!-- Statistics Visibility -->
				<div
					class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50"
				>
					<div>
						<h3 class="text-sm font-semibold text-slate-800 dark:text-slate-100">
							Tampilkan Statistik Website
						</h3>
						<p class="text-xs text-slate-500 dark:text-slate-400">
							Tampilkan jumlah pengunjung dan download di footer.
						</p>
					</div>
					<label class="relative inline-flex cursor-pointer items-center">
						<input type="checkbox" bind:checked={settings.is_stats_visible} class="peer sr-only" />
						<div
							class="peer h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-slate-600 dark:bg-slate-700 dark:peer-focus:ring-blue-800"
						></div>
					</label>
				</div>

				<!-- Logo -->
				<div class="space-y-4">
					<label class="block text-sm font-medium text-slate-700 dark:text-slate-300"
						>Logo Footer</label
					>
					<div class="flex items-center gap-6">
						<div
							class="flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-700"
						>
							{#if settings.footer_logo}
								<img
									src={`${PUBLIC_API_URL.replace('/api', '')}/storage/${settings.footer_logo}`}
									alt="Current Logo"
									class="h-full w-full object-contain"
								/>
							{:else}
								<span class="text-center text-xs text-slate-400">No Logo</span>
							{/if}
						</div>
						<div class="flex-1">
							<FilePond
								bind:value={newLogo}
								name="footer_logo"
								acceptedFileTypes={['image/png', 'image/jpeg']}
								label="Seret & Letakkan file atau <span class='filepond--label-action'>Telusuri</span>"
								maxFileSize="2MB"
							/>
							<p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
								Format: JPG, PNG. Max: 2MB. Disarankan background transparan.
							</p>
						</div>
					</div>
				</div>

				<!-- Description -->
				<div>
					<label
						for="footer_description"
						class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>Deskripsi Singkat</label
					>
					<textarea
						id="footer_description"
						bind:value={settings.footer_description}
						rows="3"
						class="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
					></textarea>
				</div>
			</div>

			<!-- Contact Info -->
			<div
				class="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<h2
					class="border-b border-slate-100 pb-4 text-lg font-bold text-slate-800 dark:border-slate-700 dark:text-slate-100"
				>
					Informasi Kontak
				</h2>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label
							for="footer_phone"
							class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>Nomor Telepon</label
						>
						<input
							type="text"
							id="footer_phone"
							bind:value={settings.footer_phone}
							class="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
					</div>
					<div>
						<label
							for="footer_email"
							class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label
						>
						<input
							type="email"
							id="footer_email"
							bind:value={settings.footer_email}
							class="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
					</div>
				</div>

				<div>
					<label
						for="footer_address"
						class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Alamat</label
					>
					<textarea
						id="footer_address"
						bind:value={settings.footer_address}
						rows="2"
						class="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
					></textarea>
				</div>
			</div>

			<!-- Social Media -->
			<div
				class="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<h2
					class="border-b border-slate-100 pb-4 text-lg font-bold text-slate-800 dark:border-slate-700 dark:text-slate-100"
				>
					Social Media Links
				</h2>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label
							for="social_facebook"
							class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>Facebook URL</label
						>
						<input
							type="url"
							id="social_facebook"
							bind:value={settings.social_facebook}
							class="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
					</div>
					<div>
						<label
							for="social_twitter"
							class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>Twitter/X URL</label
						>
						<input
							type="url"
							id="social_twitter"
							bind:value={settings.social_twitter}
							class="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
					</div>
					<div>
						<label
							for="social_instagram"
							class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>Instagram URL</label
						>
						<input
							type="url"
							id="social_instagram"
							bind:value={settings.social_instagram}
							class="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
					</div>
					<div>
						<label
							for="social_youtube"
							class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>YouTube URL</label
						>
						<input
							type="url"
							id="social_youtube"
							bind:value={settings.social_youtube}
							class="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						/>
					</div>
				</div>
			</div>

			<!-- Legal Documents -->
			<div
				class="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<h2
					class="border-b border-slate-100 pb-4 text-lg font-bold text-slate-800 dark:border-slate-700 dark:text-slate-100"
				>
					Dokumen Legal
				</h2>

				<div>
					<label
						for="privacy_policy"
						class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>Privacy Policy</label
					>
					<TinyMCE bind:value={settings.privacy_policy} height={300} />
				</div>

				<div>
					<label
						for="terms_conditions"
						class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>Terms & Conditions</label
					>
					<TinyMCE bind:value={settings.terms_conditions} height={300} />
				</div>
			</div>

			<div class="flex justify-end pt-6">
				<button
					type="submit"
					disabled={isSaving}
					class="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/30 focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
				</button>
			</div>
		</form>
	{/if}
</div>

<!-- Confirmation Dialog -->
<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan Perubahan?"
	description="Apakah Anda yakin ingin menyimpan perubahan pengaturan footer?"
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
