<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const user = $derived(data.user);

	// Format date (mengikuti helper di contoh kamu)
	function formatDate(dateString: string | null): string {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}
</script>

<svelte:head>
	<title>Profil User - Admin PPID</title>
</svelte:head>

<div class="mb-4 flex items-center justify-between">
	<h2 class="text-xl leading-tight font-semibold text-slate-800 dark:text-slate-100">
		Profil Pengguna
	</h2>
</div>

<div class="grid gap-6 md:grid-cols-3">
	<div class="md:col-span-1">
		<div
			class="overflow-hidden rounded-xl border border-slate-100 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div
				class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-ppid-primary/10 text-ppid-primary"
			>
				<svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
					/>
				</svg>
			</div>
			<h3 class="text-lg font-bold text-slate-800 dark:text-white">{user?.name || 'User'}</h3>
			<p class="text-sm text-slate-500 dark:text-slate-400">{user?.username}</p>
		</div>
	</div>

	<div class="space-y-4 md:col-span-2">
		<div
			class="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div
				class="border-b border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/30"
			>
				<h3 class="font-semibold text-slate-700 dark:text-slate-200">Informasi Detail</h3>
			</div>

			<div class="p-6">
				{#if user}
					<dl class="divide-y divide-slate-100 dark:divide-slate-700">
						<div class="grid grid-cols-3 gap-4 py-4">
							<dt class="text-sm font-medium text-slate-500">Nama Lengkap</dt>
							<dd class="col-span-2 text-sm text-slate-800 dark:text-slate-200">{user.name}</dd>
						</div>
						<div class="grid grid-cols-3 gap-4 py-4">
							<dt class="text-sm font-medium text-slate-500">SKPD</dt>
							<dd class="col-span-2 text-sm text-slate-800 dark:text-slate-200">
								{user.skpd?.nm_skpd || '-'}
							</dd>
						</div>
						<div class="grid grid-cols-3 gap-4 py-4">
							<dt class="text-sm font-medium text-slate-500">Login Terakhir</dt>
							<dd class="col-span-2 text-sm text-slate-800 dark:text-slate-200">
								<div>{formatDate(user.last_login?.createdAt)}</div>
								<div class="mt-1 text-xs text-slate-400">IP: {user.last_login?.ip || '-'}</div>
							</dd>
						</div>
					</dl>
				{:else}
					<p class="py-4 text-center text-slate-500">Data profil tidak ditemukan.</p>
				{/if}
			</div>
		</div>
	</div>
</div>
