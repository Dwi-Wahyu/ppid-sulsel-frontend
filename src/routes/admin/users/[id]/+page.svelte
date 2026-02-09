<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { api } from '$lib/api';

	// State menggunakan Runes Svelte 5
	let user = $state<any>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	/**
	 * Mengambil detail user berdasarkan ID dari parameter URL
	 * Menggunakan helper api.get yang melalui Proxy SvelteKit
	 */
	async function fetchUserDetail() {
		const id = page.params.id;
		loading = true;
		error = null;

		try {
			// Memanggil endpoint detail user di Laravel
			const res = await api.get(`/admin/users/${id}`);
			if (res.success) {
				user = res.data;
			}
		} catch (err: any) {
			console.error('Error fetching user detail:', err);
			error = err.message || 'Gagal memuat data pengguna.';
		} finally {
			loading = false;
		}
	}

	function formatDate(dateStr: string | null) {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	onMount(() => {
		fetchUserDetail();
	});
</script>

<svelte:head>
	<title>{user ? `Detail: ${user.name}` : 'Detail User'} - Admin PPID</title>
</svelte:head>

<div class="space-y-6 p-6">
	<div class="flex items-center gap-4">
		<a
			href="/admin/users"
			class="rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
			aria-label="Kembali ke daftar user"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</a>
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Detail User</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">
				Informasi lengkap akun pengguna dan akses sistem.
			</p>
		</div>
	</div>

	{#if loading}
		<div class="flex flex-col items-center justify-center py-24" aria-live="polite">
			<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
			<p class="mt-4 text-sm text-slate-500">Memuat data user...</p>
		</div>
	{:else if error}
		<div class="rounded-2xl border border-red-100 bg-red-50 p-8 text-center" role="alert">
			<p class="text-red-600">{error}</p>
			<button onclick={fetchUserDetail} class="mt-4 text-sm font-semibold text-red-700 underline">
				Coba lagi
			</button>
		</div>
	{:else if user}
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<div class="space-y-6">
				<div
					class="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<div
						class="mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
					>
						{user.name?.charAt(0).toUpperCase()}
					</div>
					<h2 class="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
					<p class="mb-4 text-sm text-slate-500 dark:text-slate-400">@{user.username}</p>

					<div class="flex flex-wrap justify-center gap-2">
						{#each user.roles || [] as role}
							<span
								class="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:border-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400"
							>
								{role.display_name || role.name}
							</span>
						{:else}
							<span class="text-xs italic text-slate-400 text-sm">Tidak ada peran akses.</span>
						{/each}
					</div>
				</div>

				<div
					class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<h3 class="mb-4 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
						<svg
							class="h-5 w-5 text-indigo-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Info Akun
					</h3>
					<div class="space-y-4 text-sm">
						<div>
							<div class="text-xs font-semibold tracking-wider text-slate-400 uppercase">Email</div>
							<div class="font-medium text-slate-700 dark:text-slate-200">{user.email || '-'}</div>
						</div>
						<div>
							<div class="text-xs font-semibold tracking-wider text-slate-400 uppercase">
								Dibuat Pada
							</div>
							<div class="font-medium text-slate-700 dark:text-slate-200">
								{formatDate(user.created_at)}
							</div>
						</div>
						<div>
							<div class="text-xs font-semibold tracking-wider text-slate-400 uppercase">
								Terakhir Diperbarui
							</div>
							<div class="font-medium text-slate-700 dark:text-slate-200">
								{formatDate(user.updated_at)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="space-y-6 lg:col-span-2">
				<div
					class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<div
						class="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-700/50"
					>
						<h3 class="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
							<svg
								class="h-5 w-5 text-indigo-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
								/>
							</svg>
							Informasi SKPD
						</h3>
					</div>
					<div class="p-6">
						{#if user.skpd}
							<div>
								<div class="text-xs font-semibold tracking-wider text-slate-400 uppercase">
									Nama SKPD
								</div>
								<div class="mt-1 text-sm font-medium text-slate-900 dark:text-white">
									{user.skpd.nm_skpd}
								</div>
							</div>
						{:else}
							<div class="flex flex-col items-center py-4 text-slate-500">
								<p class="text-sm italic">User ini tidak terasosiasi dengan SKPD manapun.</p>
							</div>
						{/if}
					</div>
				</div>

				<div
					class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<div
						class="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-700/50"
					>
						<h3 class="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
							<svg
								class="h-5 w-5 text-indigo-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Aktivitas Login Terakhir
						</h3>
					</div>
					<div class="p-6">
						{#if user.lastLogin}
							<div class="flex items-center gap-4">
								<div
									class="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
								>
									<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
										/>
									</svg>
								</div>
								<div>
									<div class="font-bold text-slate-900 dark:text-white">Login Berhasil</div>
									<div class="text-sm text-slate-500 dark:text-slate-400">
										{formatDate(user.lastLogin.createdAt)}
									</div>
									<div class="mt-1 text-xs text-slate-400">IP Address: {user.lastLogin.ip}</div>
								</div>
							</div>
						{:else}
							<div class="flex flex-col items-center py-4 text-slate-500">
								<p class="text-sm italic">Belum ada riwayat login tercatat.</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
