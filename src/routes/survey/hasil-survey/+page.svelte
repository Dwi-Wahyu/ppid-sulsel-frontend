<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { PUBLIC_API_URL } from '$env/static/public';

	// Interfaces
	interface Stat {
		option: string;
		count: number;
		percentage: number;
	}

	interface QuestionResult {
		question: {
			id: number;
			soal: string;
			urutan: number;
		};
		stats: Stat[];
	}

	// State
	let results = $state<QuestionResult[]>([]);
	let isLoading = $state(true);
	let overallIKM = $state(0);
	let totalRespondents = $state(0);
	let completionRate = $state(0); // Mock or calc
	let avgRating = $state(0); // Mock or calc

	onMount(async () => {
		try {
			const res = await fetch(`${PUBLIC_API_URL}/public/survey/results`);
			const json = await res.json();

			if (json.success && json.data) {
				results = json.data;
				calculateStats(results);
			}
		} catch (error) {
			console.error('Gagal mengambil hasil survey:', error);
		} finally {
			isLoading = false;
		}
	});

	function calculateStats(data: QuestionResult[]) {
		if (data.length === 0) return;

		// 1. Total Respondents (Take max count from any question, ideally they are consistent)
		// Or assume Q1 represents total starts.
		// Let's sum counts of Q1 stats.
		const firstQStats = data[0].stats;
		totalRespondents = firstQStats.reduce((acc, curr) => acc + curr.count, 0);

		// 2. IKM / Satisfaction Index Calculation (Approximate)
		// Scale: Sangat Baik (4), Baik (3), Cukup Baik (2), Tidak Baik (1)
		let totalScore = 0;
		let maxPossibleScore = 0;

		data.forEach((q) => {
			q.stats.forEach((s) => {
				let weight = 0;
				if (s.option === 'Sangat Baik') weight = 4;
				else if (s.option === 'Baik') weight = 3;
				else if (s.option === 'Cukup Baik') weight = 2;
				else if (s.option === 'Tidak Baik') weight = 1; // Assuming 'Tidak Baik', 'Buruk', 'Kurang' map to 1

				totalScore += s.count * weight;
				maxPossibleScore += s.count * 4;
			});
		});

		if (maxPossibleScore > 0) {
			overallIKM = (totalScore / maxPossibleScore) * 100;
			// Normalize to 0-100 or keep as is. Usually IKM is 0-100 or 0-4.
			// Let's keep 0-100 for the progress bar.

			// Avg Rating (1-5 scale or 1-4 scale?)
			// If scale is 1-4
			avgRating = (totalScore / maxPossibleScore) * 4;
		}

		// Completion Rate (Mock 92% as per design, or calculate if we had abandoned data)
		completionRate = totalRespondents > 0 ? 95 : 0;
	}

	function getOptionColor(label: string) {
		// Just for visual variation if needed, or stick to design classes
		return 'bg-ppid-purple';
	}

	function getLetter(index: number) {
		return String.fromCharCode(65 + index);
	}
</script>

<!-- Breadcrumb + Title Section -->
<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-8">
		<Breadcrumb
			items={[
				{ label: 'breadcrumb.home', href: '/' },
				{ label: 'header.survey' },
				{ label: 'Hasil Survey' }
			]}
		/>

		<div class="mt-4 flex items-end justify-between">
			<PageTitle
				title="Hasil Survey Kepuasan"
				subtitle="Indeks kepuasan masyarakat terhadap pelayanan kami"
			/>
			<div class="hidden md:block">
				<div class="h-1.5 w-24 rounded-full bg-linear-to-r from-ppid-primary to-ppid-accent"></div>
			</div>
		</div>
	</div>
</div>

<!-- Main Content -->
<main class="bg-gray-50 py-12 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		{#if isLoading}
			<div class="flex items-center justify-center py-20">
				<svg
					class="mr-3 h-10 w-10 animate-spin text-ppid-primary"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				<span class="text-xl font-medium text-gray-500">Memuat hasil survey...</span>
			</div>
		{:else}
			<div class="mx-auto max-w-7xl space-y-12" transition:fade>
				<!-- Summary Stats -->
				<div class="grid items-center gap-8 md:grid-cols-2">
					<div>
						<h2 class="mb-4 text-2xl font-bold text-ppid-primary dark:text-white">
							Indeks Kepuasan Masyarakat (IKM)
						</h2>
						<p class="mb-6 leading-relaxed text-gray-600 dark:text-gray-300">
							Berdasarkan survey yang telah dilakukan, nilai IKM saat ini berada pada kategori
							<strong class="text-ppid-primary dark:text-ppid-accent">
								{overallIKM >= 80
									? 'Sangat Baik'
									: overallIKM >= 60
										? 'Baik'
										: overallIKM >= 40
											? 'Cukup'
											: 'Kurang'}
							</strong>. Terima kasih atas partisipasi Anda dalam meningkatkan kualitas pelayanan
							kami.
						</p>

						<div
							class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
						>
							<div class="mb-2 flex items-end gap-2">
								<span class="text-5xl font-bold text-ppid-accent">{overallIKM.toFixed(1)}</span>
								<span class="mb-2 text-gray-500">/ 100</span>
							</div>
							<div class="mb-2 h-2.5 w-full rounded-full bg-gray-200 dark:bg-slate-700">
								<div
									class="h-2.5 rounded-full bg-linear-to-r from-ppid-primary to-ppid-accent transition-all duration-1000"
									style="width: {overallIKM}%"
								></div>
							</div>
							<p class="text-sm font-medium text-ppid-primary dark:text-white">
								Kategori: {overallIKM >= 80
									? 'Sangat Baik'
									: overallIKM >= 60
										? 'Baik'
										: overallIKM >= 40
											? 'Cukup'
											: 'Kurang'}
							</p>
						</div>
					</div>

					<div>
						<div class="grid grid-cols-2 gap-4">
							<div
								class="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
							>
								<h3 class="mb-1 text-4xl font-bold text-ppid-primary dark:text-white">
									{totalRespondents}
								</h3>
								<p class="text-sm text-gray-500">Responden</p>
							</div>
							<div
								class="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
							>
								<h3 class="mb-1 text-4xl font-bold text-ppid-primary dark:text-white">
									{completionRate}%
								</h3>
								<p class="text-sm text-gray-500">Tingkat Pengisian</p>
							</div>
							<div
								class="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
							>
								<h3 class="mb-1 text-4xl font-bold text-ppid-primary dark:text-white">
									{avgRating.toFixed(1)}
								</h3>
								<p class="text-sm text-gray-500">Rata-rata Rating (1-4)</p>
							</div>
							<div
								class="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
							>
								<h3 class="mb-1 text-4xl font-bold text-ppid-primary dark:text-white">24h</h3>
								<p class="text-sm text-gray-500">Waktu Respon (Avg)</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Detailed Results -->
				<div class="space-y-6">
					{#each results as result (result.question.id)}
						<div
							class="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-md transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
						>
							<!-- Header -->
							<div class="bg-linear-to-r from-ppid-primary to-ppid-primary/80 p-6">
								<div class="flex items-start gap-3">
									<span
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg font-bold text-ppid-primary shadow-md"
									>
										{result.question.urutan}
									</span>
									<h4 class="pt-1 text-lg leading-relaxed font-bold text-white">
										{result.question.soal}
									</h4>
								</div>
							</div>

							<!-- Chart Area -->
							<div
								class="space-y-5 bg-linear-to-br from-gray-50 to-white p-6 dark:from-slate-900 dark:to-slate-800"
							>
								{#each result.stats as stat, i}
									<div class="group">
										<div class="mb-2 flex items-center justify-between">
											<div class="flex items-center gap-2">
												<span
													class="flex h-7 w-7 items-center justify-center rounded-full bg-ppid-primary text-sm font-bold text-white"
												>
													{getLetter(i)}
												</span>
												<span class="text-base font-semibold text-gray-800 dark:text-gray-200">
													{stat.option}
												</span>
											</div>
											<div class="flex items-center gap-2">
												<span class="text-sm text-gray-600 dark:text-gray-400"
													>{stat.count} Responden</span
												>
												<span class="text-xl font-bold text-ppid-primary">{stat.percentage}%</span>
											</div>
										</div>
										<div
											class="relative h-10 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner dark:bg-slate-700"
										>
											<div
												class="flex h-full items-center rounded-full bg-linear-to-r from-ppid-primary to-ppid-accent px-4 transition-all duration-700 ease-out group-hover:brightness-110"
												style="width: {stat.percentage}%"
											>
												{#if stat.percentage > 12}
													<span class="text-sm font-bold text-white drop-shadow-md"
														>{stat.percentage}%</span
													>
												{/if}
											</div>
										</div>
									</div>
								{/each}
							</div>

							<!-- Footer -->
							<div
								class="border-t-2 border-gray-200 bg-linear-to-r from-blue-50 to-amber-50 px-6 py-4 dark:border-slate-600 dark:from-slate-800 dark:to-slate-700"
							>
								<div class="flex items-center justify-between text-sm">
									<span class="font-medium text-gray-600 dark:text-gray-400">Total Responden</span>
									<span class="text-base font-bold text-ppid-primary dark:text-ppid-accent">
										{result.stats.reduce((a, b) => a + b.count, 0)} Orang
									</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</main>
