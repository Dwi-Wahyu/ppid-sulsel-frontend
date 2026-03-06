<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	let { data, form } = $props();

	// State
	let showPasswordDialog = $state(false);
	let selectedUser = $state<any>(null);

	// Notification State
	let notificationState = $state<{
		show: boolean;
		title: string;
		message: string;
		type: 'success' | 'error' | 'warning' | 'info';
	}>({
		show: false,
		title: '',
		message: '',
		type: 'success'
	});

	// Form values for client logic
	let oldPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let clientError = $state('');
	let submitting = $state(false);

	$effect(() => {
		if (form) {
			submitting = false;
			if (form.success) {
				showPasswordDialog = false;
				notificationState = {
					show: true,
					title: 'Berhasil',
					message: form.message as string,
					type: 'success'
				};
				// Reset form
				oldPassword = '';
				newPassword = '';
				confirmPassword = '';
				clientError = '';
			} else if (form.error) {
				clientError = (form.message as string) || 'Terjadi kesalahan.';
				if (form.errors) {
					// Extract first error message
					const firstError = Object.values(form.errors)[0] as string[];
					if (firstError && firstError.length > 0) {
						clientError = firstError[0];
					}
				}
			}
		}
	});

	function goBack() {
		goto('/admin/skpd');
	}

	function openPasswordDialog(user: any) {
		selectedUser = user;
		oldPassword = '';
		newPassword = '';
		confirmPassword = '';
		clientError = '';
		showPasswordDialog = true;
	}

	function formatLastLogin(dateString: string | undefined) {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleString('id-ID', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Detail SKPD - Admin PPID</title>
</svelte:head>

<div class="space-y-6">
	<!-- Section 1: SKPD Info -->
	<div
		class="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<div class="mb-6 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<img
					src={data.skpd.logo
						? `${PUBLIC_API_URL}/storage/logo-skpd/${data.skpd.logo}`
						: '/images/logo-sulsel.png'}
					alt="Logo {data.skpd.nm_skpd}"
					class="h-16 w-16 object-contain"
				/>
				<div>
					<h2 class="text-xl font-bold text-slate-800 dark:text-white">{data.skpd.nm_skpd}</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						{data.skpd.jenis?.toUpperCase() || '-'}
					</p>
				</div>
			</div>
			<button
				type="button"
				onclick={goBack}
				class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
			>
				Kembali
			</button>
		</div>

		<dl class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="col-span-1 md:col-span-2">
				<dt class="text-sm font-medium text-slate-500 dark:text-slate-400">Alamat</dt>
				<dd class="mt-1 text-sm text-slate-900 dark:text-slate-100">
					{data.skpd.alamat || '-'}
				</dd>
			</div>
			<div>
				<dt class="text-sm font-medium text-slate-500 dark:text-slate-400">Email</dt>
				<dd class="mt-1 text-sm text-slate-900 dark:text-slate-100">{data.skpd.email || '-'}</dd>
			</div>
			<div>
				<dt class="text-sm font-medium text-slate-500 dark:text-slate-400">No Telepon</dt>
				<dd class="mt-1 text-sm text-slate-900 dark:text-slate-100">{data.skpd.no_tlp || '-'}</dd>
			</div>
			<div>
				<dt class="text-sm font-medium text-slate-500 dark:text-slate-400">Website</dt>
				<dd class="mt-1 text-sm text-slate-900 dark:text-slate-100">
					{#if data.skpd.website}
						<a
							href={data.skpd.website}
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-600 hover:underline dark:text-blue-400"
						>
							{data.skpd.website}
						</a>
					{:else}
						-
					{/if}
				</dd>
			</div>
			<div>
				<dt class="text-sm font-medium text-slate-500 dark:text-slate-400">Status Aktif</dt>
				<dd class="mt-1">
					<span
						class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {data
							.skpd.is_active == 1
							? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
							: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}"
					>
						{data.skpd.is_active == 1 ? 'Aktif' : 'Tidak Aktif'}
					</span>
				</dd>
			</div>
			<div>
				<dt class="text-sm font-medium text-slate-500 dark:text-slate-400">Kepala Dinas</dt>
				<dd class="mt-1 text-sm text-slate-900 dark:text-slate-100">{data.skpd.kadis || '-'}</dd>
			</div>
			<div>
				<dt class="text-sm font-medium text-slate-500 dark:text-slate-400">Sekretaris</dt>
				<dd class="mt-1 text-sm text-slate-900 dark:text-slate-100">{data.skpd.sek || '-'}</dd>
			</div>
		</dl>

		<div class="mt-8 space-y-8">
			<div>
				<dt class="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Visi Misi</dt>
				<dd class="prose prose-sm max-w-none text-slate-900 dark:text-slate-100 dark:prose-invert">
					{#if data.skpd.visimisi}
						{@html data.skpd.visimisi}
					{:else}
						<p class="text-slate-400 italic">Belum ada visi misi.</p>
					{/if}
				</dd>
			</div>
			<div>
				<dt class="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Tupoksi</dt>
				<dd class="prose prose-sm max-w-none text-slate-900 dark:text-slate-100 dark:prose-invert">
					{#if data.skpd.tupoksi}
						{@html data.skpd.tupoksi}
					{:else}
						<p class="text-slate-400 italic">Belum ada tupoksi.</p>
					{/if}
				</dd>
			</div>
		</div>
	</div>

	<!-- Section 2: User List -->
	<div
		class="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<h3 class="mb-4 text-lg font-bold text-slate-800 dark:text-white">Pengguna SKPD</h3>
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm text-slate-500 dark:text-slate-400">
				<thead
					class="bg-slate-50 text-xs text-slate-700 uppercase dark:bg-slate-700/50 dark:text-slate-300"
				>
					<tr>
						<th scope="col" class="px-6 py-3">Nama</th>
						<th scope="col" class="px-6 py-3">Username</th>
						<th scope="col" class="px-6 py-3">Email</th>
						<th scope="col" class="px-6 py-3">Terakhir Login</th>
						<th scope="col" class="px-6 py-3 text-right">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#if data.skpd.user}
						<tr class="border-b bg-white dark:border-slate-700 dark:bg-slate-800">
							<td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
								{data.skpd.user.name || '-'}
							</td>
							<td class="px-6 py-4">{data.skpd.user.username || '-'}</td>
							<td class="px-6 py-4">{data.skpd.user.email || '-'}</td>
							<td class="px-6 py-4">
								{formatLastLogin(data.skpd.user.last_login?.created_at)}
							</td>
							<td class="px-6 py-4 text-right">
								<button
									type="button"
									onclick={() => openPasswordDialog(data.skpd.user)}
									class="inline-flex items-center gap-2 rounded-lg bg-yellow-100 px-3 py-2 text-xs font-medium text-yellow-700 transition-colors hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50"
								>
									Ubah Password
								</button>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="px-6 py-8 text-center text-slate-500">
								Tidak ada pengguna untuk SKPD ini.
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Password Change Dialog -->
<ConfirmationDialog
	bind:show={showPasswordDialog}
	title="Ubah Password Pengguna"
	theme="primary"
	confirmText={submitting ? 'Menyimpan...' : 'Simpan Password'}
	cancelText="Batal"
	onConfirm={() => {
		// Client logic handled by form submission inside the slot, but we can trigger it
		const formEl = document.getElementById('changePasswordForm') as HTMLFormElement;
		if (formEl) formEl.requestSubmit();
	}}
>
	<form
		id="changePasswordForm"
		method="POST"
		action="?/changePassword"
		use:enhance={() => {
			clientError = '';
			if (newPassword === oldPassword) {
				clientError = 'Password baru tidak boleh sama dengan password lama.';
				return ({ update }) => update();
			}
			if (newPassword !== confirmPassword) {
				clientError = 'Konfirmasi password baru tidak cocok.';
				return ({ update }) => update();
			}
			submitting = true;

			return async ({ update }) => {
				await update();
			};
		}}
		class="mt-4 space-y-4 text-left"
	>
		<input type="hidden" name="user_id" value={selectedUser?.id} />

		<div>
			<label
				for="new_password"
				class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
			>
				Password Baru (Min. 8 karakter)
			</label>
			<input
				type="password"
				id="new_password"
				name="new_password"
				bind:value={newPassword}
				required
				minlength="8"
				autocomplete="new-password"
				class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
			/>
		</div>

		<div>
			<label
				for="new_password_confirmation"
				class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
			>
				Konfirmasi Password Baru
			</label>
			<input
				type="password"
				id="new_password_confirmation"
				name="new_password_confirmation"
				bind:value={confirmPassword}
				required
				minlength="8"
				autocomplete="new-password"
				class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
			/>
		</div>

		{#if clientError}
			<p class="text-sm font-medium text-red-600 dark:text-red-400">{clientError}</p>
		{/if}
	</form>
</ConfirmationDialog>

<!-- Global Notification -->
<NotificationDialog
	bind:show={notificationState.show}
	title={notificationState.title}
	message={notificationState.message}
	theme={notificationState.type}
/>
