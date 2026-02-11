<script lang="ts">
	import AdminHeader from '$lib/components/AdminHeader.svelte';
	import OpdSidebar from '$lib/components/sidebar/OpdSidebar.svelte';
	let { children } = $props();
</script>

<div class="flex h-screen overflow-hidden bg-page-bg">
	<OpdSidebar />
	<main class="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
		<AdminHeader />
		<div class="p-6">
			{@render children()}
		</div>
	</main>
</div>
