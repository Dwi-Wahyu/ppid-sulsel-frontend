<script>
	import * as m from '$lib/paraglide/messages.js';

	// Mock news data - replace with actual API call later
	let news = $state([
		{
			id: 1,
			judul: 'Contoh Berita 1',
			img_berita: null,
			tgl_upload: '2024-02-01',
			slug: 'contoh-berita-1',
			skpd: { nm_skpd: 'PPID Utama' }
		},
		{
			id: 2,
			judul: 'Contoh Berita 2',
			img_berita: null,
			tgl_upload: '2024-02-02',
			slug: 'contoh-berita-2',
			skpd: { nm_skpd: 'Diskominfo' }
		},
		{
			id: 3,
			judul: 'Contoh Berita 3',
			img_berita: null,
			tgl_upload: '2024-02-03',
			slug: 'contoh-berita-3',
			skpd: { nm_skpd: 'Bappeda' }
		}
	]);

	/**
	 * @param {string} dateString
	 */
	function formatDate(dateString) {
		const date = new Date(dateString);
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'Mei',
			'Jun',
			'Jul',
			'Agu',
			'Sep',
			'Okt',
			'Nov',
			'Des'
		];
		return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
	}
</script>

<section class="bg-white py-8 font-['Plus_Jakarta_Sans'] transition-all md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<!-- Section Header -->
		<div class="mx-auto mb-10 max-w-3xl text-center md:mb-[55px]" data-aos="fade-down">
			<div
				class="mb-[13px] inline-flex items-center gap-2 rounded-full border border-ppid-accent/30 bg-white px-4 py-1.5 shadow-sm md:px-5 md:py-2 dark:bg-slate-800"
			>
				<span class="h-2 w-2 animate-pulse rounded-full bg-ppid-accent"></span>
				<span
					class="text-[9px] font-black tracking-widest text-ppid-primary uppercase md:text-[10px] dark:text-gray-200"
					>{m['common.news']()}</span
				>
			</div>
			<h2
				class="mb-4 text-2xl leading-tight font-extrabold tracking-tight text-ppid-primary sm:text-3xl md:mb-[21px] md:text-4xl lg:text-[42px] dark:text-white"
			>
				{m['news.title']()}
			</h2>
			<p class="text-base text-ppid-text md:text-lg dark:text-gray-300">
				{m['news.latest_update']()}
			</p>
		</div>

		<!-- News Grid -->
		<div
			class="scrollbar-hide mx-auto flex max-w-7xl snap-x snap-mandatory gap-6 overflow-x-auto pb-4 md:gap-[34px] lg:grid lg:grid-cols-3 lg:overflow-x-visible lg:pb-0"
		>
			{#each news as item, index}
				<div
					data-aos="fade-up"
					data-aos-delay={index * 150}
					class="group flex min-w-[280px] snap-start flex-col overflow-hidden rounded-[21px] border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(26,48,94,0.15)] lg:min-w-0 dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="relative aspect-[1.618/1] overflow-hidden">
						{#if item.img_berita}
							<img
								src="/storage/img_berita/{item.img_berita}"
								class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
								alt={item.judul}
							/>
						{:else}
							<div
								class="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 transition-transform duration-700 group-hover:scale-110 dark:from-slate-700 dark:to-slate-800"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-12 w-12 text-gray-300 dark:text-slate-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.5"
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
						{/if}
						<div
							class="absolute inset-0 bg-gradient-to-t from-ppid-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
						></div>

						<div class="absolute top-4 left-4 md:top-[21px] md:left-[21px]">
							<span
								class="rounded-lg bg-ppid-accent px-3 py-1.5 text-[9px] font-bold text-white shadow-lg md:px-4 md:py-2 md:text-[10px]"
							>
								{item.skpd?.nm_skpd ?? m['common.general']()}
							</span>
						</div>
					</div>

					<div class="flex flex-grow flex-col p-5 sm:p-6 md:p-[34px]">
						<div
							class="mb-3 flex items-center gap-2 text-xs font-semibold text-ppid-text md:mb-[13px] dark:text-gray-400"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line
									x1="16"
									x2="16"
									y1="2"
									y2="6"
								/><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg
							>
							{formatDate(item.tgl_upload)}
						</div>
						<a href="/berita/{item.slug}" class="block">
							<h3
								class="mb-6 line-clamp-2 text-lg leading-snug font-bold text-ppid-primary transition-colors group-hover:text-ppid-accent md:mb-[21px] md:text-[21px] dark:text-white"
							>
								{item.judul}
							</h3>
						</a>

						<div class="mt-auto">
							<a
								href="/berita/{item.slug}"
								class="group/btn inline-flex items-center gap-2 text-sm font-bold text-ppid-primary transition-colors hover:text-ppid-accent dark:text-gray-200"
							>
								<span>{m['common.read_more']()}</span>
								<svg
									class="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="3"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg
								>
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- View All Button -->
		<div class="mt-12 text-center" data-aos="fade-up">
			<a
				href="/berita"
				class="inline-flex items-center gap-2 rounded-full bg-ppid-primary px-8 py-3 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-ppid-accent hover:text-ppid-primary hover:shadow-xl"
			>
				<span>{m['common.view_all']()}</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 8l4 4m0 0l-4 4m4-4H3"
					/></svg
				>
			</a>
		</div>
	</div>
</section>
