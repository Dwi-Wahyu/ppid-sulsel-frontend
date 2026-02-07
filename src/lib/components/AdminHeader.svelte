<script lang="ts">
	import { page } from '$app/stores';
	import { scale } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { sidebar } from '$lib/state/sidebar.svelte';
	import { theme } from '$lib/state/theme.svelte';

	let { sidebarOpen = $bindable(false) } = $props();

	// State Lokal
	let darkMode = $state(false);
	let openNotif = $state(false);
	let openProfile = $state(false);

	// Mock Data Notifikasi (Sesuai permintaan)
	let unreadCount = $state(5);
	const mockNotifications = [
		{
			id: 1,
			title: 'Permohonan Baru',
			message: 'Ada permohonan informasi baru masuk',
			time: '5 menit yang lalu',
			read: false
		},
		{
			id: 2,
			title: 'Update Sistem',
			message: 'Sistem telah diperbarui ke versi 2.0',
			time: '1 jam yang lalu',
			read: true
		}
	];

	// Ambil data user dari layout (locals.user yang dikirim via load function)
	const user = $derived($page.data.user);

	// Logika Breadcrumbs dinamis berdasarkan URL SvelteKit
	const breadcrumbs = $derived.by(() => {
		const pathSegments = $page.url.pathname.split('/').filter(Boolean);
		const mapping: Record<string, string> = {
			admin: 'Dashboard',
			faq: 'FAQ',
			skpd: 'SKPD',
			profile: 'Profil',
			settings: 'Pengaturan'
		};

		let currentPath = '';
		return pathSegments
			.filter((segment) => !/^\d+$/.test(segment) && segment.length <= 20)
			.map((segment) => {
				currentPath += `/${segment}`;
				return {
					title: mapping[segment] || segment.replace(/-/g, ' ').toUpperCase(),
					url: currentPath
				};
			});
	});

	function toggleDarkMode() {
		darkMode = !darkMode;
		document.documentElement.classList.toggle('dark');
	}
</script>

<header
	class="flex h-20 items-center justify-between bg-slate-50 px-8 py-5 shadow-sm transition-colors duration-300 dark:bg-slate-800"
>
	<div class="flex max-w-2xl flex-1 items-center gap-4">
		<button
			onclick={() => sidebar.toggle()}
			class="rounded-lg p-2 text-slate-400 hover:bg-slate-200 focus:outline-none md:hidden dark:hover:bg-slate-700"
		>
			{#if sidebarOpen}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon icon-tabler icons-tabler-outline icon-tabler-layout-sidebar-left-collapse"
					><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
						d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12"
					/><path d="M9 4v16" /><path d="M15 10l-2 2l2 2" /></svg
				>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon icon-tabler icons-tabler-outline icon-tabler-layout-sidebar-left-expand"
					><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
						d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12"
					/><path d="M9 4v16" /><path d="M14 10l2 2l-2 2" /></svg
				>
			{/if}
		</button>

		<img
			src="/logo/ppid-light.png"
			alt="Logo PPID"
			class="object-contain transition-all duration-300 dark:hidden {sidebarOpen
				? 'h-7 w-7 md:h-12 md:w-auto'
				: 'h-7 w-7'}"
		/>

		<img
			src="/logo/ppid-dark.png"
			alt="Logo PPID"
			class="hidden object-contain transition-all duration-300 dark:block {sidebarOpen
				? 'h-7 w-7 md:h-12 md:w-auto'
				: 'h-7 w-7'}"
		/>

		<nav class="hidden items-center gap-2 text-sm md:flex">
			{#each breadcrumbs as crumb, i}
				{#if i > 0}<span class="text-slate-300">/</span>{/if}
				<a
					href={crumb.url}
					class="font-medium text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400"
				>
					{crumb.title}
				</a>
			{/each}
		</nav>
	</div>

	<div class="flex items-center gap-4">
		<button
			onclick={() => theme.toggle()}
			class="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
		>
			{#if !theme.darkMode}
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
			{:else}
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
					/>
				</svg>
			{/if}
		</button>

		<div class="relative">
			<button
				onclick={() => (openNotif = !openNotif)}
				class="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
					></path>
				</svg>
				{#if unreadCount > 0}
					<span class="absolute top-1 right-1 flex h-4 w-4">
						<span
							class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"
						></span>
						<span
							class="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
						>
							{unreadCount > 9 ? '9+' : unreadCount}
						</span>
					</span>
				{/if}
			</button>

			{#if openNotif}
				<div
					transition:scale={{ duration: 100, start: 0.95 }}
					class="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white py-2 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
				>
					<div
						class="flex items-center justify-between border-b border-slate-50 px-4 py-2 dark:border-slate-700"
					>
						<span class="text-xs font-bold text-slate-800 uppercase dark:text-slate-200"
							>Notifikasi</span
						>
						<a
							href="/admin/notifications"
							class="text-[10px] font-bold text-blue-600 hover:underline">Lihat Semua</a
						>
					</div>
					<div class="max-h-96 overflow-y-auto">
						{#each mockNotifications as n}
							<div
								class="block border-b border-slate-50 px-4 py-3 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
							>
								<div class="flex gap-3">
									<div class="mt-1 shrink-0">
										<div
											class="p-1.5 {n.read
												? 'bg-slate-100 text-slate-400'
												: 'bg-blue-100 text-blue-600'} rounded-lg"
										>
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
												></path></svg
											>
										</div>
									</div>
									<div class="min-w-0 flex-1 text-left">
										<p class="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
											{n.title}
										</p>
										<p class="mt-0.5 line-clamp-2 text-[10px] text-slate-500">{n.message}</p>
										<p class="mt-1 text-[9px] text-slate-400">{n.time}</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<div class="relative">
			<button
				onclick={() => (openProfile = !openProfile)}
				class="group flex cursor-pointer items-center space-x-3 focus:outline-none"
			>
				<div
					class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-200 shadow-md ring-2 ring-transparent transition-all group-hover:ring-blue-400 dark:border-slate-600 dark:bg-slate-700"
				>
					<img
						src="https://ui-avatars.com/api/?name={encodeURIComponent(
							user?.name || 'User'
						)}&background=1A305E&color=D4AF37"
						alt="Admin"
						class="h-full w-full object-cover"
					/>
				</div>
				<div class="hidden text-left lg:block">
					<div class="flex items-center">
						<span
							class="text-sm font-bold text-slate-800 transition-colors group-hover:text-blue-600 dark:text-slate-200"
						>
							{user?.name || 'Guest User'}
						</span>
						<svg
							class="ml-1 h-4 w-4 text-slate-400 transition-transform duration-200 {openProfile
								? 'rotate-180'
								: ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					</div>
					<div class="text-[10px] font-medium text-slate-500 dark:text-slate-400">
						{user?.skpd?.nm_skpd || user?.email || 'Administrator'}
					</div>
				</div>
			</button>

			{#if openProfile}
				<div
					transition:scale={{ duration: 100, start: 0.95 }}
					class="absolute right-0 z-50 mt-3 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white py-2 shadow-xl dark:border-slate-700 dark:bg-slate-800"
				>
					<a
						href="/admin/profile"
						class="flex items-center px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
					>
						<svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							></path></svg
						>
						Profil
					</a>
					<a
						href="/settings"
						class="flex items-center px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
					>
						<svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							></path></svg
						>
						Pengaturan
					</a>
					<div class="my-1 border-t border-slate-100 dark:border-slate-700"></div>
					<form method="POST" action="/logout" use:enhance>
						<button
							type="submit"
							class="flex w-full items-center px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
						>
							<svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								><path
									d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
								></path></svg
							>
							Logout
						</button>
					</form>
				</div>
			{/if}
		</div>
	</div>
</header>
