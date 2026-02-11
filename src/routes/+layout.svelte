<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import '$lib/accessibility.css';
	import favicon from '$lib/assets/favicon.svg';
	import AccessibilityMenu from '$lib/components/AccessibilityMenu.svelte';

	import Header from '$lib/components/Header.svelte';

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

	let isPublicPage = $derived(
		!page.url.pathname.startsWith('/admin') &&
			!page.url.pathname.startsWith('/opd') &&
			!page.url.pathname.startsWith('/login')
	);

	let showAccessibilityMenu = $derived(isPublicPage);
	let showHeader = $derived(isPublicPage);

	// Add padding top for non-home pages when header is visible
	let mainClass = $derived(showHeader && page.url.pathname !== '/' ? 'pt-32 lg:pt-48' : '');
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if showAccessibilityMenu}
	<AccessibilityMenu />
{/if}

{#if showHeader}
	<Header />
{/if}

<main class={mainClass}>
	{@render children()}
</main>

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>
			{locale}
		</a>
	{/each}
</div>
