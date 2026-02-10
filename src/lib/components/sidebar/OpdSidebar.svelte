<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import SidebarLink from './SidebarLink.svelte';
	import SidebarDropdown from './SidebarDropdown.svelte';
	import SidebarDropdownLink from './SidebarDropdownLink.svelte';
	import { sidebar } from '$lib/state/sidebar.svelte';

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
					href: '/opd/dashboard',
					label: 'Dashboard',
					icon: 'm4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
					links: []
				},
				{
					type: 'link',
					href: '/opd/profil-skpd',
					label: 'Profil SKPD',
					icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
					links: []
				},
				{
					type: 'link',
					href: '/opd/visi-misi',
					label: 'Visi Misi',
					icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z M7 8h5 M7 12h10 M7 16h10',
					links: []
				}
			]
		},
		{
			title: 'Manajemen Informasi',
			items: [
				{
					type: 'dropdown',
					label: 'Layanan',
					href: '',
					icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z',
					links: [
						{ href: '/opd/permohonan-informasi', label: 'Permohonan Informasi' },
						{ href: '/opd/pengajuan-keberatan', label: 'Pengajuan Keberatan' }
					]
				},
				{
					type: 'dropdown',
					label: 'Publikasi',
					href: '',
					icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z M7 8h5 M7 12h10 M7 16h10',
					links: [
						{ href: '/opd/dokumen-publik', label: 'Publikasi Dokumen' },
						{ href: '/opd/berita', label: 'Berita & Artikel' }
					]
				}
			]
		}
	];
</script>

<Sidebar title="OPD Panel">
	{#each menuGroups as group}
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
					<SidebarLink href={item.href} label={item.label}>
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
					<SidebarDropdown label={item.label} active={false} {activeDropdown} {setActiveDropdown}>
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
