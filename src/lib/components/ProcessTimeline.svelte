<script>
	import * as m from '$lib/paraglide/messages.js';
</script>

<section
	class="relative overflow-hidden bg-[#fafafa] py-8 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900"
>
	<!-- Decorative Elements -->
	<div
		class="absolute top-10 left-0 h-48 w-48 rounded-full bg-ppid-primary/5 opacity-20 blur-3xl transition-transform duration-75 md:top-20 md:left-10 md:h-72 md:w-72 dark:bg-white/5"
	></div>
	<div
		class="absolute right-0 bottom-10 h-48 w-48 rounded-full bg-ppid-accent/5 opacity-20 blur-3xl transition-transform duration-75 md:right-10 md:bottom-20 md:h-72 md:w-72 dark:bg-yellow-500/5"
	></div>

	<div class="relative z-10 container mx-auto px-4 sm:px-6 md:px-4">
		<!-- Section Header -->
		<div class="mx-auto mb-12 max-w-3xl text-center md:mb-16" data-aos="fade-down">
			<div
				class="mb-4 inline-flex items-center gap-2 rounded-full border border-ppid-accent/30 bg-white px-4 py-2 shadow-sm md:px-5 md:py-2.5 dark:border-ppid-accent/20 dark:bg-slate-800"
			>
				<div class="h-2 w-2 animate-pulse rounded-full bg-ppid-accent"></div>
				<span
					class="text-xs font-bold tracking-wide text-ppid-primary uppercase md:text-sm dark:text-gray-200"
					>{m['timeline.badge']()}</span
				>
			</div>
			<h2
				class="mb-4 text-2xl leading-tight font-bold text-ppid-primary sm:text-3xl md:text-5xl dark:text-white"
			>
				{m['timeline.title']()}
			</h2>
			<p class="text-base leading-relaxed text-ppid-text md:text-xl dark:text-gray-400">
				{m['timeline.subtitle']()}
			</p>
		</div>

		<div class="mx-auto max-w-6xl">
			<div class="relative grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-4 md:gap-8">
				<!-- Connecting Line -->
				<div
					class="absolute top-16 right-0 left-0 hidden h-1 bg-gradient-to-r from-ppid-primary/10 via-ppid-accent/20 to-ppid-primary/10 md:block dark:from-white/5 dark:via-ppid-accent/20 dark:to-white/5"
					style="width: calc(100% - 8rem); left: 4rem;"
				></div>

				{#each [{ n: '1', title: 'timeline.step_1_title', desc: 'timeline.step_1_desc', dur: 'Instant', col: 'from-ppid-primary to-ppid-primary-light', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />' }, { n: '2', title: 'timeline.step_2_title', desc: 'timeline.step_2_desc', dur: '1-2 Hari', col: 'from-ppid-accent to-ppid-accent-light', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0 1 12 2.714Z" />' }, { n: '3', title: 'timeline.step_3_title', desc: 'timeline.step_3_desc', dur: '3-7 Hari', col: 'from-ppid-primary to-ppid-primary-light', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9" />' }, { n: '4', title: 'timeline.step_4_title', desc: 'timeline.step_4_desc', dur: 'timeline.step_4_duration', col: 'from-ppid-accent to-ppid-accent-light', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />' }] as s, index}
					<div class="relative" data-aos="fade-up" data-aos-delay={index * 200}>
						<div
							class="group rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-ppid-accent/30 hover:shadow-[0_20px_50px_-10px_rgba(26,48,94,0.15)] md:p-8 dark:border-slate-700 dark:bg-slate-800"
						>
							<div class="flex flex-row gap-4 md:flex-col md:gap-0">
								<!-- Icon/Number Badge -->
								<div class="flex-shrink-0">
									<!-- Number Badge - Desktop only -->
									<div
										class="absolute -top-4 -left-4 z-10 hidden h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br {s.col} text-xl font-bold text-white shadow-lg md:flex"
									>
										{s.n}
									</div>

									<!-- Icon Badge -->
									<div
										class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br {s.col} text-white shadow-md transition-transform group-hover:scale-110 md:mb-6 md:h-16 md:w-16"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="2"
											stroke="currentColor"
											class="h-6 w-6 md:h-8 md:w-8"
										>
											{@html s.icon}
										</svg>
									</div>
								</div>

								<!-- Content -->
								<div class="flex flex-grow flex-col">
									<h3
										class="mb-2 text-base font-bold text-ppid-primary md:mb-3 md:text-xl dark:text-white"
									>
										{m[s.title]()}
									</h3>
									<p
										class="mb-3 text-sm leading-relaxed text-ppid-text md:mb-4 md:text-base dark:text-gray-300"
									>
										{m[s.desc]()}
									</p>

									<div
										class="inline-flex w-fit items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5 md:px-4 md:py-2 dark:border-slate-600 dark:bg-slate-700"
									>
										<svg
											class="h-3 w-3 text-ppid-accent md:h-4 md:w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg
										>
										<span
											class="text-xs font-semibold text-ppid-primary md:text-sm dark:text-gray-200"
											>{s.dur.startsWith('timeline.') ? m[s.dur]() : s.dur}</span
										>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Total Duration -->
			<div class="mt-12 text-center" data-aos="zoom-in">
				<div
					class="inline-flex flex-col items-center gap-3 rounded-2xl border border-ppid-accent/30 bg-white px-6 py-4 shadow-lg sm:flex-row md:px-8 dark:border-ppid-accent/20 dark:bg-slate-800"
				>
					<div class="flex items-center gap-3">
						<div class="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
						<p class="text-sm text-ppid-text md:text-base dark:text-gray-300">
							<strong class="text-ppid-primary dark:text-white">{m['timeline.total_time']()}</strong
							>

							{m['timeline.max_days']()}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
