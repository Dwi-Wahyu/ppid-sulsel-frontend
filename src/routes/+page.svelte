<script>
	import Hero from '$lib/components/Hero.svelte';
	import ServiceCards from '$lib/components/ServiceCards.svelte';
	import ProcessTimeline from '$lib/components/ProcessTimeline.svelte';
	import DownloadCenter from '$lib/components/DownloadCenter.svelte';
	import NewsSection from '$lib/components/NewsSection.svelte';

	import Leadership from '$lib/components/Leadership.svelte';
	import LegalBanner from '$lib/components/LegalBanner.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	onMount(async () => {
		const today = new Date().toISOString().split('T')[0];
		const lastVisited = localStorage.getItem('visited_today');

		if (lastVisited !== today) {
			try {
				await fetch(`${PUBLIC_API_URL}/track-visitor`, {
					method: 'POST'
				});
				localStorage.setItem('visited_today', today);
			} catch (error) {
				console.error('Failed to track visitor', error);
			}
		}
	});
</script>

<Hero />

<ServiceCards />

<ProcessTimeline />

<DownloadCenter />

<NewsSection />

<Leadership />

<LegalBanner />

<FAQ />

<Footer />
