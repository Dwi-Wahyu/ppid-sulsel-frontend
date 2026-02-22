<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import SearchableSelect from '$lib/components/SearchableSelect.svelte';
	import SuccessModal from '$lib/components/SuccessModal.svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import * as m from '$lib/paraglide/messages.js';

	// Interfaces
	interface Domisili {
		id: string;
		nama_daerah: string;
	}

	interface Pekerjaan {
		id: string;
		nama_pekerjaan: string;
	}

	interface BentukInformasi {
		id: string;
		judul: string;
	}

	interface FormData {
		nama: string;
		nik: string;
		email: string;
		no_hp: string;
		pekerjaan_id: string;
		domisili_id: string;
		alamat: string;
		foto_ktp: File | null;
		dokumen_pendukung: File | null;
		nmr_pengesahan: string;
		tujuan: string;
		rincian: string;
		id_bentuk_informasi: string;
		contoh_informasi: string;
	}

	// Helper function for title case
	function toTitleCase(str: string) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	// State
	let isInstansi = $state(false);
	let showSuccessModal = $state(false);
	let isSubmitting = $state(false);
	let honeyPot = $state(''); // Honeypot field
	let formData = $state<FormData>({
		nama: '',
		nik: '',
		email: '',
		no_hp: '',
		pekerjaan_id: '',
		domisili_id: '',
		alamat: '',
		foto_ktp: null,
		dokumen_pendukung: null,
		nmr_pengesahan: '',
		tujuan: '',
		rincian: '',
		id_bentuk_informasi: '',
		contoh_informasi: ''
	});

	// Data fetching
	let masterPekerjaan = $state<Pekerjaan[]>([]);
	let masterDomisili = $state<Domisili[]>([]);
	let bentukInformasis = $state<BentukInformasi[]>([]);

	onMount(async () => {
		try {
			const [resDomisili, resPekerjaan, resBentukInfo] = await Promise.all([
				fetch(`${PUBLIC_API_URL}/public/domisili`),
				fetch(`${PUBLIC_API_URL}/public/pekerjaan`),
				fetch(`${PUBLIC_API_URL}/public/bentuk-informasi`)
			]);

			const jsonDomisili = await resDomisili.json();
			const jsonPekerjaan = await resPekerjaan.json();
			const jsonBentukInfo = await resBentukInfo.json();

			if (jsonDomisili.data) {
				masterDomisili = jsonDomisili.data.map((item: any) => ({
					id: String(item.id),
					nama_daerah: toTitleCase(item.nama_daerah)
				}));
			}

			if (jsonPekerjaan.data) {
				masterPekerjaan = jsonPekerjaan.data.map((item: any) => ({
					id: String(item.id),
					nama_pekerjaan: item.nama_pekerjaan
				}));
			}

			if (jsonBentukInfo.data) {
				bentukInformasis = jsonBentukInfo.data.map((item: any) => ({
					id: String(item.id),
					judul: item.judul
				}));
			}
		} catch (error) {
			console.error('Gagal mengambil data master:', error);
		}
	});

	// File upload handlers
	function handleFileUpload(e: Event, fieldName: keyof FormData) {
		const target = e.target as HTMLInputElement;
		const file = target?.files?.[0];
		if (file) {
			// @ts-ignore - dynamic assignment for file
			formData[fieldName] = file;
		}
	}

	// NIK validation
	function validateNik(e: Event) {
		const target = e.target as HTMLInputElement;
		const value = target.value.replace(/\D/g, '');
		formData.nik = value.substring(0, 16);
	}

	// Form submission
	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		// Honeypot check
		if (honeyPot) {
			console.warn('Bot detected');
			return;
		}

		// Validate NIK
		if (formData.nik.length !== 16) {
			alert('NIK harus 16 digit angka!');
			return;
		}

		// Validate file upload
		if (!formData.foto_ktp) {
			alert('Foto KTP wajib diupload!');
			return;
		}

		isSubmitting = true;

		try {
			const data = new FormData();

			// Append simple fields
			data.append('nama', formData.nama);
			data.append('nik', formData.nik);
			data.append('email', formData.email);
			data.append('no_hp', formData.no_hp);
			data.append('pekerjaan_id', formData.pekerjaan_id);
			data.append('domisili_id', formData.domisili_id);
			data.append('alamat', formData.alamat);
			data.append('tujuan', formData.tujuan);
			data.append('rincian', formData.rincian);
			data.append('id_bentuk_informasi', formData.id_bentuk_informasi);

			// Optional fields
			if (formData.nmr_pengesahan) data.append('nmr_pengesahan', formData.nmr_pengesahan);
			if (formData.contoh_informasi) data.append('contoh_informasi', formData.contoh_informasi);

			// Files
			if (formData.foto_ktp) data.append('foto_ktp', formData.foto_ktp);
			if (formData.dokumen_pendukung) data.append('dokumen_pendukung', formData.dokumen_pendukung);

			// Honeypot field (should be empty, but sending key for backend check if needed)
			data.append('website', honeyPot);

			const res = await fetch(`${PUBLIC_API_URL}/public/permohonan-informasi`, {
				method: 'POST',
				headers: {
					Accept: 'application/json'
				},
				body: data
			});

			const json = await res.json();

			if (!res.ok) {
				if (res.status === 422) {
					// Validation error
					const errorMsg = Object.values(json.errors || {})
						.flat()
						.join('\n');
					alert(`Gagal valiasi:\n${errorMsg}`);
				} else {
					throw new Error(json.message || 'Terjadi kesalahan pada server');
				}
				return;
			}

			// Show success modal
			showSuccessModal = true;

			// Reset form after short delay
			setTimeout(() => {
				resetForm();
			}, 2000);
		} catch (error: any) {
			console.error('Submission error:', error);
			alert(error.message || 'Gagal mengirim permohonan. Silakan coba lagi.');
		} finally {
			isSubmitting = false;
		}
	}

	function resetForm() {
		formData = {
			nama: '',
			nik: '',
			email: '',
			no_hp: '',
			pekerjaan_id: '',
			domisili_id: '',
			alamat: '',
			foto_ktp: null,
			dokumen_pendukung: null,
			nmr_pengesahan: '',
			tujuan: '',
			rincian: '',
			id_bentuk_informasi: '',
			contoh_informasi: ''
		};
		isInstansi = false;
		honeyPot = '';
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
				{ label: 'layanan.services' },
				{ label: 'layanan_pages.permohonan_title' }
			]}
		/>

		<div class="mt-4 flex items-end justify-between">
			<PageTitle
				title={m['layanan_pages.permohonan_title']()}
				subtitle={m['layanan_pages.permohonan_subtitle']()}
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
		<div class="mx-auto max-w-5xl">
			<!-- Form Container -->
			<div
				class="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-10 dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="mb-10 text-center">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ppid-primary/5 text-ppid-primary dark:text-white"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
							<polyline points="14 2 14 8 20 8" />
							<line x1="16" x2="8" y1="13" y2="13" />
							<line x1="16" x2="8" y1="17" y2="17" />
							<polyline points="10 9 9 9 8 9" />
						</svg>
					</div>
					<h2 class="mb-2 text-2xl font-bold text-ppid-primary dark:text-white">
						{m['layanan_pages.form_title']()}
					</h2>
					<p class="text-gray-600 dark:text-gray-300">{m['layanan_pages.form_desc']()}</p>
				</div>

				<form onsubmit={handleSubmit} class="space-y-8" id="permohonanForm">
					<!-- Honeypot Field -->
					<input
						type="text"
						name="website"
						class="hidden"
						bind:value={honeyPot}
						autocomplete="off"
					/>

					<!-- Section 1: Data Pribadi -->
					<div
						class="space-y-6 rounded-2xl border border-gray-100 bg-linear-to-br from-white to-gray-50/50 p-6 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800/50"
					>
						<h3
							class="flex items-center gap-3 border-b-2 border-ppid-primary/20 pb-4 text-xl font-bold text-ppid-primary dark:text-white"
						>
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-ppid-primary to-ppid-accent text-base font-bold text-white shadow-lg"
							>
								1
							</div>
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
										<circle cx="12" cy="7" r="4"></circle>
									</svg>
									{m['layanan_pages.personal_data']()}
								</div>
								<p class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
									{m['layanan_pages.personal_data_desc']()}
								</p>
							</div>
						</h3>

						<!-- Row 1: Nama & NIK -->
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									{m['form.fullname']()} <span class="text-red-500">*</span>

									<input
										type="text"
										bind:value={formData.nama}
										placeholder={m['form.fullname_placeholder']()}
										class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
										required
									/>
								</label>
							</div>

							<div class="space-y-2">
								<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									{m['form.nik']()} <span class="text-red-500">*</span>

									<input
										type="text"
										bind:value={formData.nik}
										oninput={validateNik}
										placeholder={m['form.nik_placeholder']()}
										maxlength="16"
										class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
										required
									/>
								</label>
								<p class="mt-1 text-xs text-gray-500">{m['form.nik_error']()}</p>
							</div>
						</div>

						<!-- Row 2: Email & No. HP -->
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									{m['contact.email']()} <span class="text-red-500">*</span>

									<input
										type="email"
										bind:value={formData.email}
										placeholder="contoh@email.com"
										class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
										required
									/>
								</label>
							</div>

							<div class="space-y-2">
								<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									{m['contact.phone']()} <span class="text-red-500">*</span>

									<input
										type="text"
										bind:value={formData.no_hp}
										placeholder="08xxxxxxxxxx"
										class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
										required
									/>
								</label>
							</div>
						</div>

						<!-- Row 3: Pekerjaan & Domisili -->
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									{m['form.job']()} <span class="text-red-500">*</span>

									<SearchableSelect
										options={masterPekerjaan}
										bind:value={formData.pekerjaan_id}
										name="pekerjaan_id"
										placeholder={m['form.job_placeholder']()}
										idKey="id"
										labelKey="nama_pekerjaan"
										required={true}
									/>
								</label>
							</div>

							<div class="space-y-2">
								<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									{m['form.domicile']()} <span class="text-red-500">*</span>

									<SearchableSelect
										options={masterDomisili}
										bind:value={formData.domisili_id}
										name="domisili_id"
										placeholder={m['form.domicile_placeholder']()}
										idKey="id"
										labelKey="nama_daerah"
										required={true}
									/>
								</label>
								<p class="mt-1 text-xs text-gray-500">{m['form.domicile_hint']()}</p>
							</div>
						</div>

						<!-- Row 4: Alamat -->
						<div class="space-y-2">
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
								{m['contact.address']()} <span class="text-red-500">*</span>

								<input
									type="text"
									bind:value={formData.alamat}
									placeholder={m['form.address_placeholder']()}
									class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
									required
								/>
							</label>
						</div>

						<!-- Row 5: Upload KTP -->
						<div class="space-y-2">
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
								{m['form.upload_ktp']()} <span class="text-red-500">*</span>

								<input
									type="file"
									onchange={(e) => handleFileUpload(e, 'foto_ktp')}
									accept="image/jpeg,image/jpg,image/png"
									class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-ppid-primary file:px-6 file:py-3 file:text-sm file:font-semibold file:text-white hover:file:bg-ppid-primary/90 focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800 dark:text-gray-300"
									required
								/>
							</label>

							<p class="mt-1 text-xs text-gray-500">
								<i class="fas fa-info-circle mr-1"></i>
								{m['form.file_format_hint']()}
							</p>
						</div>

						<!-- Row 6: Upload Dokumen Pendukung -->
						<div class="space-y-2">
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
								{m['form.upload_supporting_doc']()}

								<input
									type="file"
									onchange={(e) => handleFileUpload(e, 'dokumen_pendukung')}
									accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
									class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-linear-to-r file:from-ppid-primary/90 file:to-ppid-primary file:px-6 file:py-3 file:text-sm file:font-semibold file:text-white hover:file:from-ppid-primary hover:file:to-ppid-primary/90 focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800 dark:text-gray-300"
								/>
							</label>

							<p class="mt-1 text-xs leading-relaxed text-gray-500">
								{m['form.supporting_doc_hint']()}
							</p>
							<p class="mt-0.5 text-xs text-gray-400">
								{m['form.file_format_hint_2']()}
							</p>
						</div>

						<!-- Row 7: Checkbox for Instansi -->
						<div class="mt-2 border-t-2 border-gray-100 pt-6 pb-2 dark:border-slate-700">
							<div
								class="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-slate-600 dark:bg-slate-700/30"
							>
								<div class="mb-2 flex items-start">
									<input
										type="checkbox"
										id="showInstansi"
										bind:checked={isInstansi}
										class="mt-0.5 h-4 w-4 cursor-pointer rounded border-gray-300 text-ppid-primary focus:ring-ppid-primary"
									/>
									<label
										for="showInstansi"
										class="ml-3 block cursor-pointer text-sm font-semibold text-gray-800 dark:text-gray-200"
									>
										{m['form.agency_question']()}
									</label>
								</div>
								<p class="ml-7 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
									{m['form.agency_hint']()}
								</p>
							</div>
						</div>

						<!-- Row 8: Nomor Pengesahan (Conditional) -->
						{#if isInstansi}
							<div class="space-y-2">
								<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									{m['form.agency_number']()} <span class="text-red-500">*</span>

									<input
										type="text"
										bind:value={formData.nmr_pengesahan}
										placeholder={m['form.agency_number_placeholder']()}
										required={isInstansi}
										class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
									/>
								</label>
								<p class="mt-1 text-xs text-gray-500">
									{m['form.agency_number_required']()}
								</p>
							</div>
						{/if}
					</div>

					<!-- Section 2: Detail Informasi -->
					<div
						class="space-y-6 rounded-2xl border border-gray-100 bg-linear-to-br from-white to-gray-50/50 p-6 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800/50"
					>
						<h3
							class="flex items-center gap-3 border-b-2 border-ppid-primary/20 pb-4 text-xl font-bold text-ppid-primary dark:text-white"
						>
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-ppid-primary to-ppid-accent text-base font-bold text-white shadow-lg"
							>
								2
							</div>
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<circle cx="12" cy="12" r="10"></circle>
										<line x1="12" y1="16" x2="12" y2="12"></line>
										<line x1="12" y1="8" x2="12.01" y2="8"></line>
									</svg>
									{m['layanan_pages.detail_info']()}
								</div>
								<p class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
									{m['layanan_pages.detail_info_desc']()}
								</p>
							</div>
						</h3>

						<!-- Row 1: Tujuan -->
						<div class="space-y-2">
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
								{m['form.purpose']()} <span class="text-red-500">*</span>

								<input
									type="text"
									bind:value={formData.tujuan}
									placeholder={m['form.purpose_placeholder']()}
									class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
									required
								/>
							</label>
						</div>

						<!-- Row 2: Rincian -->
						<div class="space-y-2">
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
								{m['form.details']()} <span class="text-red-500">*</span>

								<textarea
									bind:value={formData.rincian}
									rows="5"
									placeholder={m['form.details_placeholder']()}
									class="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
									required
								></textarea>
							</label>
							<p class="mt-1 text-xs text-gray-500">
								{m['form.details_hint']()}
							</p>
						</div>

						<!-- Row 3: Format & Contoh -->
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									{m['form.format']()} <span class="text-red-500">*</span>

									<select
										bind:value={formData.id_bentuk_informasi}
										class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
										required
									>
										<option value="">{m['form.format_placeholder']()}</option>
										{#each bentukInformasis as bentuk}
											<option value={bentuk.id}>{bentuk.judul}</option>
										{/each}
									</select>
								</label>
							</div>

							<div class="space-y-2">
								<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									{m['form.example_link']()}

									<input
										type="text"
										bind:value={formData.contoh_informasi}
										placeholder="https://contoh-link-informasi.com"
										class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
									/>
								</label>
								<p class="mt-1 text-xs text-gray-500">
									{m['form.example_link_hint']()}
								</p>
							</div>
						</div>
					</div>

					<!-- Submit Buttons -->
					<div class="mt-2 pt-8">
						<div class="flex flex-col justify-end gap-4 sm:flex-row">
							<button
								type="reset"
								onclick={resetForm}
								class="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-200"
								disabled={isSubmitting}
							>
								<i class="fas fa-redo"></i>
								{m['form.reset']()}
							</button>
							<button
								type="submit"
								class="flex transform items-center justify-center gap-2 rounded-lg bg-ppid-primary px-8 py-3.5 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-ppid-primary/90 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:translate-y-0"
								disabled={isSubmitting}
							>
								{#if isSubmitting}
									<svg
										class="mr-2 h-5 w-5 animate-spin text-white"
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
									{m['form.submitting']()}
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<line x1="22" x2="11" y1="2" y2="13" />
										<polygon points="22 2 15 22 11 13 2 9 22 2" />
									</svg>
									{m['form.submit']()}
								{/if}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</main>

<SuccessModal bind:isOpen={showSuccessModal} />

<Footer />
