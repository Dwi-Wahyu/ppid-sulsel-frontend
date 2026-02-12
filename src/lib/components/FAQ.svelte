<script lang="ts">
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import * as m from '$lib/paraglide/messages.js';

	// Types untuk data FAQ
	interface FaqItem {
		id_faq: number;
		pertanyaan: string;
		jawaban: string;
		is_active: boolean;
		urutan: number | null;
	}

	interface ApiResponse {
		data: {
			data: FaqItem[];
			current_page: number;
			last_page: number;
		};
	}

	// State (Svelte 5 Runes)
	let active = $state<number | null>(null);
	let faqs = $state<FaqItem[]>([]);
	let isLoading = $state(true);

	// Fetch Data dari API
	async function fetchFaqs() {
		try {
			const response = await fetch(`${env.PUBLIC_API_URL}/public/faq`);
			const result: ApiResponse = await response.json();
			// Mengambil data dari nested object sesuai struktur Laravel pagination
			faqs = result.data.data;
		} catch (error) {
			console.error('Gagal memuat FAQ:', error);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		fetchFaqs();
	});
</script>

<section class="bg-white py-8 font-sans md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto mb-12 max-w-3xl text-center md:mb-16">
			<div
				class="mb-4 inline-flex items-center gap-2 rounded-full border border-ppid-accent bg-white px-5 py-2.5 shadow-xs dark:border-blue-400/20 dark:bg-white/10"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="text-ppid-accent dark:text-ppid-accent"
				>
					<circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line
						x1="12"
						x2="12"
						y1="17"
						y2="17.01"
					/>
				</svg>
				<span
					class="text-sm font-bold tracking-wide text-ppid-primary uppercase dark:text-ppid-primary"
				>
					{m['faq.badge']()}
				</span>
			</div>
			<h2 class="mb-4 text-3xl font-extrabold text-ppid-primary md:text-4xl dark:text-white">
				{m['faq.frequently_asked']()}
			</h2>
			<p class="text-lg text-ppid-text dark:text-slate-400">
				{m['faq.quick_info']()}
			</p>
		</div>

		<div class="mx-auto max-w-3xl space-y-4">
			{#if isLoading}
				{#each Array(5) as _}
					<div class="h-16 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"></div>
				{/each}
			{:else if faqs.length > 0}
				{#each faqs as faq, index (faq.id_faq)}
					<div
						class="overflow-hidden rounded-2xl border transition-all duration-300 {active === index
							? 'border-ppid-accent bg-ppid-accent/10 shadow-sm dark:border-blue-500/50 dark:bg-blue-500/5'
							: 'border-slate-200 bg-white hover:border-ppid-accent dark:border-slate-700 dark:bg-slate-800'}"
					>
						<button
							onclick={() => (active = active === index ? null : index)}
							class="group flex min-h-15 w-full items-center justify-between p-4 text-left outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 sm:p-5 md:p-6"
							aria-expanded={active === index}
						>
							<span
								class="pr-4 text-base leading-snug font-bold transition-colors md:text-lg {active ===
								index
									? 'text-ppid-primary dark:text-ppid-primary'
									: 'text-ppid-text group-hover:text-ppid-primary dark:text-white'}"
							>
								{faq.pertanyaan}
							</span>
							<div
								class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all {active ===
								index
									? 'bg-ppid-accent text-white'
									: 'bg-slate-100 text-slate-500 group-hover:bg-ppid-primary group-hover:text-white dark:bg-slate-700'}"
							>
								<svg
									class="h-5 w-5 transition-transform duration-300 {active === index
										? 'rotate-180'
										: ''}"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2.5"
								>
									<path d="m6 9 6 6 6-6" />
								</svg>
							</div>
						</button>

						{#if active === index}
							<div transition:slide={{ duration: 300 }}>
								<div
									class="border-t border-blue-100 px-4 pt-2 pb-6 text-slate-600 sm:px-5 md:px-6 dark:border-slate-700 dark:text-slate-400"
								>
									<p class="leading-relaxed">
										{@html faq.jawaban}
									</p>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			{:else}
				<p class="text-center text-slate-500">{m['faq.no_faq']()}</p>
			{/if}
		</div>
	</div>
</section>
