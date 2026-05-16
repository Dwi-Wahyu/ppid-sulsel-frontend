<script lang="ts">
	let { disposisi = [], id_skpd } = $props();
</script>

<section
	aria-labelledby="tracking-title"
	class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
>
	<div
		class="border-b border-white/10 bg-linear-to-r from-ppid-primary to-ppid-primary-light p-4"
	>
		<h3 id="tracking-title" class="flex items-center gap-2 text-lg font-bold text-white">
			<svg
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
				/>
			</svg>
			Tracking Disposisi OPD
			{#if disposisi.length > 0}
				<span class="ml-2 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold">
					{disposisi.length} OPD
				</span>
			{/if}
		</h3>
	</div>

	<div class="p-6">
		{#if disposisi.length > 0}
			<div class="space-y-6">
				{#each disposisi as item}
					{#if item.id_skpd !== id_skpd}
						<div
							class="relative border-l-2 border-slate-200 pb-2 pl-8 last:pb-0 dark:border-slate-700"
						>
							<div
								class="absolute top-0 -left-2.25 h-4 w-4 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-800"
							></div>
							<div class="mb-3 flex flex-col gap-2 sm:flex-row sm:justify-between">
								<div>
									<h4 class="font-bold text-slate-900 dark:text-white">{item.skpd.nm_skpd}</h4>
									<time class="text-xs text-slate-500"
										>{new Date(item.created_at).toLocaleString('id-ID')}</time
									>
									<span
										class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
									>
										{item.status_label || 'Menunggu'}
									</span>
								</div>
							</div>
							{#if item.catatan_disposisi}
								<p
									class="rounded-lg bg-slate-50 p-3 text-sm text-slate-600 italic dark:bg-slate-900/50 dark:text-slate-300"
								>
									"{item.catatan_disposisi}"
								</p>
							{/if}
						</div>
					{/if}
				{/each}
			</div>
		{:else}
			<div class="py-8 text-center">
				<p class="text-slate-500 italic dark:text-slate-400">
					Belum ada disposisi yang dikirimkan.
				</p>
			</div>
		{/if}
	</div>
</section>
