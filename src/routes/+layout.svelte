<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import '$lib/accessibility.css';
	import favicon from '$lib/assets/favicon.svg';
	import AccessibilityMenu from '$lib/components/AccessibilityMenu.svelte';

	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let showAccessibilityMenu = $derived(
		!page.url.pathname.startsWith('/admin') &&
			!page.url.pathname.startsWith('/opd') &&
			!page.url.pathname.startsWith('/login')
	);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if showAccessibilityMenu}
	<AccessibilityMenu />
{/if}

{@render children()}
<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>
			{locale}
		</a>
	{/each}
</div>
