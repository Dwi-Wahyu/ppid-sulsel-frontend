<script>
	import * as m from '$lib/paraglide/messages.js';

	// Mock leadership data - replace with actual API call
	let leaders = $state([
		{
			name: 'leadership.gov_name',
			pos: 'leadership.gov_pos',
			img: '/images/gubernur.jpg',
			badge: 'leadership.gov_badge',
			fb: null,
			ig: null
		},
		{
			name: 'leadership.vice_gov_name',
			pos: 'leadership.vice_gov_pos',
			img: '/images/wakil-gubernur.jpg',
			badge: 'leadership.vice_gov_badge',
			fb: null,
			ig: null
		}
	]);
</script>

<section
	class="relative overflow-hidden bg-[#fafafa] py-8 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900"
>
	<!-- Parallax Background Elements -->
	<div
		class="absolute top-0 right-0 h-72 w-72 translate-x-1/3 -translate-y-1/2 rounded-full bg-ppid-primary/5 opacity-40 blur-[100px] transition-transform duration-75 ease-out dark:bg-white/5"
	></div>
	<div
		class="absolute bottom-0 left-0 h-72 w-72 -translate-x-1/3 translate-y-1/2 rounded-full bg-ppid-accent/10 opacity-40 blur-[100px] transition-transform duration-75 ease-out dark:bg-yellow-500/10"
	></div>

	<div class="relative z-10 container mx-auto px-4 sm:px-6">
		<!-- Section Header -->
		<div class="mb-12 text-center sm:mb-16 md:mb-20" data-aos="fade-down">
			<span class="mb-3 block text-[10px] font-bold tracking-[0.2em] text-ppid-accent uppercase"
				>{m['leadership.badge']()}</span
			>
			<h2
				class="mb-4 text-2xl font-extrabold tracking-tight text-ppid-primary sm:text-3xl md:text-4xl dark:text-white"
			>
				{m['leadership.title']()}
			</h2>
			<div class="mx-auto h-1 w-12 rounded-full bg-ppid-accent"></div>
		</div>

		<!-- Grid -->
		<div
			class="mx-auto flex w-full justify-center gap-6 px-4 pb-4 md:grid md:max-w-4xl md:grid-cols-2 md:gap-12 md:px-0 md:pb-0"
		>
			{#each leaders as leader, index}
				<div
					data-aos="fade-up"
					data-aos-delay={index * 200}
					class="group flex min-w-[200px] snap-start flex-col md:min-w-0"
				>
					<!-- Image Card -->
					<div
						class="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-700 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-[rgba(26,48,94,0.15)] md:rounded-[3rem] dark:border-slate-700"
					>
						<!-- Navy List stripe -->
						<div class="absolute inset-x-0 top-0 z-40 h-2 rounded-t-lg bg-ppid-primary"></div>

						<img
							src={leader.img}
							class="h-full w-full object-cover object-top pt-1 transition-transform duration-1000 group-hover:scale-105"
							alt={m[leader.name]()}
						/>

						<!-- Dark Overlay for Vice Governor -->
						{#if leader.badge === 'leadership.vice_gov_badge'}
							<div
								class="absolute inset-0 z-10 bg-black/20 transition-opacity group-hover:opacity-30"
							></div>
						{/if}

						<!-- Hover Gradient Overlay -->
						<div
							class="absolute inset-0 z-20 bg-gradient-to-t from-ppid-primary/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						></div>

						<!-- Social Media Icons -->
						<div
							class="absolute bottom-6 left-6 z-30 flex translate-y-4 gap-2 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100"
						>
							{#if leader.fb}
								<a
									href={leader.fb}
									target="_blank"
									class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-ppid-accent hover:bg-ppid-accent"
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
									class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-ppid-accent hover:bg-ppid-accent"
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

					<!-- Bio Area -->
					<div class="mt-4 text-center sm:mt-5 md:pl-2 md:text-left">
						<h3
							class="mb-0.5 text-lg font-bold tracking-tight text-ppid-primary transition-colors group-hover:text-ppid-accent md:text-xl dark:text-white"
						>
							{m[leader.name]()}
						</h3>
						<p
							class="text-[10px] font-bold tracking-[0.15em] text-ppid-accent uppercase md:text-xs"
						>
							{m[leader.pos]()}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
