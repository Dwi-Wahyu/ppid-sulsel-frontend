<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import SidebarLink from './SidebarLink.svelte';
	import SidebarDropdown from './SidebarDropdown.svelte';
	import SidebarDropdownLink from './SidebarDropdownLink.svelte';
	import { sidebar } from '$lib/state/sidebar.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { PUBLIC_API_URL } from '$env/static/public';

	let activeDropdown = $state<string | null>(null);

	function setActiveDropdown(label: string | null) {
		activeDropdown = label;
	}

	const menuGroups = [
		{
			title: 'Main Menu',
			items: [
				{
					type: 'link',
					href: '/admin/dashboard',
					label: 'Dashboard',
					icon: 'm4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
				},
				{
					type: 'dropdown',
					label: 'Profil',
					icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
					links: [
						{ href: '/admin/profil-ppid', label: 'Profil PPID' },
						{ href: '/admin/profil-pemprov', label: 'Profil Pemerintah Provinsi' },
						{ href: '/admin/sambutan', label: 'Sambutan' },
						{ href: '/admin/struktur-organisasi', label: 'Struktur Organisasi' },
						{ href: '/admin/visi-misi', label: 'Visi & Misi' },
						{ href: '/admin/maklumat', label: 'Maklumat Pelayanan' },
						{ href: '/admin/sosial-media', label: 'Sosial Media' }
					]
				},
				{
					type: 'dropdown',
					label: 'Konten',
					icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z M7 8h5 M7 12h10 M7 16h10',
					links: [
						{ href: '/admin/berita', label: 'Berita & Artikel' },
						{ href: '/admin/data-sop', label: 'SOP' },
						{
							href: '/admin/faq',
							label: 'FAQ'
						},
						{
							href: '/admin/slide-banner',
							label: 'Slide Banner'
						},
						{
							href: '/admin/footer-settings',
							label: 'Footer'
						}
					]
				}
			]
		},
		{
			title: 'Master Data',
			items: [
				{
					type: 'dropdown',
					label: 'Informasi Publik',
					icon: 'M12 21.5a9.5 9.5 0 1 0 0-19a9.5 9.5 0 0 0 0 19',
					links: [{ href: '/admin/pengadaan-barang-jasa', label: 'Pengadaan Barang & Jasa' }]
				},
				{
					type: 'dropdown',
					label: 'Layanan',
					icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z',
					links: [
						{ href: '/admin/permohonan-informasi', label: 'Permohonan Informasi' },
						{ href: '/admin/pengajuan-keberatan', label: 'Pengajuan Keberatan' }
					]
				}
			]
		},
		{
			title: 'Pengaturan',
			items: [
				{
					type: 'link',
					href: '/admin/skpd',
					label: 'User SKPD',
					icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
				},
				{
					type: 'link',
					href: '/admin/master-data',
					label: 'Pengaturan Umum',
					icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
				}
			]
		}
	];

	// Reactive state to hold the fetched links
	let dynamicMenuGroups = $state([...menuGroups]);

	onMount(async () => {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/public/informasi/kategori`);
			const result = await response.json();

			if (result) {
				const kategoriLinks = result.map((item: any) => ({
					// Pastikan href sama dengan slug karena /admin/dokumen-publik itu base link aslinya di beberapa tempat, 
					// tapi berdasarkan routing di /admin/dokumen-publik maka link yang benar sepertinya adalah /admin/informasi-publik/${item.slug}
					href: `/admin/informasi-publik/${item.slug}`, 
					label: item.name
				}));
				
				// Juga tambahkan Semua Dokumen Publik agar bisa kembali
				kategoriLinks.unshift({
					href: `/admin/dokumen-publik`,
					label: 'Semua Dokumen'
				});

				// Create a new array reference for Svelte 5 reactivity
				const newMenuGroups = [...dynamicMenuGroups];
				const manajemenGroupIndex = newMenuGroups.findIndex((g) => g.title === 'Master Data');
				
				if (manajemenGroupIndex !== -1) {
					const manajemenGroup = { ...newMenuGroups[manajemenGroupIndex] };
					const items = [...manajemenGroup.items];
					
					const infoPublikDropdownIndex = items.findIndex(
						(i) => i.type === 'dropdown' && i.label === 'Informasi Publik'
					);

					if (infoPublikDropdownIndex !== -1) {
						const infoPublikDropdown = { ...items[infoPublikDropdownIndex] };
						if (infoPublikDropdown.type === 'dropdown' && infoPublikDropdown.links) {
							// Merge static links with dynamic links
							infoPublikDropdown.links = [
								...infoPublikDropdown.links.filter(l => l.label === 'Pengadaan Barang & Jasa'), 
								...kategoriLinks
							];
							items[infoPublikDropdownIndex] = infoPublikDropdown;
						}
					}
					
					manajemenGroup.items = items;
					newMenuGroups[manajemenGroupIndex] = manajemenGroup;
				}
				
				dynamicMenuGroups = newMenuGroups;
			}
		} catch (error) {
			console.error('Gagal memuat kategori:', error);
		}
	});

	function isDropdownActive(links: {href: string, label: string}[] | undefined) {
		if (!links) return false;
		return links.some(link => page.url.pathname === link.href || page.url.pathname.startsWith(link.href + '/'));
	}
</script>

<Sidebar title="Admin Panel">
	{#each dynamicMenuGroups as group}
		{#if sidebar.isOpen}
			<div class="mt-4 mb-2 px-6 transition-all duration-300">
				<span class="text-[10px] font-bold tracking-[2px] text-slate-400 uppercase">
					{group.title}
				</span>
			</div>
		{/if}

		<ul>
			{#each group.items as item}
				{#if item.type === 'link'}
					<SidebarLink href={item.href as string} label={item.label}>
						{#snippet icon()}
							<svg class="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d={item.icon}
								/>
							</svg>
						{/snippet}
					</SidebarLink>
				{:else if item.type === 'dropdown'}
					<SidebarDropdown label={item.label} active={isDropdownActive(item.links)} {activeDropdown} {setActiveDropdown}>
						{#snippet icon()}
							<svg class="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d={item.icon}
								/>
							</svg>
						{/snippet}
						{#each item.links as subLink}
							<SidebarDropdownLink href={subLink.href} label={subLink.label} />
						{/each}
					</SidebarDropdown>
				{/if}
			{/each}
		</ul>
	{/each}
</Sidebar>
