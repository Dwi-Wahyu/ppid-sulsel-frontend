<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import SidebarLink from './SidebarLink.svelte';
	import SidebarDropdown from './SidebarDropdown.svelte';
	import SidebarDropdownLink from './SidebarDropdownLink.svelte';

	let sidebarOpen = $state(true);
	let activeDropdown = $state<string | null>(null);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function setActiveDropdown(label: string | null) {
		activeDropdown = label;
	}
</script>

<Sidebar {sidebarOpen} {toggleSidebar} title="OPD Panel">
	<div class="mt-2 mb-2 px-6 transition-all duration-300" class:opacity-0={!sidebarOpen}>
		<span class="text-[10px] font-bold tracking-[2px] text-slate-400 uppercase">Main Menu</span>
	</div>

	<ul>
		<SidebarLink href="/opd/dashboard" label="Dashboard" {sidebarOpen}>
			{#snippet icon()}
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
					></path>
				</svg>
			{/snippet}
		</SidebarLink>

		<SidebarDropdown
			label="Layanan"
			active={false}
			{sidebarOpen}
			{activeDropdown}
			{setActiveDropdown}
		>
			{#snippet icon()}
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
					<path
						fill="currentColor"
						fill-rule="evenodd"
						d="M21.5 14c0-6.904 5.596-12.5 12.5-12.5S46.5 7.096 46.5 14S40.904 26.5 34 26.5S21.5 20.904 21.5 14m14 0a1.5 1.5 0 0 0-3 0v7a1.5 1.5 0 0 0 3 0zM34 6.5A1.5 1.5 0 0 1 35.5 8v1a1.5 1.5 0 0 1-3 0V8A1.5 1.5 0 0 1 34 6.5M13.889 28a6 6 0 1 0 0-12a6 6 0 0 0 0 12m-6.86 5.514c.275-1.539 1.484-2.708 3.04-2.847a45 45 0 0 1 3.932-.167c1.57 0 2.896.075 3.931.167c1.557.139 2.766 1.308 3.041 2.847c.105.584.217 1.253.329 1.987c-7.16.007-11.764.038-14.613.068c.116-.761.232-1.453.34-2.055m38.862 6.094c-.172-1.009-1.125-1.49-2.149-1.507C41.284 38.06 35.581 38 24 38c-11.58 0-17.283.062-19.742.1c-1.024.017-1.977.5-2.15 1.51A8.5 8.5 0 0 0 2 41.021c0 .556.042 1.014.105 1.39c.17 1.023 1.137 1.51 2.175 1.52C6.751 43.959 12.454 44 24 44s17.25-.042 19.72-.068c1.037-.012 2.004-.498 2.175-1.52c.063-.376.105-.835.105-1.39a8.4 8.4 0 0 0-.109-1.414"
						clip-rule="evenodd"
					/>
				</svg>
			{/snippet}
			<SidebarDropdownLink href="/opd/permohonan-informasi" label="Permohonan Informasi" />
			<SidebarDropdownLink href="/opd/pengajuan-keberatan" label="Pengajuan Keberatan" />
		</SidebarDropdown>

		<SidebarLink href="/opd/berita" label="Berita & Artikel" {sidebarOpen}>
			{#snippet icon()}
				<svg
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
					></path>
				</svg>
			{/snippet}
		</SidebarLink>
	</ul>

	<div class="mt-4 mb-2 px-6 transition-all duration-300" class:opacity-0={!sidebarOpen}>
		<span class="text-[10px] font-bold tracking-[2px] text-slate-400 uppercase"
			>Manajemen Informasi</span
		>
	</div>
	<ul>
		<SidebarLink href="/opd/dokumen-publik" label="Publikasi Dokumen" {sidebarOpen}>
			{#snippet icon()}
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					></path>
				</svg>
			{/snippet}
		</SidebarLink>

		<SidebarLink href="/opd/ikphns" label="Informasi Pengadaan" {sidebarOpen}>
			{#snippet icon()}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z"
					/>
					<path d="M10 21.9V14L2.1 9.1" />
					<path d="m10 14 11.9-6.9" />
					<path d="M14 19.8v-8.1" />
					<path d="M18 17.5V9.4" />
				</svg>
			{/snippet}
		</SidebarLink>
	</ul>

	<div class="mt-4 mb-2 px-6 transition-all duration-300" class:opacity-0={!sidebarOpen}>
		<span class="text-[10px] font-bold tracking-[2px] text-slate-400 uppercase">Pengaturan</span>
	</div>
	<ul>
		<SidebarLink href="/opd/profil-skpd" label="Profil SKPD" {sidebarOpen}>
			{#snippet icon()}
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
					></path>
				</svg>
			{/snippet}
		</SidebarLink>
	</ul>
</Sidebar>
