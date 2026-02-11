<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fly, fade, slide } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, setLocale } from '$lib/paraglide/runtime.js';
	import { env } from '$env/dynamic/public';
	import SearchModal from './SearchModal.svelte';
	import Sosmed from './Sosmed.svelte';
	import { theme } from '$lib/state/theme.svelte';

	// State
	let mobileMenu = $state(false);
	let openProfil = $state(false);
	let openDaftar = $state(false);
	let openInformasi = $state(false);
	let openLayanan = $state(false);
	let openService = $state(false);
	let openLang = $state(false);
	let searchModalOpen = $state(false);
	let scrollY = $state(0);

	// Computed
	let currentLang = $derived(getLocale().toUpperCase());
	let isScrolled = $derived(scrollY > 100);

	function toggleDarkMode() {
		theme.toggle();
	}

	function clickOutside(node: HTMLElement, callback: () => void) {
		const handleClick = (event: MouseEvent) => {
			if (event.target instanceof Node && !node.contains(event.target)) {
				callback();
			}
		};
		document.addEventListener('click', handleClick, true);
		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}

	// Interfaces
	interface Kategori {
		nm_kat_info: string;
		slug: string;
	}

	interface TahunInfo {
		waktu: string;
	}

	const BACKEND_URL = env.PUBLIC_BACKEND_URL || 'http://localhost:8000';

	// Dynamic Data State
	let kategoriInformasi = $state<Kategori[]>([]);
	let listTahun = $state<TahunInfo[]>([]);
	let isLoading = $state(true);

	onMount(async () => {
		// Scroll tracking with inline handler
		window.addEventListener('scroll', () => {
			scrollY = window.scrollY;
		});

		// Fetch data
		try {
			const [resKategori, resTahun] = await Promise.all([
				fetch(`${BACKEND_URL}/api/public/informasi/kategori`),
				fetch(`${BACKEND_URL}/api/public/informasi/tahun`)
			]);

			const resultKat = await resKategori.json();
			const resultThn = await resTahun.json();

			if (resultKat.data) {
				kategoriInformasi = resultKat.data;
			}
			if (resultThn.data) {
				listTahun = resultThn.data;
			}
		} catch (error) {
			console.error('Gagal mengambil data header:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<header
	class="fixed top-0 left-0 z-50 w-full font-['Plus_Jakarta_Sans'] transition-all duration-300 {isScrolled
		? ''
		: 'bg-white shadow-md dark:bg-slate-900'}"
>
	<div
		class="container mx-auto flex items-center justify-between px-4 transition-all duration-300 {isScrolled
			? 'h-0 overflow-hidden py-0 opacity-0'
			: 'py-4 opacity-100 md:py-6'}"
	>
		<a href="/" class="group flex items-center gap-3">
			{#if theme.darkMode}
				<img src="/images/ppid-4.png" alt="Logo" class=" h-10 w-auto md:h-14" />
			{:else}
				<img src="/images/ppid-3.png" alt="Logo" class=" h-10 w-auto md:h-14" />
			{/if}

			<div class="flex flex-col justify-center">
				<span
					class="font-['Plus_Jakarta_Sans'] text-xs font-extrabold text-gray-700 md:text-base dark:text-white"
				>
					{m['header.title_1']()}
				</span>
				<span
					class="mt-0.5 text-[10px] font-bold tracking-[0.15em] text-[#D4AF37] uppercase md:text-xs"
				>
					{m['header.title_2']()}
				</span>
			</div>
		</a>

		<div class="flex items-center gap-3 md:gap-4">
			<!-- Search Trigger Button -->
			<a href="/login" class="text-sm font-medium text-gray-700 dark:text-white"> Login </a>

			<button
				onclick={() => (searchModalOpen = true)}
				class="rounded-full p-2 text-gray-700 transition-all hover:bg-white/10 hover:text-[#D4AF37] dark:text-white"
				aria-label="Search"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</button>

			<button
				onclick={toggleDarkMode}
				class="rounded-full p-2 text-gray-700 hover:bg-white/10 dark:text-white"
				aria-label="Toggle dark mode"
			>
				{#if !theme.darkMode}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						in:fade
						><path
							d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
						/></svg
					>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						in:fade
						><path
							d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
						/></svg
					>
				{/if}
			</button>

			<div class="relative" use:clickOutside={() => (openLang = false)}>
				<button
					onclick={() => (openLang = !openLang)}
					class="flex items-center px-3 py-2 text-sm font-bold text-gray-700 hover:text-ppid-accent dark:text-white"
				>
					<span>{currentLang}</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 transition-transform {openLang ? 'rotate-180' : ''}"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"><path d="m6 9 6 6 6-6" /></svg
					>
				</button>
				{#if openLang}
					<div
						transition:fly={{ y: -10, duration: 200 }}
						class="absolute right-0 z-60 mt-2 w-24 rounded-xl bg-white py-1 shadow-xl dark:bg-slate-800"
					>
						<button
							onclick={() => setLocale('id')}
							class="block px-4 py-2 text-sm hover:bg-[#D4AF37]/10 dark:text-gray-200">🇮🇩 ID</button
						>
						<button
							onclick={() => setLocale('en')}
							class="block px-4 py-2 text-sm hover:bg-[#D4AF37]/10 dark:text-gray-200">🇺🇸 EN</button
						>
					</div>
				{/if}
			</div>

			<div class="hidden lg:block">
				<Sosmed />
			</div>

			<button
				onclick={() => (mobileMenu = !mobileMenu)}
				class="rounded-lg bg-white/10 p-2 text-white lg:hidden"
				aria-label="Toggle mobile menu"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d={mobileMenu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
					/>
				</svg>
			</button>
		</div>
	</div>

	<nav
		class="relative bg-ppid-primary transition-all duration-300 {mobileMenu
			? 'block'
			: 'hidden lg:block'} {isScrolled ? 'shadow-xl' : 'shadow-md'}"
	>
		<div class="absolute top-0 left-0 h-px w-full bg-white/20"></div>
		<div class="container mx-auto py-4">
			<ul
				class="flex flex-col items-stretch justify-center text-xs font-medium text-white/90 lg:flex-row lg:items-center lg:text-sm"
			>
				<li class="border-b border-white/10 lg:border-none">
					<a href="/" class="group relative block px-6 py-4 hover:text-[#D4AF37] lg:px-4">
						{m['header.home']()}
						<span
							class="absolute bottom-0 left-0 hidden h-0.75 w-full scale-x-0 bg-ppid-accent transition-transform group-hover:scale-x-100 lg:block"
						></span>
					</a>
				</li>

				<li
					class="group relative border-b border-white/10 lg:border-none"
					onmouseenter={() => (window.innerWidth >= 1024 ? (openProfil = true) : null)}
					onmouseleave={() => (window.innerWidth >= 1024 ? (openProfil = false) : null)}
				>
					<button
						onclick={() => (window.innerWidth < 1024 ? (openProfil = !openProfil) : null)}
						class="flex w-full items-center justify-between px-6 py-4 hover:text-ppid-accent lg:px-4"
					>
						<span>{m['header.profile']()}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 transition-transform {openProfil ? 'rotate-180' : ''}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"><path d="m6 9 6 6 6-6" /></svg
						>
					</button>
					{#if openProfil}
						<ul
							transition:slide
							class="z-50 w-full bg-white py-2 text-[#1A305E] lg:absolute lg:w-64 lg:rounded-b-lg lg:border-t-4 lg:border-[#D4AF37] dark:bg-slate-800 dark:text-gray-200"
						>
							{#each ['ppid', 'sambutan', 'struktur-organisasi', 'visi-misi', 'tupoksi', 'maklumat', 'pemerintah-sulsel'] as path}
								<li>
									<a
										href="/profil/{path}"
										class="block border-l-4 border-transparent px-10 py-3 hover:border-[#D4AF37] hover:bg-[#1A305E]/5 lg:px-6"
										>{path.replace(/-/g, ' ').toUpperCase()}</a
									>
								</li>
							{/each}
						</ul>
					{/if}
				</li>

				<li class="border-b border-white/10 lg:border-none">
					<a href="/berita" class="block px-6 py-4 hover:text-[#D4AF37] lg:px-4"
						>{m['header.news']()}</a
					>
				</li>

				<li
					class="group relative border-b border-white/10 lg:border-none"
					onmouseenter={() => (window.innerWidth >= 1024 ? (openDaftar = true) : null)}
					onmouseleave={() => (window.innerWidth >= 1024 ? (openDaftar = false) : null)}
				>
					<button
						onclick={() => (window.innerWidth < 1024 ? (openDaftar = !openDaftar) : null)}
						class="flex w-full items-center justify-between px-6 py-4 hover:text-ppid-accent lg:px-4"
					>
						<span>{m['header.data_info']()}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 transition-transform {openDaftar ? 'rotate-180' : ''}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"><path d="m6 9 6 6 6-6" /></svg
						>
					</button>
					{#if openDaftar}
						<ul
							transition:slide
							class="z-50 w-full bg-white py-2 text-[#1A305E] lg:absolute lg:w-64 lg:rounded-b-lg lg:border-t-4 lg:border-[#D4AF37] dark:bg-slate-800 dark:text-gray-200"
						>
							{#each listTahun as item}
								<li>
									<a
										href="/informasi-publik/tahun/{item.waktu}"
										class="block border-l-4 border-transparent px-10 py-3 hover:border-[#D4AF37] hover:bg-[#1A305E]/5 lg:px-6"
									>
										Informasi Publik Tahun {item.waktu}
									</a>
								</li>
							{/each}
							<li>
								<a
									href="/informasi-publik"
									class="block border-l-4 border-transparent px-10 py-3 hover:border-[#D4AF37] hover:bg-[#1A305E]/5 lg:px-6"
									>Daftar Informasi Publik</a
								>
							</li>
						</ul>
					{/if}
				</li>

				<li
					class="group relative border-b border-white/10 lg:border-none"
					onmouseenter={() => (window.innerWidth >= 1024 ? (openInformasi = true) : null)}
					onmouseleave={() => (window.innerWidth >= 1024 ? (openInformasi = false) : null)}
				>
					<button
						onclick={() => (window.innerWidth < 1024 ? (openInformasi = !openInformasi) : null)}
						class="flex w-full items-center justify-between px-6 py-4 hover:text-ppid-accent lg:px-4"
					>
						<span>{m['header.public_info']()}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 transition-transform {openInformasi ? 'rotate-180' : ''}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"><path d="m6 9 6 6 6-6" /></svg
						>
					</button>
					{#if openInformasi}
						<ul
							transition:slide
							class="z-50 w-full bg-white py-2 text-[#1A305E] lg:absolute lg:w-72 lg:rounded-b-lg lg:border-t-4 lg:border-[#D4AF37] dark:bg-slate-800 dark:text-gray-200"
						>
							{#each kategoriInformasi as kat}
								<li>
									<a
										href="/informasi-publik/kategori/{kat.slug}"
										class="block border-l-4 border-transparent px-10 py-3 hover:border-[#D4AF37] hover:bg-[#1A305E]/5 lg:px-6"
									>
										{kat.nm_kat_info}
									</a>
								</li>
							{/each}
							<li>
								<a
									href="/informasi-publik/pengadaan-barang-jasa"
									class="block border-l-4 border-transparent px-10 py-3 hover:border-[#D4AF37] hover:bg-[#1A305E]/5 lg:px-6"
								>
									Pengadaan Barang & Jasa
								</a>
							</li>
						</ul>
					{/if}
				</li>

				<li class="border-b border-white/10 lg:border-none">
					<a href="/ppid-pelaksana" class="block px-6 py-4 hover:text-[#D4AF37] lg:px-4"
						>{m['header.ppid_implementing']()}</a
					>
				</li>

				<li
					class="group relative border-b border-white/10 lg:border-none"
					onmouseenter={() => (window.innerWidth >= 1024 ? (openLayanan = true) : null)}
					onmouseleave={() => (window.innerWidth >= 1024 ? (openLayanan = false) : null)}
				>
					<button
						onclick={() => (window.innerWidth < 1024 ? (openLayanan = !openLayanan) : null)}
						class="flex w-full items-center justify-between px-6 py-4 hover:text-ppid-accent lg:px-4"
					>
						<span>{m['header.services']()}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 transition-transform {openLayanan ? 'rotate-180' : ''}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"><path d="m6 9 6 6 6-6" /></svg
						>
					</button>
					{#if openLayanan}
						<ul
							transition:slide
							class="z-50 w-full bg-white py-2 text-[#1A305E] lg:absolute lg:w-64 lg:rounded-b-lg lg:border-t-4 lg:border-[#D4AF37] dark:bg-slate-800 dark:text-gray-200"
						>
							{#each ['permohonan-informasi', 'pengajuan-keberatan', 'sop', 'cek-status', 'kontak'] as s}
								<li>
									<a
										href="/layanan/{s}"
										class="block border-l-4 border-transparent px-10 py-3 hover:border-[#D4AF37] hover:bg-[#1A305E]/5 lg:px-6"
										>{s.replace(/-/g, ' ').toUpperCase()}</a
									>
								</li>
							{/each}
						</ul>
					{/if}
				</li>

				<li
					class="group relative border-b border-white/10 lg:border-none"
					onmouseenter={() => (window.innerWidth >= 1024 ? (openService = true) : null)}
					onmouseleave={() => (window.innerWidth >= 1024 ? (openService = false) : null)}
				>
					<button
						onclick={() => (window.innerWidth < 1024 ? (openService = !openService) : null)}
						class="flex w-full items-center justify-between px-6 py-4 hover:text-ppid-accent lg:px-4"
					>
						<span>{m['header.survey']()}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 transition-transform {openService ? 'rotate-180' : ''}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"><path d="m6 9 6 6 6-6" /></svg
						>
					</button>
					{#if openService}
						<ul
							transition:slide
							class="z-50 w-full bg-white py-2 text-[#1A305E] lg:absolute lg:w-56 lg:rounded-b-lg lg:border-t-4 lg:border-[#D4AF37] dark:bg-slate-800 dark:text-gray-200"
						>
							<li>
								<a
									href="/survey/isi-survey"
									class="block border-l-4 border-transparent px-10 py-3 hover:border-[#D4AF37] hover:bg-[#1A305E]/5 lg:px-6"
									>Isi Survey</a
								>
							</li>
							<li>
								<a
									href="/survey/hasil-survey"
									class="block border-l-4 border-transparent px-10 py-3 hover:border-[#D4AF37] hover:bg-[#1A305E]/5 lg:px-6"
									>Hasil Survey</a
								>
							</li>
						</ul>
					{/if}
				</li>
			</ul>

			<!-- Mobile Social Media -->
			<div class="mt-6 flex justify-center border-t border-white/10 pt-6 lg:hidden">
				<Sosmed />
			</div>
		</div>
	</nav>

	<!-- Search Modal Component -->
	<SearchModal bind:isOpen={searchModalOpen} />
</header>
