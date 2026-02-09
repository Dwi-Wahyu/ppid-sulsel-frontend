<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import SuccessModal from '$lib/components/SuccessModal.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { PUBLIC_API_URL } from '$env/static/public';

	// Interfaces
	interface Question {
		id: number;
		soal: string;
		tipe: 'radio' | 'textarea';
		urutan: number;
	}

	interface FormData {
		nama: string;
		email: string;
		lembaga: string;
		alamat: string;
		tanggal: string;
		answers: Record<number, string>;
		masukan: string;
	}

	// State
	let questions = $state<Question[]>([]);
	let isLoading = $state(true);
	let isSubmitting = $state(false);
	let showSuccessModal = $state(false);
	let honeyPot = $state(''); // Honeypot
	let errorMsg = $state('');

	let formData = $state<FormData>({
		nama: '',
		email: '',
		lembaga: '',
		alamat: '',
		tanggal: new Date().toISOString().split('T')[0],
		answers: {},
		masukan: ''
	});

	// Fetch Questions
	onMount(async () => {
		try {
			// Construct the API URL carefully to handle potential double slashes or missing slashes
			// Assuming PUBLIC_API_URL points to the base URL (e.g., http://localhost:8000)
			// The API route is defined as 'api/public/survey/questions' in routes/api.php relative to base?
			// Wait, in api.php it was defined as Route::get('/survey/questions', ...) inside the public group?
			// Let's re-check the route definition.
			// The routes/api.php has: Route::get('/survey/questions', 'SurveyController@create'); inside the public prefix group.
			// So the path is /api/public/survey/questions.

			// However, in previous tasks for permohonan-informasi, we used `${PUBLIC_API_URL}/public/...`.
			// Ideally PUBLIC_API_URL includes /api or points to the root.
			// Assuming PUBLIC_API_URL is just the base URL, we should append /api if needed or follow the pattern.
			// Let's inspect +page.svelte of permohonan-informasi to see how it calls the API.
			// It uses `${PUBLIC_API_URL}/public/domisili`.
			// So I should use `${PUBLIC_API_URL}/public/survey/questions`.

			const res = await fetch(`${PUBLIC_API_URL}/public/survey/questions`);
			const json = await res.json();

			if (json.success && json.data) {
				questions = json.data;
			}
		} catch (error) {
			console.error('Gagal mengambil pertanyaan survey:', error);
			errorMsg = 'Gagal memuat pertanyaan survey. Silakan refresh halaman.';
		} finally {
			isLoading = false;
		}
	});

	// Handle Radio Change
	function handleRadioChange(questionId: number, value: string) {
		formData.answers[questionId] = value;
	}

	// Submit Form
	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		errorMsg = '';

		// Honeypot check
		if (honeyPot) {
			console.warn('Bot detected');
			return;
		}

		// Validation: Check if all radio questions are answered
		const radioQuestions = questions.filter((q) => q.tipe === 'radio');
		const unanswered = radioQuestions.find((q) => !formData.answers[q.id]);

		if (unanswered) {
			errorMsg = `Pertanyaan nomor ${unanswered.urutan} wajib diisi!`;
			// Scroll to the question
			const el = document.getElementById(`question-${unanswered.id}`);
			el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return;
		}

		isSubmitting = true;

		try {
			const payload = {
				nama: formData.nama,
				email: formData.email,
				lembaga: formData.lembaga,
				alamat: formData.alamat,
				tanggal: formData.tanggal,
				answer: formData.answers,
				masukan: formData.masukan,
				website: honeyPot // Backend expects this to be empty
			};

			const res = await fetch(`${PUBLIC_API_URL}/public/survey/store`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify(payload)
			});

			const json = await res.json();

			if (!res.ok) {
				// Handle validation errors from backend
				if (res.status === 422 && json.errors) {
					const messages = Object.values(json.errors).flat().join('\n');
					throw new Error(messages);
				}
				throw new Error(json.message || 'Terjadi kesalahan saat mengirim survey.');
			}

			// Success
			showSuccessModal = true;

			// Reset form after delay
			setTimeout(() => {
				resetForm();
			}, 2000);
		} catch (error: any) {
			console.error('Submission error:', error);
			errorMsg = error.message || 'Gagal mengirim survey. Silakan coba lagi.';
			// Scroll to top to see error
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} finally {
			isSubmitting = false;
		}
	}

	function resetForm() {
		formData = {
			nama: '',
			email: '',
			lembaga: '',
			alamat: '',
			tanggal: new Date().toISOString().split('T')[0],
			answers: {},
			masukan: ''
		};
		// Reset radio inputs visually (bind:group would handle this if validAnswers loop but we're explicit)
		// Since we are not using bind:group in a loop of strings but simpler,
		// form reset logic for radios might need reactivity or just rely on formData.answers reset.
		// Actually, if we use checked attribute based on formData.answers, it should react.
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
				{ label: 'Isi Survey' }
			]}
		/>

		<div class="mt-4 flex items-end justify-between">
			<PageTitle
				title="Form Survey Kepuasan"
				subtitle="Bantu kami meningkatkan kualitas pelayanan"
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
		<div class="mx-auto max-w-4xl">
			<div
				class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="mb-8 border-b border-gray-200 pb-6 dark:border-slate-700">
					<h2 class="mb-3 text-2xl font-bold text-ppid-primary dark:text-white">
						Isi Formulir Survey
					</h2>
					<p class="text-base text-gray-600 dark:text-gray-300">
						Mohon isi data diri dan berikan penilaian Anda terhadap pelayanan kami.
					</p>
				</div>

				{#if errorMsg}
					<div
						class="mb-6 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400"
						transition:fade
					>
						<p class="font-bold">Terjadi Kesalahan:</p>
						<p class="whitespace-pre-line">{errorMsg}</p>
					</div>
				{/if}

				{#if isLoading}
					<div class="flex items-center justify-center py-12">
						<svg
							class="mr-3 h-8 w-8 animate-spin text-ppid-primary"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						<span class="text-gray-500">Memuat pertanyaan...</span>
					</div>
				{:else}
					<form onsubmit={handleSubmit} class="space-y-8">
						<!-- Honeypot -->
						<input
							type="text"
							name="website"
							class="hidden"
							bind:value={honeyPot}
							autocomplete="off"
						/>

						<!-- Section 1: Data Responden -->
						<div
							class="rounded-2xl border-2 border-gray-200 bg-linear-to-br from-blue-50 to-white p-8 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-800"
						>
							<div class="mb-6 flex items-center gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-ppid-primary text-white shadow-md"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								</div>
								<h3 class="text-xl font-bold text-ppid-primary dark:text-white">Data Responden</h3>
							</div>

							<div class="space-y-5">
								<!-- Email -->
								<div class="space-y-2">
									<label class="block text-base font-semibold text-gray-800 dark:text-gray-200">
										Email <span class="text-red-500">*</span>
									</label>
									<input
										type="email"
										bind:value={formData.email}
										placeholder="contoh@email.com"
										required
										class="w-full rounded-xl border-2 border-gray-300 bg-white px-5 py-3.5 text-base transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white"
									/>
								</div>

								<!-- Nama -->
								<div class="space-y-2">
									<label class="block text-base font-semibold text-gray-800 dark:text-gray-200">
										Nama Lengkap <span class="text-red-500">*</span>
									</label>
									<input
										type="text"
										bind:value={formData.nama}
										placeholder="Nama Lengkap Anda"
										required
										class="w-full rounded-xl border-2 border-gray-300 bg-white px-5 py-3.5 text-base transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white"
									/>
								</div>

								<!-- Lembaga -->
								<div class="space-y-2">
									<label class="block text-base font-semibold text-gray-800 dark:text-gray-200">
										Instansi / Lembaga / Umum <span class="text-red-500">*</span>
									</label>
									<input
										type="text"
										bind:value={formData.lembaga}
										placeholder="Nama Instansi/Lembaga atau 'Umum'"
										required
										class="w-full rounded-xl border-2 border-gray-300 bg-white px-5 py-3.5 text-base transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white"
									/>
								</div>

								<!-- Alamat -->
								<div class="space-y-2">
									<label class="block text-base font-semibold text-gray-800 dark:text-gray-200">
										Alamat <span class="text-red-500">*</span>
									</label>
									<textarea
										bind:value={formData.alamat}
										rows="3"
										placeholder="Alamat Lengkap"
										required
										class="w-full resize-none rounded-xl border-2 border-gray-300 bg-white px-5 py-3.5 text-base transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white"
									></textarea>
								</div>

								<!-- Tanggal -->
								<div class="space-y-2">
									<label class="block text-base font-semibold text-gray-800 dark:text-gray-200">
										Tanggal <span class="text-red-500">*</span>
									</label>
									<input
										type="date"
										bind:value={formData.tanggal}
										required
										disabled
										class="w-full rounded-xl border-2 border-gray-300 bg-white px-5 py-3.5 text-base transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white"
									/>
								</div>
							</div>
						</div>

						<!-- Section 2: Penilaian -->
						<div
							class="rounded-2xl border-2 border-gray-200 bg-linear-to-br from-amber-50 to-white p-8 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-800"
						>
							<div class="mb-6 flex items-center gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-ppid-accent text-white shadow-md"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<h3 class="text-xl font-bold text-ppid-primary dark:text-white">
									Penilaian Pelayanan
								</h3>
							</div>

							<div class="space-y-8">
								{#each questions as question, index (question.id)}
									<div
										class="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
										id={`question-${question.id}`}
									>
										<p
											class="mb-5 text-base leading-relaxed font-semibold text-gray-900 dark:text-white"
										>
											<span
												class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-ppid-primary text-sm font-bold text-white"
											>
												{index + 1}
											</span>
											{question.soal}
										</p>

										{#if question.tipe === 'radio'}
											<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
												{#each [{ val: 'Sangat Baik', label: 'A. Sangat Baik' }, { val: 'Baik', label: 'B. Baik' }, { val: 'Cukup Baik', label: 'C. Cukup Baik' }, { val: 'Tidak Baik', label: 'D. Tidak Baik' }] as opt}
													<label
														class="group relative flex cursor-pointer items-center gap-3 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-ppid-primary hover:bg-blue-50 dark:border-slate-600 dark:hover:bg-slate-700"
													>
														<input
															type="radio"
															name={`answer_${question.id}`}
															value={opt.val}
															checked={formData.answers[question.id] === opt.val}
															onchange={() => handleRadioChange(question.id, opt.val)}
															class="h-5 w-5 cursor-pointer text-ppid-primary focus:ring-2 focus:ring-ppid-primary"
														/>
														<span
															class="text-base font-medium text-gray-700 transition-colors group-hover:text-ppid-primary dark:text-gray-300 dark:group-hover:text-white"
														>
															{opt.label}
														</span>
													</label>
												{/each}
											</div>
										{:else if question.tipe === 'textarea'}
											<textarea
												bind:value={formData.answers[question.id]}
												rows="3"
												placeholder="Jawaban Anda..."
												class="w-full resize-none rounded-xl border-2 border-gray-300 bg-white px-5 py-3.5 text-base transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white"
											></textarea>
										{/if}
									</div>
								{/each}
							</div>
						</div>

						<!-- Section 3: Masukan -->
						<div
							class="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
						>
							<div class="mb-4 flex items-center gap-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6 text-ppid-primary"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
									/>
								</svg>
								<label class="text-lg font-bold text-gray-900 dark:text-white"
									>Masukan / Saran</label
								>
							</div>
							<p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
								Silakan berikan kritik dan saran untuk peningkatan layanan kami.
							</p>
							<textarea
								bind:value={formData.masukan}
								rows="5"
								placeholder="Tulis masukan Anda di sini..."
								class="w-full resize-none rounded-xl border-2 border-gray-300 bg-white px-5 py-3.5 text-base transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white"
							></textarea>
						</div>

						<!-- Buttons -->
						<div class="flex justify-end gap-4 pt-4">
							<button
								type="button"
								onclick={resetForm}
								class="px-6 py-3 text-base font-semibold text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
								disabled={isSubmitting}
							>
								Reset Form
							</button>
							<button
								type="submit"
								class="group relative overflow-hidden rounded-xl bg-linear-to-r from-ppid-primary to-ppid-primary/80 px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-400"
								disabled={isSubmitting}
							>
								<span class="relative z-10 flex items-center gap-2">
									{#if isSubmitting}
										<svg
											class="h-5 w-5 animate-spin"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
											></circle>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Mengirim...
									{:else}
										Kirim Survey
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 transition-transform group-hover:translate-x-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M13 7l5 5m0 0l-5 5m5-5H6"
											/>
										</svg>
									{/if}
								</span>
								<div
									class="absolute inset-0 origin-left scale-x-0 transform bg-ppid-accent transition-transform group-hover:scale-x-100"
								></div>
							</button>
						</div>
					</form>
				{/if}
			</div>
		</div>
	</div>
</main>

<SuccessModal
	bind:isOpen={showSuccessModal}
	title="Survey Terkirim!"
	message="Terima kasih telah mengisi survey kepuasan masyarakat. Masukan Anda sangat berarti bagi kami."
/>

<Footer />
