<script lang="ts">
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { sidebar } from '$lib/state/sidebar.svelte';
	import { theme } from '$lib/state/theme.svelte';
	import { api } from '$lib/api';

	// --- Types ---
	interface Notification {
		id_notification: string;
		title: string;
		message: string;
		read_at: string | null;
		created_at: string;
	}

	interface ApiResponse<T> {
		success: boolean;
		message: string;
		data: {
			data: T[];
			total: number;
		};
	}

	// --- State (Svelte 5 Runes) ---
	let openNotif = $state(false);
	let openProfile = $state(false);
	let notifications = $state<Notification[]>([]);
	let unreadCount = $state(0);

	// --- Derived State ---
	const user = $derived($page.data.user);

	// --- Logic ---
	async function fetchNotifications() {
		try {
			// Menggunakan api.ts yang secara otomatis menangani proxy dan JSON parsing
			const result = (await api.get('/admin/notifications')) as ApiResponse<Notification>;

			if (result.success) {
				// Ambil 5 terbaru untuk preview dropdown
				notifications = result.data.data.slice(0, 5);
				unreadCount = notifications.filter((n) => !n.read_at).length;
			}
		} catch (error) {
			console.error('Gagal mengambil notifikasi:', error);
		}
	}

	function closeMenus() {
		openNotif = false;
		openProfile = false;
	}

	onMount(() => {
		fetchNotifications();
		// Polling setiap 2 menit
		const interval = setInterval(fetchNotifications, 120000);
		return () => clearInterval(interval);
	});
</script>

<header
	class="sticky top-0 z-40 flex h-16 w-full items-center border-b border-slate-200 bg-white/80 px-4 py-5 backdrop-blur-md md:px-6 dark:border-slate-800 dark:bg-slate-900/80"
>
	<button
		onclick={() => sidebar.toggle()}
		class="mr-4 rounded-lg p-2 text-slate-600 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
		aria-label="Buka Sidebar"
	>
		<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 12h16m-7 6h7"
			/>
		</svg>
	</button>

	<div class="hidden items-center gap-2 md:flex">
		{#if theme.darkMode}
			<img src="/images/ppid-4.png" alt="PPID Sulawesi Selatan" class="w-20" />
		{:else}
			<img src="/images/ppid-3.png" alt="PPID Sulawesi Selatan" class="w-20" />
		{/if}
	</div>

	<div class="ml-auto flex items-center gap-2 md:gap-4">
		<button
			onclick={() => theme.toggle()}
			class="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
			aria-label={theme.darkMode ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'}
		>
			{#if theme.darkMode}
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728L5.121 5.121M19 12a7 7 0 11-14 0 7 7 0 0114 0z"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			{:else}
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			{/if}
		</button>

		<div class="relative">
			<button
				onclick={() => {
					openNotif = !openNotif;
					openProfile = false;
				}}
				class="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
				aria-label="Lihat Notifikasi"
				aria-expanded={openNotif}
				aria-haspopup="true"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
					/>
				</svg>
				{#if unreadCount > 0}
					<span
						class="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900"
					>
						{unreadCount}
					</span>
				{/if}
			</button>

			{#if openNotif}
				<div
					transition:fly={{ y: 10, duration: 200 }}
					class="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
					role="menu"
				>
					<div
						class="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-700"
					>
						<h3 class="font-bold text-slate-800 dark:text-white">Notifikasi</h3>
						<a
							href="/admin/notifications"
							onclick={closeMenus}
							class="text-xs font-semibold text-blue-600 hover:underline">Lihat Semua</a
						>
					</div>
					<div class="max-h-96 overflow-y-auto">
						{#each notifications as notif (notif.id_notification)}
							<a
								href="/admin/notifications"
								onclick={closeMenus}
								class="block border-b border-slate-50 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700"
								role="menuitem"
							>
								<p class="text-sm font-bold text-slate-800 dark:text-slate-100">{notif.title}</p>
								<p class="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
									{notif.message}
								</p>
								<span class="mt-2 block text-[10px] text-slate-400"
									>{new Date(notif.created_at).toLocaleDateString('id-ID')}</span
								>
							</a>
						{:else}
							<div class="p-8 text-center text-sm text-slate-400">Tidak ada notifikasi baru</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<div class="relative">
			<button
				onclick={() => {
					openProfile = !openProfile;
					openNotif = false;
				}}
				class="flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
				aria-label="Menu Pengguna"
				aria-expanded={openProfile}
				aria-haspopup="true"
			>
				<div
					class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-blue-600 font-bold text-white"
				>
					{user?.name?.charAt(0).toUpperCase() || 'A'}
				</div>
				<div class="hidden text-start md:block">
					<div class="text-sm font-semibold text-slate-700 dark:text-slate-200">
						{user?.name || 'Admin'}
					</div>
					<div class="text-xs text-slate-500 dark:text-slate-400">
						{user?.email || 'admin@sulselprov.go.id'}
					</div>
				</div>
			</button>

			{#if openProfile}
				<div
					transition:fly={{ y: 10, duration: 200 }}
					class="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
					role="menu"
				>
					<div class="border-b border-slate-100 p-4 dark:border-slate-700">
						<p class="text-xs text-slate-400">Masuk sebagai</p>
						<p class="truncate text-sm font-bold text-slate-800 dark:text-white">
							{user?.email || 'admin@sulselprov.go.id'}
						</p>
					</div>
					<div class="p-2">
						<a
							href="/admin/profile"
							onclick={closeMenus}
							class="flex items-center rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
							role="menuitem"
						>
							<svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									stroke-width="2"
								/>
							</svg>
							Profil Saya
						</a>
						<a
							href="/admin/settings"
							onclick={closeMenus}
							class="flex items-center rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
							role="menuitem"
						>
							<svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
									stroke-width="2"
								/>
								<circle cx="12" cy="12" r="3" stroke-width="2" />
							</svg>
							Pengaturan
						</a>
						<div class="my-1 border-t border-slate-100 dark:border-slate-700"></div>
						<form action="/logout" method="POST">
							<button
								type="submit"
								class="flex w-full items-center rounded-lg px-3 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
								role="menuitem"
							>
								<svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								Keluar
							</button>
						</form>
					</div>
				</div>
			{/if}
		</div>
	</div>
</header>

{#if openNotif || openProfile}
	<button
		onclick={closeMenus}
		class="fixed inset-0 z-30 cursor-default bg-transparent"
		aria-hidden="true"
		tabindex="-1"
	></button>
{/if}
