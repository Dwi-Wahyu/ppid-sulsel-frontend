<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { fly, fade, slide } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime.js';

	// State
	let mobileMenu = $state(false);
	let openProfil = $state(false);
	let openDaftar = $state(false);
	let openInformasi = $state(false);
	let openLayanan = $state(false);
	let openService = $state(false);
	let openLang = $state(false);
	let darkMode = $state(false);

	// Computed
	let currentLang = $derived(getLocale().toUpperCase());

	// Effects & Lifecycle
	onMount(() => {
		// Initialize dark mode from localStorage or system preference
		const theme = localStorage.getItem('theme');
		darkMode =
			theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
		updateTheme(darkMode);
	});

	function toggleDarkMode() {
		darkMode = !darkMode;
		updateTheme(darkMode);
	}

	/** @param {boolean} isDark */
	function updateTheme(isDark) {
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}

	/**
	 * @param {HTMLElement} node
	 * @param {() => void} callback
	 */
	function clickOutside(node, callback) {
		const handleClick = (/** @type {MouseEvent} */ event) => {
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
</script>

<header
	class="absolute top-0 left-0 z-50 w-full bg-white font-['Plus_Jakarta_Sans'] shadow-sm transition-colors duration-300 dark:bg-slate-900"
>
	<!-- 1. TOP BAR: LOGO & BAHASA -->
	<div class="container mx-auto flex items-center justify-between px-4 py-4 md:py-6">
		<a href="/" class="group flex items-center gap-3">
			<!-- Logo Image -->
			<img
				src="/logo/ppid-light.png"
				alt="Logo PPID Sulawesi Selatan"
				class="block h-10 w-auto transition-transform group-hover:scale-105 md:h-14 dark:hidden"
			/>
			<img
				src="/logo/ppid-dark.png"
				alt="Logo PPID Sulawesi Selatan"
				class="hidden h-10 w-auto transition-transform group-hover:scale-105 md:h-14 dark:block"
			/>

			<!-- TEKS SAMPING LOGO -->
			<div class="flex flex-col justify-center">
				<span
					class="font-['Plus_Jakarta_Sans'] text-xs leading-tight font-extrabold text-[#1A305E] transition-colors group-hover:text-[#D4AF37] md:text-base dark:text-white"
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
			<!-- Contact Desktop -->
			<a
				href="/contact"
				class="hidden text-sm font-medium text-[#4A5568] transition-colors hover:text-[#D4AF37] lg:block dark:text-gray-300"
				>{m['header.contact']()}</a
			>

			<!-- Dark Mode Toggle -->
			<button
				onclick={toggleDarkMode}
				class="rounded-full p-2 text-[#4A5568] transition-all hover:bg-[#1A305E]/5 hover:text-[#D4AF37] dark:text-gray-300 dark:hover:bg-white/10"
				aria-label="Toggle Dark Mode"
			>
				{#if !darkMode}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						in:fade={{ duration: 200 }}
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						in:fade={{ duration: 200 }}
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
						/>
					</svg>
				{/if}
			</button>

			<!-- Dropdown Bahasa -->
			<div class="relative" use:clickOutside={() => (openLang = false)}>
				<button
					onclick={() => (openLang = !openLang)}
					class="flex items-center gap-1 text-sm font-bold text-[#4A5568] uppercase transition-colors hover:text-[#D4AF37] focus:outline-none dark:text-gray-300"
				>
					<span>{currentLang}</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 transition-transform {openLang ? 'rotate-180' : ''}"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path d="m6 9 6 6 6-6" />
					</svg>
				</button>

				{#if openLang}
					<div
						transition:fly={{ y: -10, duration: 200 }}
						class="absolute right-0 z-[60] mt-2 w-24 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-800"
					>
						<a
							href={localizeHref(page.url.pathname, { locale: 'id' })}
							class="block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] dark:text-gray-200"
							>🇮🇩 ID</a
						>
						<a
							href={localizeHref(page.url.pathname, { locale: 'en' })}
							class="block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] dark:text-gray-200"
							>🇺🇸 EN</a
						>
					</div>
				{/if}
			</div>

			<!-- TOMBOL HAMBURGER: Hanya muncul di Mobile -->
			<button
				onclick={() => (mobileMenu = !mobileMenu)}
				class="rounded-lg bg-[#1A305E]/5 p-2 text-[#1A305E] lg:hidden dark:bg-white/10 dark:text-white"
			>
				{#if !mobileMenu}
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
							d="M4 6h16M4 12h16m-7 6h7"
						/>
					</svg>
				{:else}
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
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				{/if}
			</button>
		</div>
	</div>

	<!-- 2. NAVIGATION BAR -->
	<nav
		class="relative bg-[#1A305E] shadow-md transition-all duration-300 {mobileMenu
			? 'block'
			: 'hidden lg:block'}"
	>
		<!-- Gold Line Accent -->
		<div class="absolute top-0 left-0 h-[2px] w-full bg-[#D4AF37]"></div>

		<div class="container mx-auto px-0 py-4 lg:px-4">
			<ul
				class="flex flex-col items-stretch justify-center text-xs font-medium text-white/90 lg:flex-row lg:items-center lg:text-sm"
			>
				<!-- BERANDA -->
				<li class="border-b border-white/10 lg:border-none">
					<a
						href="/"
						class="group relative block px-6 py-4 transition-all hover:text-[#D4AF37] lg:px-4"
					>
						{m['header.home']()}
						<span
							class="absolute bottom-0 left-0 hidden h-[3px] w-full origin-left scale-x-0 bg-[#D4AF37] transition-transform group-hover:scale-x-100 lg:block"
						></span>
					</a>
				</li>

				<!-- Dropdown Profil -->
				<li
					class="group relative border-b border-white/10 lg:border-none"
					onmouseenter={() => (window.innerWidth >= 1024 ? (openProfil = true) : null)}
					onmouseleave={() => (window.innerWidth >= 1024 ? (openProfil = false) : null)}
				>
					<button
						onclick={() => (window.innerWidth < 1024 ? (openProfil = !openProfil) : null)}
						class="flex w-full cursor-pointer items-center justify-between px-6 py-4 transition-all hover:text-[#D4AF37] lg:w-auto lg:px-4"
					>
						<span>{m['header.profile']()}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 text-[#D4AF37] transition-transform {openProfil ? 'rotate-180' : ''}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"><path d="m6 9 6 6 6-6" /></svg
						>
						<span
							class="absolute bottom-0 left-0 hidden h-[3px] w-full origin-left scale-x-0 bg-[#D4AF37] transition-transform group-hover:scale-x-100 lg:block"
						></span>
					</button>

					{#if openProfil}
						<ul
							transition:slide={{ duration: 300, axis: 'y' }}
							class="z-50 w-full bg-white py-2 text-[#1A305E] lg:absolute lg:top-full lg:left-0 lg:w-64 lg:rounded-b-lg lg:border-t-4 lg:border-[#D4AF37] lg:shadow-xl dark:bg-slate-800 dark:text-gray-200"
						>
							<li>
								<a
									href="/profil-ppid"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Profil PPID</a
								>
							</li>
							<li>
								<a
									href="/sambutan"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Sambutan</a
								>
							</li>
							<li>
								<a
									href="/struktur-organisasi"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Struktur Organisasi</a
								>
							</li>
							<li>
								<a
									href="/visi-misi"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Visi Misi</a
								>
							</li>
							<li>
								<a
									href="/tupoksi"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Tupoksi</a
								>
							</li>
							<li>
								<a
									href="/maklumat-pelayanan"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Maklumat</a
								>
							</li>
							<li>
								<a
									href="/profil-pemprov"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Profil Pemerintah Sulsel</a
								>
							</li>
						</ul>
					{/if}
				</li>

				<!-- BERITA -->
				<li class="border-b border-white/10 lg:border-none">
					<a
						href="/berita"
						class="group relative block px-6 py-4 transition-all hover:text-[#D4AF37] lg:px-4"
					>
						{m['header.news']()}
						<span
							class="absolute bottom-0 left-0 hidden h-[3px] w-full origin-left scale-x-0 bg-[#D4AF37] transition-transform group-hover:scale-x-100 lg:block"
						></span>
					</a>
				</li>

				<!-- Dropdown Data Informasi Publik (Formerly Daftar) -->
				<li
					class="group relative border-b border-white/10 lg:border-none"
					onmouseenter={() => (window.innerWidth >= 1024 ? (openDaftar = true) : null)}
					onmouseleave={() => (window.innerWidth >= 1024 ? (openDaftar = false) : null)}
				>
					<button
						onclick={() => (window.innerWidth < 1024 ? (openDaftar = !openDaftar) : null)}
						class="flex w-full cursor-pointer items-center justify-between px-6 py-4 transition-all hover:text-[#D4AF37] lg:w-auto lg:px-4"
					>
						<span>{m['header.data_info']()}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 text-[#D4AF37] transition-transform {openDaftar ? 'rotate-180' : ''}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"><path d="m6 9 6 6 6-6" /></svg
						>
						<span
							class="absolute bottom-0 left-0 hidden h-[3px] w-full origin-left scale-x-0 bg-[#D4AF37] transition-transform group-hover:scale-x-100 lg:block"
						></span>
					</button>

					{#if openDaftar}
						<ul
							transition:slide={{ duration: 300, axis: 'y' }}
							class="z-50 w-full bg-white py-2 text-[#1A305E] lg:absolute lg:top-full lg:left-0 lg:w-64 lg:rounded-b-lg lg:border-t-4 lg:border-[#D4AF37] lg:shadow-xl dark:bg-slate-800 dark:text-gray-200"
						>
							<li>
								<a
									href="/informasi-publik/2023"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Informasi Publik Tahun 2023</a
								>
							</li>
							<li>
								<a
									href="/informasi-publik/2024"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Informasi Publik Tahun 2024</a
								>
							</li>
							<li>
								<a
									href="/informasi-publik/2025"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Informasi Publik Tahun 2025</a
								>
							</li>
							<li>
								<a
									href="/informasi-publik/pengadaan"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Informasi Pengadaan Barang Dan Jasa</a
								>
							</li>
						</ul>
					{/if}
				</li>

				<!-- Dropdown Informasi Publik -->
				<li
					class="group relative border-b border-white/10 lg:border-none"
					onmouseenter={() => (window.innerWidth >= 1024 ? (openInformasi = true) : null)}
					onmouseleave={() => (window.innerWidth >= 1024 ? (openInformasi = false) : null)}
				>
					<button
						onclick={() => (window.innerWidth < 1024 ? (openInformasi = !openInformasi) : null)}
						class="flex w-full cursor-pointer items-center justify-between px-6 py-4 transition-all hover:text-[#D4AF37] lg:w-auto lg:px-4"
					>
						<span>{m['header.public_info']()}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 text-[#D4AF37] transition-transform {openInformasi
								? 'rotate-180'
								: ''}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"><path d="m6 9 6 6 6-6" /></svg
						>
						<span
							class="absolute bottom-0 left-0 hidden h-[3px] w-full origin-left scale-x-0 bg-[#D4AF37] transition-transform group-hover:scale-x-100 lg:block"
						></span>
					</button>

					{#if openInformasi}
						<ul
							transition:slide={{ duration: 300, axis: 'y' }}
							class="z-50 w-full bg-white py-2 text-[#1A305E] lg:absolute lg:top-full lg:left-0 lg:w-72 lg:rounded-b-lg lg:border-t-4 lg:border-[#D4AF37] lg:shadow-xl dark:bg-slate-800 dark:text-gray-200"
						>
							<li>
								<a
									href="/informasi-publik/serta-merta"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Informasi Serta Merta</a
								>
							</li>
							<li>
								<a
									href="/informasi-publik/setiap-saat"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Informasi Setiap Saat</a
								>
							</li>
							<li>
								<a
									href="/informasi-publik/dikecualikan"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Daftar Informasi Dikecualikan</a
								>
							</li>
							<li>
								<a
									href="/informasi-publik"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Daftar Informasi Publik</a
								>
							</li>
							<li>
								<a
									href="/informasi-publik/berkala"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Informasi Berkala</a
								>
							</li>
						</ul>
					{/if}
				</li>

				<li class="border-b border-white/10 lg:border-none">
					<a
						href="/ppid-pelaksana"
						class="group relative block px-6 py-4 transition-all hover:text-[#D4AF37] lg:px-4"
					>
						{m['header.ppid_implementing']()}
						<span
							class="absolute bottom-0 left-0 hidden h-[3px] w-full origin-left scale-x-0 bg-[#D4AF37] transition-transform group-hover:scale-x-100 lg:block"
						></span>
					</a>
				</li>

				<!-- Dropdown Layanan -->
				<li
					class="group relative border-b border-white/10 lg:border-none"
					onmouseenter={() => (window.innerWidth >= 1024 ? (openLayanan = true) : null)}
					onmouseleave={() => (window.innerWidth >= 1024 ? (openLayanan = false) : null)}
				>
					<button
						onclick={() => (window.innerWidth < 1024 ? (openLayanan = !openLayanan) : null)}
						class="flex w-full cursor-pointer items-center justify-between px-6 py-4 transition-all hover:text-[#D4AF37] lg:w-auto lg:px-4"
					>
						<span>{m['header.services']()}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 text-[#D4AF37] transition-transform {openLayanan ? 'rotate-180' : ''}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"><path d="m6 9 6 6 6-6" /></svg
						>
						<span
							class="absolute bottom-0 left-0 hidden h-[3px] w-full origin-left scale-x-0 bg-[#D4AF37] transition-transform group-hover:scale-x-100 lg:block"
						></span>
					</button>

					{#if openLayanan}
						<ul
							transition:slide={{ duration: 300, axis: 'y' }}
							class="z-50 w-full bg-white py-2 text-[#1A305E] lg:absolute lg:top-full lg:left-0 lg:w-64 lg:rounded-b-lg lg:border-t-4 lg:border-[#D4AF37] lg:shadow-xl dark:bg-slate-800 dark:text-gray-200"
						>
							<li>
								<a
									href="/layanan/permohonan-informasi"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
								>
									Permohonan Informasi
								</a>
							</li>
							<li>
								<a
									href="/layanan/pengajuan-keberatan"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
								>
									Pengajuan Keberatan
								</a>
							</li>
							<li>
								<a
									href="/layanan/sop"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
								>
									SOP
								</a>
							</li>
						</ul>
					{/if}
				</li>

				<!-- Dropdown Survey -->
				<li
					class="group relative border-b border-white/10 lg:border-none"
					onmouseenter={() => (window.innerWidth >= 1024 ? (openService = true) : null)}
					onmouseleave={() => (window.innerWidth >= 1024 ? (openService = false) : null)}
				>
					<button
						onclick={() => (window.innerWidth < 1024 ? (openService = !openService) : null)}
						class="flex w-full cursor-pointer items-center justify-between px-6 py-4 transition-all hover:text-[#D4AF37] lg:w-auto lg:px-4"
					>
						<span>{m['header.survey']()}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 text-[#D4AF37] transition-transform {openService ? 'rotate-180' : ''}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"><path d="m6 9 6 6 6-6" /></svg
						>
						<span
							class="absolute bottom-0 left-0 hidden h-[3px] w-full origin-left scale-x-0 bg-[#D4AF37] transition-transform group-hover:scale-x-100 lg:block"
						></span>
					</button>

					{#if openService}
						<ul
							transition:slide={{ duration: 300, axis: 'y' }}
							class="z-50 w-full bg-white py-2 text-[#1A305E] lg:absolute lg:top-full lg:left-0 lg:w-56 lg:rounded-b-lg lg:border-t-4 lg:border-[#D4AF37] lg:shadow-xl dark:bg-slate-800 dark:text-gray-200"
						>
							<li>
								<a
									href="/survey/isi-survey"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Isi Survey</a
								>
							</li>
							<li>
								<a
									href="/survey/hasil-survey"
									class="block border-l-4 border-transparent px-10 py-3 transition-colors hover:border-[#D4AF37] hover:bg-[#1A305E]/5 hover:text-[#D4AF37] lg:px-6"
									>Hasil Survey</a
								>
							</li>
						</ul>
					{/if}
				</li>

				<!-- Contact Mobile Only -->
				<li class="border-b border-white/10 lg:hidden">
					<a
						href="/contact"
						class="block px-6 py-4 transition-all hover:bg-white/10 hover:text-white"
						>{m['header.contact']()}</a
					>
				</li>
			</ul>
		</div>
	</nav>
</header>
