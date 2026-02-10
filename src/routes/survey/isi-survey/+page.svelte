<script lang="ts">
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	// Mock survey questions - in production, fetch from API
	const questions = [
		{ id: 1, soal: m.survey_questions_q1(), tipe: 'radio', urutan: 1 },
		{ id: 2, soal: m.survey_questions_q2(), tipe: 'radio', urutan: 2 },
		{ id: 3, soal: m.survey_questions_q3(), tipe: 'radio', urutan: 3 },
		{ id: 4, soal: m.survey_questions_q4(), tipe: 'radio', urutan: 4 },
		{ id: 5, soal: m.survey_questions_q5(), tipe: 'radio', urutan: 5 },
		{ id: 6, soal: m.survey_questions_q6(), tipe: 'radio', urutan: 6 },
		{ id: 7, soal: m.survey_questions_q7(), tipe: 'radio', urutan: 7 },
		{ id: 8, soal: m.survey_questions_q8(), tipe: 'radio', urutan: 8 },
		{ id: 9, soal: m.survey_questions_q9(), tipe: 'radio', urutan: 9 },
		{ id: 10, soal: m.survey_questions_q10(), tipe: 'radio', urutan: 10 },
		{ id: 11, soal: m.survey_questions_q11(), tipe: 'radio', urutan: 11 },
		{ id: 12, soal: m.survey_questions_q12(), tipe: 'radio', urutan: 12 },
		{ id: 13, soal: m.survey_questions_q13(), tipe: 'radio', urutan: 13 },
		{ id: 14, soal: m.survey_questions_q14(), tipe: 'radio', urutan: 14 },
		{ id: 15, soal: m.survey_questions_q15(), tipe: 'radio', urutan: 15 },
		{ id: 16, soal: m.survey_questions_q16(), tipe: 'radio', urutan: 16 },
		{ id: 17, soal: m.survey_questions_q17(), tipe: 'radio', urutan: 17 },
		{ id: 18, soal: m.survey_questions_q18(), tipe: 'textarea', urutan: 18 }
	];

	let formData = $state({
		email: '',
		nama: '',
		lembaga: '',
		alamat: '',
		tanggal: '',
		answers: {} as Record<number, string>,
		masukan: ''
	});

	let showSuccessModal = $state(false);
	let formTimestamp = $state(0);

	onMount(() => {
		formTimestamp = Date.now();
	});

	function handleSubmit(event: Event) {
		event.preventDefault();
		
		// Basic bot detection - ensure form wasn't filled too quickly
		const timeTaken = Date.now() - formTimestamp;
		if (timeTaken < 5000) {
			console.warn('Form submitted too quickly - possible bot');
			return;
		}

		// In production, send to API
		console.log('Survey submitted:', formData);
		
		// Show success modal
		showSuccessModal = true;

		// Reset form
		setTimeout(() => {
			formData = {
				email: '',
				nama: '',
				lembaga: '',
				alamat: '',
				tanggal: '',
				answers: {},
				masukan: ''
			};
		}, 500);
	}

	function handleReset() {
		formData = {
			email: '',
			nama: '',
			lembaga: '',
			alamat: '',
			tanggal: '',
			answers: {},
			masukan: ''
		};
	}

	const breadcrumbItems = [
		{ label: m.breadcrumb_home(), href: '/' },
		{ label: m.breadcrumb_survey(), href: '/survey/isi-survey' },
		{ label: m.survey_pages_isi_title(), href: '/survey/isi-survey' }
	];
</script>

<Header />

<!-- Breadcrumb + Title Section -->
<div class="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 font-['Plus_Jakarta_Sans']">
	<div class="container mx-auto px-4 py-6">
		<!-- Breadcrumb -->
		<Breadcrumb items={breadcrumbItems} />
		
		<!-- Title -->
		<div class="flex items-end justify-between">
			<div>
				<h1 class="text-3xl md:text-4xl font-bold text-ppid-primary dark:text-white mb-2">
					{m.survey_form_title()}
				</h1>
				<p class="text-gray-600 dark:text-gray-300">
					{m.survey_form_subtitle()}
				</p>
			</div>
			<div class="hidden md:block">
				<div class="w-20 h-1 bg-gradient-to-r from-ppid-primary to-transparent rounded-full"></div>
			</div>
		</div>
	</div>
</div>

<!-- Main Content -->
<main class="py-10 md:py-16 bg-gray-50 dark:bg-slate-900 font-['Plus_Jakarta_Sans']">
	<div class="container mx-auto px-4">
		<div class="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
			
			<div class="border-b border-gray-200 dark:border-slate-700 pb-6 mb-8">
				<h2 class="text-2xl font-bold text-ppid-primary dark:text-white mb-3">{m.survey_form_form_title()}</h2>
				<p class="text-base text-gray-600 dark:text-gray-300">{m.survey_form_form_desc()}</p>
			</div>

			<form onsubmit={handleSubmit} class="space-y-8">
				<!-- Honeypot field for bot detection (hidden, must remain empty) -->
				<div style="position: absolute; left: -9999px; opacity: 0;" aria-hidden="true">
					<input type="text" name="website" tabindex="-1" autocomplete="off" />
				</div>
				<!-- Timestamp for bot detection -->
				<input type="hidden" name="_form_timestamp" value={formTimestamp} />
				
				<!-- Section: Data Responden -->
				<div class="bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-slate-700 shadow-sm">
					<div class="flex items-center gap-3 mb-6">
						<div class="flex items-center justify-center w-10 h-10 rounded-full bg-ppid-primary text-white shadow-md">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</div>
						<h3 class="text-xl font-bold text-ppid-primary dark:text-white">{m.survey_form_respondent_data()}</h3>
					</div>
					<div class="space-y-5">
						<div class="space-y-2">
							<label class="block text-base font-semibold text-gray-800 dark:text-gray-200">{m.survey_form_email()} <span class="text-red-500">*</span></label>
							<input 
								type="email" 
								bind:value={formData.email}
								placeholder="contoh@email.com" 
								required 
								class="w-full px-5 py-3.5 text-base rounded-xl border-2 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-ppid-primary focus:border-ppid-primary outline-none transition-all bg-white dark:bg-slate-800 dark:text-white" 
							/>
						</div>
						<div class="space-y-2">
							<label class="block text-base font-semibold text-gray-800 dark:text-gray-200">{m.survey_form_name()} <span class="text-red-500">*</span></label>
							<input 
								type="text" 
								bind:value={formData.nama}
								placeholder={m.form_full_name()} 
								required 
								class="w-full px-5 py-3.5 text-base rounded-xl border-2 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-ppid-primary focus:border-ppid-primary outline-none transition-all bg-white dark:bg-slate-800 dark:text-white" 
							/>
						</div>
						<div class="space-y-2">
							<label class="block text-base font-semibold text-gray-800 dark:text-gray-200">{m.survey_form_institution()} <span class="text-red-500">*</span></label>
							<input 
								type="text" 
								bind:value={formData.lembaga}
								placeholder={m.survey_form_institution_placeholder()} 
								required 
								class="w-full px-5 py-3.5 text-base rounded-xl border-2 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-ppid-primary focus:border-ppid-primary outline-none transition-all bg-white dark:bg-slate-800 dark:text-white" 
							/>
						</div>
						<div class="space-y-2">
							<label class="block text-base font-semibold text-gray-800 dark:text-gray-200">{m.survey_form_address()} <span class="text-red-500">*</span></label>
							<textarea 
								rows={3} 
								bind:value={formData.alamat}
								placeholder={m.form_applicant_address()} 
								required 
								class="w-full px-5 py-3.5 text-base rounded-xl border-2 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-ppid-primary focus:border-ppid-primary outline-none transition-all bg-white dark:bg-slate-800 dark:text-white resize-none"
							></textarea>
						</div>
						<div class="space-y-2">
							<label class="block text-base font-semibold text-gray-800 dark:text-gray-200">{m.survey_form_date()} <span class="text-red-500">*</span></label>
							<input 
								type="date" 
								bind:value={formData.tanggal}
								required 
								class="w-full px-5 py-3.5 text-base rounded-xl border-2 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-ppid-primary focus:border-ppid-primary outline-none transition-all bg-white dark:bg-slate-800 dark:text-white" 
							/>
						</div>
					</div>
				</div>

				<!-- Section: Penilaian -->
				<div class="bg-gradient-to-br from-amber-50 to-white dark:from-slate-900 dark:to-slate-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-slate-700 shadow-sm">
					<div class="flex items-center gap-3 mb-6">
						<div class="flex items-center justify-center w-10 h-10 rounded-full bg-ppid-accent text-white shadow-md">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<h3 class="text-xl font-bold text-ppid-primary dark:text-white">{m.survey_form_service_rating()}</h3>
					</div>
					
					<div class="space-y-8">
						{#each questions as question, index}
							<div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
								<p class="text-base font-semibold text-gray-900 dark:text-white mb-5 leading-relaxed">
									<span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-ppid-primary text-white text-sm font-bold mr-2">{index + 1}</span>
									{question.soal}
								</p>
								
								{#if question.tipe === 'radio'}
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
										<label class="relative flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 dark:border-slate-600 cursor-pointer hover:border-ppid-primary hover:bg-blue-50 dark:hover:bg-slate-700 transition-all group">
											<input 
												type="radio" 
												name="answer_{question.id}" 
												bind:group={formData.answers[question.id]}
												value="Sangat Baik" 
												required 
												class="w-5 h-5 text-ppid-primary focus:ring-2 focus:ring-ppid-primary cursor-pointer" 
											/>
											<span class="text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-ppid-primary dark:group-hover:text-white transition-colors">A. {m.survey_form_very_good()}</span>
										</label>
										<label class="relative flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 dark:border-slate-600 cursor-pointer hover:border-ppid-primary hover:bg-blue-50 dark:hover:bg-slate-700 transition-all group">
											<input 
												type="radio" 
												name="answer_{question.id}" 
												bind:group={formData.answers[question.id]}
												value="Baik" 
												required 
												class="w-5 h-5 text-ppid-primary focus:ring-2 focus:ring-ppid-primary cursor-pointer" 
											/>
											<span class="text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-ppid-primary dark:group-hover:text-white transition-colors">B. {m.survey_form_good()}</span>
										</label>
										<label class="relative flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 dark:border-slate-600 cursor-pointer hover:border-ppid-primary hover:bg-blue-50 dark:hover:bg-slate-700 transition-all group">
											<input 
												type="radio" 
												name="answer_{question.id}" 
												bind:group={formData.answers[question.id]}
												value="Cukup Baik" 
												required 
												class="w-5 h-5 text-ppid-primary focus:ring-2 focus:ring-ppid-primary cursor-pointer" 
											/>
											<span class="text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-ppid-primary dark:group-hover:text-white transition-colors">C. {m.survey_form_fair()}</span>
										</label>
										<label class="relative flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 dark:border-slate-600 cursor-pointer hover:border-ppid-primary hover:bg-blue-50 dark:hover:bg-slate-700 transition-all group">
											<input 
												type="radio" 
												name="answer_{question.id}" 
												bind:group={formData.answers[question.id]}
												value="Tidak Baik" 
												required 
												class="w-5 h-5 text-ppid-primary focus:ring-2 focus:ring-ppid-primary cursor-pointer" 
											/>
											<span class="text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-ppid-primary dark:group-hover:text-white transition-colors">D. {m.survey_form_poor()}</span>
										</label>
									</div>
								{:else if question.tipe === 'textarea'}
									<textarea 
										rows={5} 
										bind:value={formData.answers[question.id]}
										placeholder={m.survey_form_comment_placeholder()} 
										class="w-full px-5 py-3.5 text-base rounded-xl border-2 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-ppid-primary focus:border-ppid-primary outline-none transition-all bg-white dark:bg-slate-800 dark:text-white resize-none"
									></textarea>
								{/if}
							</div>
						{/each}
					</div>
				</div>

				<!-- Section: Masukan -->
				<div class="bg-white dark:bg-slate-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-slate-700 shadow-sm">
					<div class="flex items-center gap-3 mb-4">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-ppid-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
						</svg>
						<label class="text-lg font-bold text-gray-900 dark:text-white">{m.survey_form_feedback_section()}</label>
					</div>
					<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{m.survey_form_feedback_desc()}</p>
					<textarea 
						rows={5} 
						bind:value={formData.masukan}
						placeholder={m.survey_form_feedback_placeholder()} 
						class="w-full px-5 py-3.5 text-base rounded-xl border-2 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-ppid-primary focus:border-ppid-primary transition-all outline-none bg-white dark:bg-slate-800 dark:text-white resize-none"
					></textarea>
				</div>

				<div class="pt-4 flex gap-4 justify-end">
					<button 
						type="button"
						onclick={handleReset}
						class="px-6 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
					>
						{m.survey_form_reset_btn()}
					</button>
					<button 
						type="submit"
						class="group relative px-10 py-4 bg-gradient-to-r from-ppid-primary to-ppid-primary-light text-white text-lg font-bold rounded-xl hover:from-ppid-primary-light hover:to-ppid-primary transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 overflow-hidden"
					>
						<span class="relative z-10 flex items-center gap-2">
							{m.survey_form_submit_btn()}
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
							</svg>
						</span>
						<div class="absolute inset-0 bg-ppid-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
					</button>
				</div>
			</form>

		</div>
	</div>
</main>

<!-- Success Notification Modal -->
{#if showSuccessModal}
	<NotificationDialog 
		bind:open={showSuccessModal}
		status="success" 
		title={m.survey_form_success_title()}
		description={m.survey_pages_thank_you()}
	/>
{/if}

<Footer />
