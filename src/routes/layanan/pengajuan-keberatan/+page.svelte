<script>
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import SearchableSelect from '$lib/components/SearchableSelect.svelte';
	import SuccessModal from '$lib/components/SuccessModal.svelte';
	import * as m from '$lib/paraglide/messages.js';

	// State
	let isInstansi = $state(false);
	let showSuccessModal = $state(false);
	let formData = $state({
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
		id_permohonan: '',
		alasan_keberatan: '',
		kasus_posisi: ''
	});

	// Mock data - replace with actual API calls
	const masterPekerjaan = [
		{ id: '1', nama_pekerjaan: 'PNS' },
		{ id: '2', nama_pekerjaan: 'Swasta' },
		{ id: '3', nama_pekerjaan: 'Wiraswasta' },
		{ id: '4', nama_pekerjaan: 'Mahasiswa' },
		{ id: '5', nama_pekerjaan: 'Pelajar' }
	];

	const masterDomisili = [
		{ id: '1', nama_daerah: 'Makassar' },
		{ id: '2', nama_daerah: 'Gowa' },
		{ id: '3', nama_daerah: 'Maros' },
		{ id: '4', nama_daerah: 'Takalar' },
		{ id: '5', nama_daerah: 'Pangkep' }
	];

	// File upload handlers
	function handleFileUpload(e, fieldName) {
		const file = e.target?.files?.[0];
		if (file) {
			formData[fieldName] = file;
		}
	}

	// NIK validation
	function validateNik(e) {
		const value = e.target.value.replace(/\D/g, '');
		formData.nik = value.substring(0, 16);
	}

	// Form submission
	async function handleSubmit(e) {
		e.preventDefault();

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

		// In real app, send to API
		console.log('Keberatan submitted:', formData);

		// Show success modal
		showSuccessModal = true;

		// Reset form after short delay
		setTimeout(() => {
			resetForm();
		}, 2000);
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
			id_permohonan: '',
			alasan_keberatan: '',
			kasus_posisi: ''
		};
		isInstansi = false;
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
				{ label: 'layanan.keberatan_title' }
			]}
		/>

		<div class="mt-4 flex items-end justify-between">
			<PageTitle
				title="Pengajuan Keberatan"
				subtitle="Ajukan keberatan atas permohonan informasi"
			/>
			<div class="hidden md:block">
				<div
					class="h-1.5 w-24 rounded-full bg-gradient-to-r from-ppid-primary to-ppid-accent"
				></div>
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
							<path
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					</div>
					<h2 class="mb-2 text-2xl font-bold text-ppid-primary dark:text-white">
						Form Pengajuan Keberatan
					</h2>
					<p class="text-gray-600 dark:text-gray-300">Lengkapi formulir di bawah ini</p>
				</div>

				<form onsubmit={handleSubmit} class="space-y-8" id="keberatanForm">
					<!-- Section 1: Data Pribadi -->
					<div
						class="space-y-6 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 p-6 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800/50"
					>
						<h3
							class="flex items-center gap-3 border-b-2 border-ppid-primary/20 pb-4 text-xl font-bold text-ppid-primary dark:text-white"
						>
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ppid-primary to-ppid-accent text-base font-bold text-white shadow-lg"
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
									Data Pribadi
								</div>
								<p class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
									Informasi identitas pengaju
								</p>
							</div>
						</h3>

						<!-- Same fields as Permohonan Informasi -->
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									Nama Lengkap <span class="text-red-500">*</span>
								</label>
								<input
									type="text"
									bind:value={formData.nama}
									placeholder="Masukkan nama sesuai KTP"
									class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
									required
								/>
							</div>

							<div class="space-y-2">
								<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									No. KTP (NIK) <span class="text-red-500">*</span>
								</label>
								<input
									type="text"
									bind:value={formData.nik}
									oninput={validateNik}
									placeholder="16 digit NIK"
									maxlength="16"
									class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
									required
								/>
								<p class="mt-1 text-xs text-gray-500">NIK harus 16 digit angka</p>
							</div>
						</div>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									Email <span class="text-red-500">*</span>
								</label>
								<input
									type="email"
									bind:value={formData.email}
									placeholder="contoh@email.com"
									class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
									required
								/>
							</div>

							<div class="space-y-2">
								<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									No. HP / WhatsApp <span class="text-red-500">*</span>
								</label>
								<input
									type="text"
									bind:value={formData.no_hp}
									placeholder="08xxxxxxxxxx"
									class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
									required
								/>
							</div>
						</div>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									Pekerjaan <span class="text-red-500">*</span>
								</label>
								<SearchableSelect
									options={masterPekerjaan}
									bind:value={formData.pekerjaan_id}
									name="pekerjaan_id"
									placeholder="-- Pilih Pekerjaan --"
									idKey="id"
									labelKey="nama_pekerjaan"
									required={true}
								/>
							</div>

							<div class="space-y-2">
								<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									Asal / Domisili <span class="text-red-500">*</span>
								</label>
								<SearchableSelect
									options={masterDomisili}
									bind:value={formData.domisili_id}
									name="domisili_id"
									placeholder="-- Pilih Kabupaten/Kota --"
									idKey="id"
									labelKey="nama_daerah"
									required={true}
								/>
							</div>
						</div>

						<div class="space-y-2">
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
								Alamat Lengkap <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								bind:value={formData.alamat}
								placeholder="Jl. Contoh No. 123, Kelurahan/Desa"
								class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
								required
							/>
						</div>

						<div class="space-y-2">
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
								Upload Foto KTP <span class="text-red-500">*</span>
							</label>
							<input
								type="file"
								onchange={(e) => handleFileUpload(e, 'foto_ktp')}
								accept="image/jpeg,image/jpg,image/png"
								class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-ppid-primary file:px-6 file:py-3 file:text-sm file:font-semibold file:text-white hover:file:bg-ppid-primary/90 focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800 dark:text-gray-300"
								required
							/>
							<p class="mt-1 text-xs text-gray-500">
								Format: JPG, JPEG, PNG | Maksimal ukuran: 5MB
							</p>
						</div>

						<div class="space-y-2">
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
								Upload Dokumen Pendukung
							</label>
							<input
								type="file"
								onchange={(e) => handleFileUpload(e, 'dokumen_pendukung')}
								accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
								class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-gradient-to-r file:from-ppid-primary/90 file:to-ppid-primary file:px-6 file:py-3 file:text-sm file:font-semibold file:text-white hover:file:from-ppid-primary hover:file:to-ppid-primary/90 focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800 dark:text-gray-300"
							/>
							<p class="mt-1 text-xs leading-relaxed text-gray-500">
								Bukti penolakan atau dokumen pendukung lainnya
							</p>
						</div>

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
										Mengajukan atas nama Instansi / Badan Hukum?
									</label>
								</div>
								<p class="ml-7 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
									Centang jika Anda mewakili instansi pemerintah, organisasi, atau badan hukum.
								</p>
							</div>
						</div>

						{#if isInstansi}
							<div class="space-y-2">
								<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									Nomor Pengesahan (Badan Hukum) <span class="text-red-500">*</span>
								</label>
								<input
									type="text"
									bind:value={formData.nmr_pengesahan}
									placeholder="Masukkan nomor pengesahan badan hukum"
									required={isInstansi}
									class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
								/>
							</div>
						{/if}
					</div>

					<!-- Section 2: Detail Keberatan -->
					<div
						class="space-y-6 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 p-6 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800/50"
					>
						<h3
							class="flex items-center gap-3 border-b-2 border-ppid-primary/20 pb-4 text-xl font-bold text-ppid-primary dark:text-white"
						>
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ppid-primary to-ppid-accent text-base font-bold text-white shadow-lg"
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
										<path
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
										/>
									</svg>
									Detail Keberatan
								</div>
								<p class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
									Informasi mengenai keberatan Anda
								</p>
							</div>
						</h3>

						<div class="space-y-2">
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
								Nomor Permohonan <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								bind:value={formData.id_permohonan}
								placeholder="Masukkan nomor permohonan yang diajukan keberatan"
								class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
								required
							/>
							<p class="mt-1 text-xs text-gray-500">
								Nomor permohonan informasi yang akan diajukan keberatan
							</p>
						</div>

						<div class="space-y-2">
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
								Alasan Keberatan <span class="text-red-500">*</span>
							</label>
							<textarea
								bind:value={formData.alasan_keberatan}
								rows="5"
								placeholder="Jelaskan alasan Anda mengajukan keberatan..."
								class="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
								required
							></textarea>
						</div>

						<div class="space-y-2">
							<label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
								Kasus Posisi <span class="text-red-500">*</span>
							</label>
							<textarea
								bind:value={formData.kasus_posisi}
								rows="5"
								placeholder="Jelaskan kronologi atau kasus posisi secara detail..."
								class="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
								required
							></textarea>
							<p class="mt-1 text-xs text-gray-500">
								Jelaskan kronologi kejadian atau latar belakang keberatan
							</p>
						</div>
					</div>

					<!-- Submit Buttons -->
					<div class="mt-2 pt-8">
						<div class="flex flex-col justify-end gap-4 sm:flex-row">
							<button
								type="reset"
								onclick={resetForm}
								class="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-200"
							>
								Reset Form
							</button>
							<button
								type="submit"
								class="flex transform items-center justify-center gap-2 rounded-lg bg-ppid-primary px-8 py-3.5 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-ppid-primary/90 hover:shadow-xl"
							>
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
								Kirim Keberatan
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
