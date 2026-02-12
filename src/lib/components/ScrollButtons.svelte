<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let scrollY = $state(0);
	let innerHeight = $state(0);
	let scrollHeight = $state(0);

	let showTop = $derived(scrollY > 300);
	// Show bottom button if we are not near the bottom
	// We use a small buffer (100px)
	let showBottom = $derived(
		scrollHeight > innerHeight && scrollY < scrollHeight - innerHeight - 100
	);

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function scrollToBottom() {
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	}

	onMount(() => {
		const updateHeight = () => {
			scrollHeight = document.documentElement.scrollHeight;
		};

		updateHeight();

		const observer = new ResizeObserver(updateHeight);
		observer.observe(document.body);
		observer.observe(document.documentElement);

		return () => {
			observer.disconnect();
		};
	});
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div class="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
	{#if showTop}
		<button
			onclick={scrollToTop}
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 200 }}
			class="group flex h-12 w-12 items-center justify-center rounded-full border border-ppid-accent/20 bg-ppid-primary text-ppid-accent shadow-lg shadow-ppid-primary/30 transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-ppid-primary-hover hover:shadow-xl hover:shadow-ppid-primary/50 focus:outline-hidden md:h-14 md:w-14"
			aria-label="Scroll to top"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2.5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
			</svg>
		</button>
	{/if}

	{#if showBottom}
		<button
			onclick={scrollToBottom}
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 200 }}
			class="group flex h-12 w-12 items-center justify-center rounded-full border border-ppid-accent/20 bg-ppid-primary text-ppid-accent shadow-lg shadow-ppid-primary/30 transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-ppid-primary-hover hover:shadow-xl hover:shadow-ppid-primary/50 focus:outline-hidden md:h-14 md:w-14"
			aria-label="Scroll to bottom"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2.5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
			</svg>
		</button>
	{/if}
</div>
