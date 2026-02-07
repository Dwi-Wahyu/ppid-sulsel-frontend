<script>
	import { slide } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';

	let active = $state(null);
</script>

<section class="bg-white py-8 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<!-- Section Header -->
		<div class="mx-auto mb-12 max-w-3xl text-center md:mb-16" data-aos="fade-down">
			<div
				class="mb-4 inline-flex items-center gap-2 rounded-full border border-ppid-accent/30 bg-white px-5 py-2.5 shadow-sm dark:border-ppid-accent/20 dark:bg-white/10"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="text-ppid-accent"
				>
					<circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line
						x1="12"
						x2="12"
						y1="17"
						y2="17"
					/>
				</svg>
				<span
					class="text-xs font-bold tracking-wide text-ppid-primary uppercase md:text-sm dark:text-gray-200"
					>{m['faq.badge']()}</span
				>
			</div>
			<h2
				class="mb-4 text-2xl leading-tight font-bold tracking-tight text-ppid-primary sm:text-3xl md:text-5xl dark:text-white"
			>
				{m['faq.title']()}
			</h2>
			<p class="text-base text-ppid-text md:text-lg dark:text-gray-400">
				{m['faq.subtitle']()}
			</p>
		</div>

		<div class="mx-auto max-w-4xl space-y-3 sm:space-y-4">
			{#each [{ q: 'faq.q1', a: 'faq.a1' }, { q: 'faq.q2', a: 'faq.a2' }, { q: 'faq.q3', a: 'faq.a3' }] as faq, index}
				<div
					class="overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 dark:bg-slate-800 {active ===
					index
						? 'border-ppid-accent shadow-lg ring-2 ring-ppid-accent/20'
						: 'border-gray-200 hover:border-ppid-accent/50 dark:border-slate-700'}"
					data-aos="fade-up"
					data-aos-delay={index * 50}
				>
					<button
						onclick={() => (active = active === index ? null : index)}
						class="group flex min-h-[60px] w-full items-center justify-between p-4 text-left focus:outline-none sm:p-5 md:p-6"
					>
						<span
							class="pr-4 text-base leading-snug font-bold text-ppid-primary transition-colors group-hover:text-ppid-accent md:text-lg dark:text-white"
						>
							{m[faq.q]()}
						</span>
						<div
							class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ppid-primary/5 transition-all group-hover:bg-ppid-primary group-hover:text-white dark:bg-white/10 dark:group-hover:bg-ppid-accent dark:group-hover:text-ppid-primary"
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
						<div
							transition:slide={{ duration: 300 }}
							class="px-4 pt-0 pb-5 sm:px-5 sm:pb-6 md:px-6 md:pb-8"
						>
							<div class="mb-4 h-px w-full bg-gray-100 dark:bg-slate-600"></div>
							<p class="text-sm leading-relaxed text-ppid-text md:text-base dark:text-slate-300">
								{m[faq.a]()}
							</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>
