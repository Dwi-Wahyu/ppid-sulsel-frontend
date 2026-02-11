<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import * as m from '$lib/paraglide/messages.js';
	import { getImageUrl } from '$lib/get-image-url';

	interface Leader {
		name: string;
		pos: string;
		img: string;
		badge: string;
		fb: string | null;
		ig: string | null;
	}

	// State Management (Svelte 5 Runes)
	let leaders = $state<Leader[]>([]);
	let isLoading = $state(true);

	onMount(async () => {
		await fetchLeaders();
	});

	async function fetchLeaders() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/public/profil-pemprov`);
			const result = await response.json();

			if (result && result.data) {
				const d = result.data;
				const baseUrl = PUBLIC_API_URL.replace('/api', '/storage/');

				leaders = [
					{
						name: 'gov_name',
						pos: 'gov_pos',
						img: d.foto_gubernur ? baseUrl + d.foto_gubernur : '/images/gubernur.jpg',
						badge: 'gov_badge',
						fb: d.fb_gubernur,
						ig: d.ig_gubernur
					},
					{
						name: 'vice_gov_name',
						pos: 'vice_gov_pos',
						img: d.foto_wakil ? baseUrl + d.foto_wakil : '/images/wakil-gubernur.jpg',
						badge: 'vice_gov_badge',
						fb: d.fb_wakil,
						ig: d.ig_wakil
					}
				];
			}
		} catch (error) {
			console.error('Gagal mengambil data pimpinan:', error);
		} finally {
			// Memastikan skeleton hilang meskipun API gagal [cite: 56, 57]
			isLoading = false;
		}
	}
</script>

<section
	class="relative overflow-hidden bg-[#fafafa] py-8 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900"
>
	<div class="relative z-10 container mx-auto px-4 sm:px-6">
		<div
			class="mx-auto flex w-full justify-center gap-6 px-4 pb-4 md:grid md:max-w-4xl md:grid-cols-2 md:gap-12 md:px-0 md:pb-0"
		>
			{#if isLoading}
				<div class="h-96 w-full animate-pulse rounded-[3rem] bg-slate-200 dark:bg-slate-800"></div>
				<div class="h-96 w-full animate-pulse rounded-[3rem] bg-slate-200 dark:bg-slate-800"></div>
			{:else}
				{#each leaders as leader, index}
					<div
						data-aos="fade-up"
						data-aos-delay={index * 200}
						class="group flex min-w-50 snap-start flex-col md:min-w-0"
					>
						<div
							class="relative aspect-4/5 w-full overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-700 group-hover:-translate-y-1 group-hover:shadow-xl md:rounded-[3rem] dark:border-slate-700"
						>
							<div class="absolute inset-x-0 top-0 z-40 h-2 rounded-t-lg bg-ppid-primary"></div>

							<img
								src={leader.img}
								class="h-full w-full object-cover object-top pt-1 transition-transform duration-1000 group-hover:scale-105"
								alt={leader.img}
							/>

							<div
								class="absolute bottom-6 left-6 z-30 flex translate-y-4 gap-2 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100"
							>
								{#if leader.fb}
									<a
										href={leader.fb}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Facebook {leader.name}"
										title="Facebook {leader.name}"
										class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white backdrop-blur-md hover:bg-ppid-accent"
									>
										<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
											<path
												d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
											/>
										</svg>
									</a>
								{/if}

								{#if leader.ig}
									<a
										href={leader.ig}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Instagram {leader.name}"
										title="Instagram {leader.name}"
										class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white backdrop-blur-md hover:bg-ppid-accent"
									>
										<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
											<path
												d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.282.888.871 1.213 2.083 1.291 3.703.072 1.492.094 1.992.094 5.834s-.022 4.342-.094 5.834c-.078 1.62-.404 2.833-1.291 3.703-.975.95-2.242 1.219-3.608 1.282-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.282-.888-.871-1.212-2.083-1.291-3.703-.072-1.492-.094-1.992-.094-5.834s.022-4.342.094-5.834c.078-1.62.404-2.833 1.291-3.703.975-.95 2.242-1.219 3.608-1.282 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.337 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.338-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
											/>
										</svg>
									</a>
								{/if}
							</div>
						</div>

						<div class="mt-6 space-y-2 text-center md:text-left">
							<div
								class="inline-block rounded-full bg-ppid-primary/10 px-4 py-1 text-[10px] font-black tracking-widest text-ppid-primary uppercase dark:bg-ppid-primary/20"
							>
								{m[`leadership.${leader.badge}`]()}
							</div>
							<h3 class="text-xl font-black tracking-tight text-slate-800 dark:text-white">
								{m[`leadership.${leader.name}`]()}
							</h3>
							<p class="text-sm font-bold tracking-tighter text-slate-400 uppercase">
								{m[`leadership.${leader.pos}`]()}
							</p>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</section>
