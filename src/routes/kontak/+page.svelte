<script>
	import Footer from '$lib/components/Footer.svelte';
	import * as m from '$lib/paraglide/messages.js';

	// Form state
	let formData = $state({
		name: '',
		phone: '',
		email: '',
		subject: '',
		message: ''
	});

	let isSubmitting = $state(false);
	let showSuccess = $state(false);

	async function handleSubmit(e) {
		e.preventDefault();
		isSubmitting = true;

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Show success message
			showSuccess = true;

			// Reset form
			formData = {
				name: '',
				phone: '',
				email: '',
				subject: '',
				message: ''
			};

			// Hide success message after 5 seconds
			setTimeout(() => {
				showSuccess = false;
			}, 5000);
		} catch (error) {
			console.error('Error submitting form:', error);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<!-- Main Container -->
<div
	class="flex min-h-[calc(100vh-80px)] flex-col justify-center bg-gray-50 py-4 font-['Plus_Jakarta_Sans'] lg:py-0 dark:bg-slate-900"
>
	<div class="container mx-auto h-full px-4 lg:max-w-7xl">
		<!-- Breadcrumb & Title -->
		<div class="mb-4 pt-2 lg:mb-6">
			<nav class="mb-2 flex text-sm font-medium text-gray-500" aria-label="Breadcrumb">
				<ol class="inline-flex items-center space-x-1 md:space-x-2">
					<li class="inline-flex items-center">
						<a href="/" class="flex items-center gap-1 transition-colors hover:text-ppid-accent">
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"
								><path
									d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
								></path></svg
							>
							{m['header.home']()}
						</a>
					</li>
					<li><span class="text-gray-400">/</span></li>
					<li class="font-bold text-ppid-primary dark:text-white" aria-current="page">
						{m['contact.subtitle']()}
					</li>
				</ol>
			</nav>
			<h1
				class="text-2xl font-extrabold tracking-tight text-ppid-primary md:text-3xl dark:text-white"
			>
				{m['contact.title']()}
			</h1>
		</div>

		<!-- Content Grid -->
		<div class="mb-12 grid h-auto gap-4 lg:h-[600px] lg:grid-cols-12 lg:gap-8">
			<!-- LEFT COLUMN: Info & Map -->
			<div class="flex h-full flex-col gap-4 lg:col-span-4">
				<!-- Info Card -->
				<div
					class="flex-shrink-0 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="space-y-4">
						<!-- Phone -->
						<div class="group flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-ppid-primary/10 text-ppid-primary transition-all group-hover:bg-ppid-primary group-hover:text-ppid-accent dark:text-white"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									></path></svg
								>
							</div>
							<div>
								<p class="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
									{m['contact.phone']()}
								</p>
								<a
									href="tel:0411453192"
									class="text-base font-bold text-ppid-primary hover:underline dark:text-white"
									>(0411) 453192</a
								>
							</div>
						</div>

						<!-- Email -->
						<div class="group flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-ppid-primary/10 text-ppid-primary transition-all group-hover:bg-ppid-primary group-hover:text-ppid-accent dark:text-white"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									></path></svg
								>
							</div>
							<div class="overflow-hidden">
								<p class="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
									{m['contact.email']()}
								</p>
								<a
									href="mailto:ppid@sulawesiprov.go.id"
									class="block truncate text-base font-bold text-ppid-primary hover:underline dark:text-white"
									>ppid@sulawesiprov.go.id</a
								>
							</div>
						</div>

						<!-- Hours -->
						<div class="group flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-ppid-primary/10 text-ppid-primary transition-all group-hover:bg-ppid-primary group-hover:text-ppid-accent dark:text-white"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									></path></svg
								>
							</div>
							<div>
								<p class="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
									{m['contact.hours']()}
								</p>
								<p class="text-sm font-bold text-ppid-primary dark:text-white">
									{m['contact.hours_value']()}
								</p>
							</div>
						</div>

						<!-- Address -->
						<div class="group flex items-start gap-3">
							<div
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-ppid-primary/10 text-ppid-primary transition-all group-hover:bg-ppid-primary group-hover:text-ppid-accent dark:text-white"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									></path><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									></path></svg
								>
							</div>
							<div>
								<p class="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
									{m['contact.address']()}
								</p>
								<p class="text-sm leading-snug font-medium text-ppid-primary dark:text-white">
									{m['contact.address_value']()}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Map -->
				<div
					class="min-h-[200px] flex-grow overflow-hidden rounded-xl border border-gray-200 bg-gray-200 shadow-sm dark:border-slate-700"
				>
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.743864500984!2d119.43285731476497!3d-5.145163996265785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbee2c6a0e66041%3A0x67a3221971700685!2sKantor%20Gubernur%20Sulawesi%20Selatan!5e0!3m2!1sid!2sid!4v1679000000000!5m2!1sid!2sid"
						width="100%"
						height="100%"
						style="border:0;"
						allowfullscreen=""
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"
						title="Lokasi Kantor Gubernur Sulawesi Selatan"
					></iframe>
				</div>
			</div>

			<!-- RIGHT COLUMN: Form -->
			<div class="flex h-full flex-col lg:col-span-8">
				<div
					class="flex h-full flex-col justify-between rounded-xl border-t-4 border-ppid-accent bg-white p-6 shadow-lg lg:p-8 dark:bg-slate-800"
				>
					<div>
						<h2 class="mb-1 text-xl font-bold text-ppid-primary dark:text-white">
							{m['contact.form_title']()}
						</h2>
						<p class="mb-6 text-sm text-gray-500 dark:text-gray-400">{m['contact.form_desc']()}</p>

						<!-- Success Message -->
						{#if showSuccess}
							<div
								class="mb-6 rounded-lg border-l-4 border-green-500 bg-green-50 p-4 dark:bg-green-900/30"
							>
								<div class="flex items-center">
									<svg class="mr-2 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									<span class="font-semibold text-green-800 dark:text-green-300"
										>Pesan berhasil dikirim!</span
									>
								</div>
							</div>
						{/if}

						<form onsubmit={handleSubmit} class="space-y-4">
							<!-- Row 1: Name & Phone -->
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label
										for="name"
										class="mb-1 block text-sm font-bold text-ppid-primary dark:text-white"
										>{m['contact.name_label']()}</label
									>
									<input
										type="text"
										id="name"
										bind:value={formData.name}
										class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
										placeholder={m['contact.name_placeholder']()}
										required
									/>
								</div>
								<div>
									<label
										for="phone"
										class="mb-1 block text-sm font-bold text-ppid-primary dark:text-white"
										>{m['contact.phone_label']()}</label
									>
									<input
										type="tel"
										id="phone"
										bind:value={formData.phone}
										class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
										placeholder={m['contact.phone_placeholder']()}
										required
									/>
								</div>
							</div>

							<!-- Row 2: Email & Subject -->
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label
										for="email"
										class="mb-1 block text-sm font-bold text-ppid-primary dark:text-white"
										>{m['contact.email_label']()}</label
									>
									<input
										type="email"
										id="email"
										bind:value={formData.email}
										class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
										placeholder={m['contact.email_placeholder']()}
										required
									/>
								</div>
								<div>
									<label
										for="subject"
										class="mb-1 block text-sm font-bold text-ppid-primary dark:text-white"
										>{m['contact.subject_label']()}</label
									>
									<select
										id="subject"
										bind:value={formData.subject}
										class="w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
										required
									>
										<option value="" disabled>{m['contact.select_topic']()}</option>
										<option value="permohonan">{m['contact.topic_request']()}</option>
										<option value="pengaduan">{m['contact.topic_complaint']()}</option>
										<option value="saran">{m['contact.topic_suggestion']()}</option>
									</select>
								</div>
							</div>

							<!-- Row 3: Message -->
							<div>
								<label
									for="message"
									class="mb-1 block text-sm font-bold text-ppid-primary dark:text-white"
									>{m['contact.message_label']()}</label
								>
								<textarea
									id="message"
									bind:value={formData.message}
									class="h-32 w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
									placeholder={m['contact.message_placeholder']()}
									required
								></textarea>
							</div>

							<!-- Submit Button -->
							<div class="pt-6">
								<button
									type="submit"
									disabled={isSubmitting}
									class="flex w-full transform items-center justify-center gap-2 rounded-lg bg-ppid-primary px-6 py-3 font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-ppid-accent disabled:opacity-50"
								>
									{#if isSubmitting}
										<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
										<span>Mengirim...</span>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
											/>
										</svg>
										<span>{m['contact.submit_btn']()}</span>
									{/if}
								</button>
							</div>
						</form>
					</div>

					<!-- Footer Note -->
					<div class="mt-4 border-t border-gray-100 pt-4">
						<p class="text-center text-xs text-gray-500 dark:text-gray-400">
							{m['contact.footer_note']()}
							<a
								href="/layanan/permohonan-informasi"
								class="font-bold text-ppid-primary underline hover:text-ppid-accent dark:text-white"
								>{m['contact.footer_link']()}</a
							>.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<Footer />
