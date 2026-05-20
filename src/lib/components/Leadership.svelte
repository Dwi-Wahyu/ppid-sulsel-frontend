<script lang="ts">
	import { onMount } from 'svelte';
	import { getImageUrl } from '$lib/get-image-url';
	import * as m from '$lib/paraglide/messages.js';
	import { api } from '$lib/api';

	interface Leader {
		name: string;
		pos: string;
		img: string;
		badge: string;
		fb?: string;
		ig?: string;
	}

	let leaders = $state<Leader[]>([]);
	let isLoading = $state(true);

	onMount(async () => {
		try {
			const result = await api.get(`/public/profil-pemerintah`);
			if (result && result.data) {
				const d = result.data;

				leaders = [
					{
						name: 'gov_name',
						pos: 'gov_pos',
						img: d.foto_gubernur ? getImageUrl(d.foto_gubernur) : '/images/gubernur.jpg',
						badge: 'gov_badge',
						fb: d.fb_gubernur,
						ig: d.ig_gubernur
					},
					{
						name: 'vice_gov_name',
						pos: 'vice_gov_pos',
						img: d.foto_wakil ? getImageUrl(d.foto_wakil) : '/images/wakil-gubernur.jpg',
						badge: 'vice_gov_badge',
						fb: d.fb_wakil,
						ig: d.ig_wakil
					}
				];
			}
		} catch (error) {
			console.error('Error fetching leaders:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<section class="bg-slate-50 py-24 transition-colors dark:bg-slate-900/50" id="leadership">
	<div class="container mx-auto px-4">
		<div class="mb-16 text-center">
			<span
				class="mb-3 inline-block rounded-full bg-ppid-primary/10 px-4 py-1 text-xs font-bold tracking-widest text-ppid-primary uppercase dark:bg-white/10 dark:text-ppid-accent"
			>
				{m['leadership.badge']()}
			</span>
			<h2 class="text-4xl font-black tracking-tight text-slate-900 md:text-5xl dark:text-white">
				{m['leadership.title']()}
			</h2>
			<p class="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
				{m['leadership.desc']()}
			</p>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:mx-auto lg:max-w-5xl">
			{#if isLoading}
				{#each Array(2) as _}
					<div
						class="h-[500px] animate-pulse rounded-[2.5rem] bg-slate-200 dark:bg-slate-800"
					></div>
				{/each}
			{:else}
				{#each leaders as leader}
					<div
						class="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-800"
					>
						<div class="relative aspect-[4/5] overflow-hidden">
							<img
								src={leader.img}
								alt={m[`leadership.${leader.name}`]()}
								class="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
							/>
							<!-- Overlay -->
							<div
								class="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40"
							></div>

							<!-- Social Actions -->
							<div
								class="absolute top-6 right-6 flex flex-col gap-3 translate-x-12 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
							>
								{#if leader.fb}
									<a
										href={leader.fb}
										target="_blank"
										class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-ppid-primary"
									>
										<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"
											><path
												d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
											/></svg
										>
									</a>
								{/if}
								{#if leader.ig}
									<a
										href={leader.ig}
										target="_blank"
										class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-ppid-primary"
									>
										<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"
											><path
												d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
											/></svg
										>
									</a>
								{/if}
							</div>
						</div>

						<div class="p-8">
							<div
								class="mb-3 inline-block rounded-lg bg-ppid-primary/10 px-3 py-1 text-[10px] font-black tracking-widest text-ppid-primary uppercase dark:bg-white/10 dark:text-ppid-accent"
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
