<script lang="ts">
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { env } from '$env/dynamic/public';
	import { api } from '$lib/api';
	import Sosmed from './Sosmed.svelte';

	interface FooterData {
		footer_logo: string | null;
		footer_description: string;
		footer_address: string;
		footer_phone: string;
		footer_email: string;
		privacy_policy: string;
		terms_conditions: string;
		is_stats_visible: string;
	}

	const BACKEND_URL = env.PUBLIC_BACKEND_URL || 'http://localhost:8000';

	// State Management menggunakan Svelte 5 Runes
	let footerData = $state<FooterData | null>(null);
	let isLoading = $state(true);
	let stats = $state({
		visitors_total: 125430,
		visitors_today: 234,
		downloads_total: 8920
	});

	let showPrivacyModal = $state(false);
	let showTermsModal = $state(false);

	// Definisi navigasi sesuai dengan struktur Blade sebelumnya
	const navSections = [
		{
			title: 'header.profile',
			links: [
				{ label: 'footer.about_us', href: '/profil/ppid' },
				{ label: 'footer.vision_mission', href: '/profil/visi-misi' },
				{ label: 'footer.org_structure', href: '/profil/struktur-organisasi' },
				{ label: 'footer.tasks', href: '/profil/tupoksi' }
			]
		},
		{
			title: 'header.services',
			links: [
				{ label: 'footer.info_request', href: '/layanan/permohonan-informasi' },
				{ label: 'footer.objection', href: '/layanan/pengajuan-keberatan' },
				{ label: 'footer.check_status', href: '/layanan/cek-status' },
				{ label: 'footer.service_survey', href: '/layanan/isi-survey' }
			]
		},
		{
			title: 'header.public_info',
			links: [
				{ label: 'footer.latest_news', href: '/berita' },
				{ label: 'footer.public_info_list', href: '/daftar-informasi-publik' },
				{ label: 'footer.contact', href: '/layanan/kontak' }
			]
		}
	];

	onMount(async () => {
		try {
			const response = await api.get('/public/footer-setting');
			if (response && response.data) {
				footerData = response.data;
			}
		} catch (error) {
			console.error('Gagal mengambil data footer:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<footer class="relative overflow-hidden bg-ppid-primary font-['Plus_Jakarta_Sans'] text-white">
	<div class="pointer-events-none absolute inset-0">
		<img src="/images/kantor.jpeg" class="h-full w-full object-cover" alt="Sulsel Background" />
		<div
			class="absolute inset-0 bg-linear-to-t from-ppid-primary via-ppid-primary/95 to-ppid-primary/90"
		></div>
	</div>

	<div
		class="pointer-events-none absolute inset-0 opacity-10"
		style="background-image: radial-gradient(circle, rgba(212, 175, 55, 0.3) 1px, transparent 1px); background-size: 20px 20px;"
	></div>

	<div class="relative z-10 container mx-auto px-4 py-10 sm:px-6 sm:py-12 md:px-4 md:py-16">
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-5 lg:gap-12">
			<div class="text-center sm:col-span-2 sm:text-left">
				<div class="mb-6 flex flex-col items-center gap-4 sm:flex-row">
					<a href="/">
						<img
							src={footerData?.footer_logo
								? `${BACKEND_URL}/storage/${footerData.footer_logo}`
								: '/images/ppid-4.png'}
							class="h-16 w-auto md:h-20"
							alt="Logo PPID"
						/>
					</a>
					<div class="text-center sm:text-left">
						<h3
							class="text-xl leading-tight font-extrabold tracking-tight text-white uppercase md:text-lg"
						>
							{m['header.title_1']()}
						</h3>
						<p class="mt-1 text-sm font-bold tracking-widest text-ppid-accent md:text-base">
							{m['header.title_2']()}
						</p>
					</div>
				</div>

				<p class="mx-auto mb-6 max-w-md text-sm leading-relaxed text-gray-300 sm:mx-0 md:text-base">
					{footerData?.footer_description || m['footer.description']()}
				</p>

				<div class="mb-8 space-y-3 text-sm text-gray-300">
					<div class="flex items-start justify-center gap-3 sm:justify-start">
						<div class="mt-1 shrink-0 text-ppid-accent">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle
									cx="12"
									cy="10"
									r="3"
								/></svg
							>
						</div>
						<span>{footerData?.footer_address || m['footer.address_line']()}</span>
					</div>
					<div class="flex items-center justify-center gap-3 sm:justify-start">
						<div class="shrink-0 text-ppid-accent">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><path
									d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
								/></svg
							>
						</div>
						<span>{footerData?.footer_phone || '(0411) 453192'}</span>
					</div>
					<div class="flex items-center justify-center gap-3 sm:justify-start">
						<div class="shrink-0 text-ppid-accent">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><rect width="20" height="16" x="2" y="4" rx="2" /><path
									d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
								/></svg
							>
						</div>
						<span>{footerData?.footer_email || 'ppid@sulawesiprov.go.id'}</span>
					</div>
				</div>
			</div>

			{#each navSections as section}
				<div class="text-center sm:text-left">
					<h4
						class="relative mb-6 inline-block text-base font-bold text-white uppercase sm:block md:text-lg"
					>
						{m[section.title]()}
						<span
							class="absolute -bottom-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-ppid-accent sm:left-0 sm:translate-x-0"
						></span>
					</h4>
					<ul class="mt-4 space-y-3">
						{#each section.links as link}
							<li>
								<a
									href={link.href}
									class="group flex items-center justify-center gap-2 text-sm text-gray-400 transition-colors duration-300 hover:text-ppid-accent sm:justify-start md:text-base"
								>
									<span
										class="hidden h-1.5 w-1.5 rounded-full bg-ppid-accent opacity-0 transition-opacity group-hover:opacity-100 sm:block"
									></span>
									{m[link.label]()}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div
			class="mb-8 flex flex-col items-center gap-8 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between"
		>
			<Sosmed />

			{#if footerData?.is_stats_visible === '1'}
				<div class="flex flex-wrap items-center justify-center gap-2 lg:justify-end xl:gap-3">
					<div class="group flex items-center gap-2">
						<div
							class="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-ppid-accent shadow-sm transition-all duration-500 group-hover:bg-ppid-accent group-hover:text-ppid-primary xl:h-11 xl:w-11"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="transition-transform group-hover:scale-110"
								><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle
									cx="9"
									cy="7"
									r="4"
								/><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg
							>
						</div>
						<div class="flex flex-col justify-center">
							<span
								class="mb-0.5 text-[9px] leading-none font-medium tracking-wider text-gray-400 uppercase transition-colors group-hover:text-ppid-accent xl:text-[10px]"
								>Total</span
							>
							<span class="text-xs leading-none font-bold text-white xl:text-sm"
								>{stats.visitors_total.toLocaleString()}</span
							>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<div
			class="mt-4 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-4 text-center text-xs text-gray-500 sm:gap-6 md:flex-row md:text-left md:text-sm"
		>
			<p>{m['footer.rights']()}</p>
			<div class="flex gap-4 md:gap-6">
				<button
					onclick={() => (showPrivacyModal = true)}
					class="cursor-pointer transition-colors hover:text-ppid-accent"
					>{m['footer.privacy']()}</button
				>
				<button
					onclick={() => (showTermsModal = true)}
					class="cursor-pointer transition-colors hover:text-ppid-accent"
					>{m['footer.terms']()}</button
				>
			</div>
		</div>
	</div>

	{#if showPrivacyModal}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			onclick={() => (showPrivacyModal = false)}
		>
			<div
				class="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800"
				onclick={(e) => e.stopPropagation()}
			>
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-2xl font-bold text-ppid-primary dark:text-white">
						{m['footer.privacy']()}
					</h3>
					<button
						onclick={() => (showPrivacyModal = false)}
						class="text-gray-500 hover:text-ppid-primary"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
						>
					</button>
				</div>
				<div class="prose max-w-none text-ppid-text dark:text-gray-300">
					{@html footerData?.privacy_policy || '<p>Memuat kebijakan privasi...</p>'}
				</div>
			</div>
		</div>
	{/if}

	{#if showTermsModal}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			onclick={() => (showTermsModal = false)}
		>
			<div
				class="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800"
				onclick={(e) => e.stopPropagation()}
			>
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-2xl font-bold text-ppid-primary dark:text-white">
						{m['footer.terms']()}
					</h3>
					<button
						onclick={() => (showTermsModal = false)}
						class="text-gray-500 hover:text-ppid-primary"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
						>
					</button>
				</div>
				<div class="prose max-w-none text-ppid-text dark:text-gray-300">
					{@html footerData?.terms_conditions || '<p>Memuat syarat dan ketentuan...</p>'}
				</div>
			</div>
		</div>
	{/if}
</footer>
