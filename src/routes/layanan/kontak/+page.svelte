<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { api } from '$lib/api';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import type { ContactForm, SubjectOption } from '$lib/types/contact';

	// State Management (Svelte 5 Runes)
	let processing = $state(false);
	let status = $state({ show: false, type: 'success' as 'success' | 'error', msg: '' });

	// Form State
	let formData = $state<ContactForm>({
		name: '',
		phone: '',
		email: '',
		subject: '',
		message: ''
	});

	async function handleContactSubmit(e: SubmitEvent) {
		e.preventDefault();
		processing = true;

		try {
			// Integrasi dengan helper api.ts
			const res = await api.post('/public/contact', formData);
			if (res.success) {
				status = {
					show: true,
					type: 'success',
					msg: 'Pesan Anda telah berhasil dikirim. Kami akan segera menghubungi Anda.'
				};
				// Reset Form
				formData = { name: '', phone: '', email: '', subject: '', message: '' };
			}
		} catch (err: any) {
			status = {
				show: true,
				type: 'error',
				msg: err.message || 'Gagal mengirim pesan. Silakan coba lagi nanti.'
			};
		} finally {
			processing = false;
		}
	}
</script>

<svelte:head>
	<title>{m['contact.title']?.() || 'Hubungi Kami'} | PPID Provinsi Sulawesi Selatan</title>
</svelte:head>

<NotificationDialog
	bind:show={status.show}
	theme={status.type}
	title={status.type === 'success' ? 'Berhasil' : 'Gagal'}
	description={status.msg}
/>

<main
	class="flex min-h-[calc(100vh-80px)] flex-col justify-center bg-gray-50 py-4 font-['Plus_Jakarta_Sans'] lg:py-0 dark:bg-slate-900"
>
	<div class="container mx-auto h-full px-4 lg:max-w-7xl">
		<header class="mb-4 pt-2 lg:mb-6">
			<nav class="mb-2 flex text-sm font-medium text-gray-500" aria-label="Breadcrumb">
				<ol class="inline-flex items-center space-x-1 md:space-x-2">
					<li class="inline-flex items-center">
						<a href="/" class="flex items-center gap-1 transition-colors hover:text-ppid-accent">
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
								<path
									d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
								/>
							</svg>
							{m['common.home']?.() || 'Beranda'}
						</a>
					</li>
					<li class="flex items-center gap-1 md:gap-2">
						<span class="text-gray-400">/</span>
						<span class="font-bold text-ppid-primary dark:text-white" aria-current="page">
							{m['contact.subtitle']?.() || 'Hubungi Kami'}
						</span>
					</li>
				</ol>
			</nav>
			<h1
				class="text-2xl font-extrabold tracking-tight text-ppid-primary md:text-3xl dark:text-white"
			>
				{m['contact.title']?.() || 'Kontak Layanan'}
			</h1>
		</header>

		<div class="mb-12 grid h-auto gap-4 lg:h-162.5 lg:grid-cols-12 lg:gap-8">
			<div class="flex flex-col gap-4 lg:col-span-4">
				<section
					class="shrink-0 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="space-y-5">
						<div class="group flex items-center gap-4">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-ppid-primary/10 text-ppid-primary transition-all group-hover:bg-ppid-primary group-hover:text-white dark:text-white"
							>
								<svg
									class="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									/>
								</svg>
							</div>
							<div>
								<p class="text-[10px] font-black tracking-widest text-gray-500 uppercase">
									{m['contact.phone']?.() || 'Telepon'}
								</p>
								<a
									href="tel:0411453192"
									class="text-base font-bold text-ppid-primary hover:underline dark:text-white"
									>(0411) 453192</a
								>
							</div>
						</div>

						<div class="group flex items-center gap-4">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-ppid-primary/10 text-ppid-primary transition-all group-hover:bg-ppid-primary group-hover:text-white dark:text-white"
							>
								<svg
									class="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<div class="overflow-hidden">
								<p class="text-[10px] font-black tracking-widest text-gray-500 uppercase">Email</p>
								<a
									href="mailto:ppid@sulawesiprov.go.id"
									class="block truncate text-base font-bold text-ppid-primary hover:underline dark:text-white"
									>ppid@sulawesiprov.go.id</a
								>
							</div>
						</div>

						<div class="group flex items-start gap-4">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ppid-primary/10 text-ppid-primary transition-all group-hover:bg-ppid-primary group-hover:text-white dark:text-white"
							>
								<svg
									class="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</div>
							<div>
								<p class="text-[10px] font-black tracking-widest text-gray-500 uppercase">
									{m['contact.address']?.() || 'Alamat'}
								</p>
								<p class="text-sm leading-relaxed font-medium text-ppid-primary dark:text-white">
									Jl. Urip Sumoharjo No. 269, Makassar, Sulawesi Selatan, 90231
								</p>
							</div>
						</div>
					</div>
				</section>

				<div
					class="min-h-62.5 grow overflow-hidden rounded-xl border border-gray-200 bg-gray-200 shadow-sm dark:border-slate-700"
				>
					<iframe
						title="Lokasi Kantor PPID Provinsi Sulawesi Selatan"
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.8123!2d119.444!3d-5.14!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMDgnMjQuMCJTIDExOcKwMjYnMzguNCJF!5e0!3m2!1sid!2sid!4v1620000000000"
						width="100%"
						height="100%"
						style="border:0;"
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"
					>
					</iframe>
				</div>
			</div>

			<section class="lg:col-span-8">
				<div
					class="flex h-full flex-col justify-between rounded-xl border-t-4 border-ppid-accent bg-white p-6 shadow-xl lg:p-10 dark:bg-slate-800"
				>
					<div>
						<h2 class="mb-1 text-xl font-black text-ppid-primary dark:text-white">
							{m['contact.form_title']()}
						</h2>
						<p class="mb-8 text-sm font-medium text-gray-500 dark:text-gray-400">
							{m['contact.form_desc']()}
						</p>

						<form onsubmit={handleContactSubmit} class="space-y-5">
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div class="space-y-1.5">
									<label
										for="name"
										class="text-xs font-black tracking-widest text-slate-500 uppercase dark:text-slate-300"
									>
										{m['contact.name_label']() || 'Nama Lengkap'}
									</label>
									<input
										type="text"
										id="name"
										bind:value={formData.name}
										required
										placeholder={m['contact.name_placeholder']?.() || 'Contoh: Ahmad Sulaiman'}
										class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-bold transition-all focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
									/>
								</div>
								<div class="space-y-1.5">
									<label
										for="phone"
										class="text-xs font-black tracking-widest text-slate-500 uppercase dark:text-slate-300"
									>
										{m['contact.phone_label']?.() || 'Nomor WhatsApp'}
									</label>
									<input
										type="tel"
										id="phone"
										bind:value={formData.phone}
										required
										placeholder={m['contact.phone_placeholder']?.() || 'Contoh: 08123456789'}
										class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-bold transition-all focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
									/>
								</div>
							</div>

							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div class="space-y-1.5">
									<label
										for="email"
										class="text-xs font-black tracking-widest text-slate-500 uppercase dark:text-slate-300"
									>
										Email
									</label>
									<input
										type="email"
										id="email"
										bind:value={formData.email}
										required
										placeholder={m['contact.email_placeholder']?.() || 'email@contoh.com'}
										class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-bold transition-all focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
									/>
								</div>
								<div class="space-y-1.5">
									<label
										for="subject"
										class="text-xs font-black tracking-widest text-slate-500 uppercase dark:text-slate-300"
									>
										{m['contact.subject_label']?.() || 'Subjek Pesan'}
									</label>
									<select
										id="subject"
										bind:value={formData.subject}
										required
										class="w-full cursor-pointer rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-bold transition-all focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
									>
										<option value="" disabled selected
											>{m['contact.select_topic']?.() || '--- Pilih Topik ---'}</option
										>
										<option value="permohonan">Permohonan Informasi</option>
										<option value="pengaduan">Pengaduan Layanan</option>
										<option value="saran">Kritik & Saran</option>
									</select>
								</div>
							</div>

							<div class="space-y-1.5">
								<label
									for="message"
									class="text-xs font-black tracking-widest text-slate-500 uppercase dark:text-slate-300"
								>
									{m['contact.message_label']?.() || 'Isi Pesan'}
								</label>
								<textarea
									id="message"
									bind:value={formData.message}
									required
									placeholder={m['contact.message_placeholder']?.() ||
										'Tuliskan pesan Anda secara detail di sini...'}
									class="h-32 w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-bold transition-all focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
								></textarea>
							</div>

							<div class="pt-4">
								<button
									type="submit"
									disabled={processing}
									class="flex w-full items-center justify-center gap-3 rounded-xl bg-ppid-primary px-8 py-4 text-sm font-black tracking-widest text-white uppercase shadow-lg shadow-ppid-primary/20 transition-all hover:bg-ppid-accent hover:shadow-ppid-accent/30 disabled:opacity-50"
								>
									{#if processing}
										<div
											class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
										></div>
										Memproses...
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
										{m['contact.submit_btn']?.() || 'Kirim Sekarang'}
									{/if}
								</button>
							</div>
						</form>
					</div>

					<div class="mt-8 border-t border-gray-100 pt-6 dark:border-slate-700">
						<p class="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
							{m['contact.footer_note']?.() ||
								'Khusus untuk permohonan informasi resmi, silakan gunakan'}
							<a
								href="/layanan/permohonan-informasi"
								class="font-black text-ppid-primary underline hover:text-ppid-accent dark:text-white"
							>
								{m['contact.footer_link']?.() || 'Formulir Permohonan'}
							</a>.
						</p>
					</div>
				</div>
			</section>
		</div>
	</div>
</main>
