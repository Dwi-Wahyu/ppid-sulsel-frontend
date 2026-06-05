<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import SearchableSelect from '$lib/components/SearchableSelect.svelte';
	import SuccessModal from '$lib/components/SuccessModal.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import { superForm } from 'sveltekit-superforms/client';
	import { untrack } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { form, errors, enhance, delayed, message, validate } = superForm(
		untrack(() => data.form),
		{
			taintedMessage: null,
			scrollToError: 'smooth',
			onResult: ({ result }) => {
				if (result.type === 'success') {
					showSuccessModal = true;
					// Reset files manually since superforms doesn't clear file inputs automatically
					const fileInputs = document.querySelectorAll('input[type="file"]');
					fileInputs.forEach((input) => {
						(input as HTMLInputElement).value = '';
					});
					isInstansi = false;
				}
			}
		}
	);

	let isInstansi = $state(false);
	let showSuccessModal = $state(false);

	// Helper function for title case
	function toTitleCase(str: string) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	// NIK validation wrapper
	function handleNikInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const value = target.value.replace(/\D/g, '');
		$form.nik = value.substring(0, 16);
		validate('nik');
	}

	function resetForm() {
		// Native reset on the form triggers superforms reset
		const formEl = document.getElementById('permohonanForm') as HTMLFormElement;
		if (formEl) formEl.reset();
	}
</script>

<!-- Breadcrumb + Title Section -->
<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 text-gray-900 dark:bg-slate-800 dark:text-white"
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
<main class="bg-gray-50 pt-6 pb-12 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-5xl">
			<!-- Form Container -->
			<div class="relative">
				{#if $message}
					<div class="mb-6 rounded-lg border border-red-200 bg-red-100 p-4 text-red-700 shadow-sm">
						{$message}
					</div>
				{/if}

				<form
					method="POST"
					use:enhance
					class="space-y-8"
					id="permohonanForm"
					enctype="multipart/form-data"
				>
					<!-- Honeypot Field -->
					<input
						type="text"
						name="website"
						class="hidden"
						bind:value={$form.website}
						autocomplete="off"
					/>

					<!-- Section 1: Data Pribadi -->
					<div
						class="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-700 text-gray-900 dark:bg-slate-800 dark:text-white"
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
								<div>
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
								<label
									for="nama"
									class="block text-sm font-semibold {$errors.nama
										? 'text-red-500'
										: 'text-gray-700 dark:text-gray-300'}"
								>
									{m['form.fullname']()} <span class="text-red-500">*</span>
								</label>
								<input
									type="text"
									id="nama"
									name="nama"
									bind:value={$form.nama}
									placeholder={m['form.fullname_placeholder']()}
									class="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 text-gray-900 dark:bg-slate-800 dark:text-white {$errors.nama
										? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
										: 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
									aria-invalid={$errors.nama ? 'true' : undefined}
								/>
								{#if $errors.nama}<span class="text-xs text-red-500">{$errors.nama}</span>{/if}
							</div>

							<div class="space-y-2">
								<label
									for="nik"
									class="block text-sm font-semibold {$errors.nik
										? 'text-red-500'
										: 'text-gray-700 dark:text-gray-300'}"
								>
									{m['form.nik']()} <span class="text-red-500">*</span>
								</label>
								<input
									type="text"
									id="nik"
									name="nik"
									bind:value={$form.nik}
									oninput={handleNikInput}
									placeholder={m['form.nik_placeholder']()}
									maxlength="16"
									class="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 text-gray-900 dark:bg-slate-800 dark:text-white {$errors.nik
										? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
										: 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
									aria-invalid={$errors.nik ? 'true' : undefined}
								/>
								{#if $errors.nik}
									<span class="text-xs text-red-500">{$errors.nik}</span>
								{:else}
									<span class="text-xs text-gray-500">{m['form.nik_error']()}</span>
								{/if}
							</div>
						</div>

						<!-- Row 2: Email & No. HP -->
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<label
									for="email"
									class="block text-sm font-semibold {$errors.email
										? 'text-red-500'
										: 'text-gray-700 dark:text-gray-300'}"
								>
									{m['contact.email']()} <span class="text-red-500">*</span>
								</label>
								<input
									type="email"
									id="email"
									name="email"
									bind:value={$form.email}
									placeholder="contoh@email.com"
									class="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 text-gray-900 dark:bg-slate-800 dark:text-white {$errors.email
										? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
										: 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
									aria-invalid={$errors.email ? 'true' : undefined}
								/>
								{#if $errors.email}<span class="text-xs text-red-500">{$errors.email}</span>{/if}
							</div>

							<div class="space-y-2">
								<label
									for="no_hp"
									class="block text-sm font-semibold {$errors.no_hp
										? 'text-red-500'
										: 'text-gray-700 dark:text-gray-300'}"
								>
									{m['contact.phone']()} <span class="text-red-500">*</span>
								</label>
								<input
									type="tel"
									id="no_hp"
									name="no_hp"
									bind:value={$form.no_hp}
									placeholder="08xxxxxxxxxx"
									class="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 text-gray-900 dark:bg-slate-800 dark:text-white {$errors.no_hp
										? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
										: 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
									aria-invalid={$errors.no_hp ? 'true' : undefined}
								/>
								{#if $errors.no_hp}<span class="text-xs text-red-500">{$errors.no_hp}</span>{/if}
							</div>
						</div>

						<!-- Row 3: Pekerjaan & Domisili -->
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<label
									for="pekerjaan_id"
									class="block text-sm font-semibold {$errors.pekerjaan_id
										? 'text-red-500'
										: 'text-gray-700 dark:text-gray-300'}"
								>
									{m['form.job']()} <span class="text-red-500">*</span>
								</label>
								<SearchableSelect
									options={data.pekerjaanOptions}
									bind:value={$form.pekerjaan_id}
									name="pekerjaan_id"
									placeholder={m['form.job_placeholder']()}
									idKey="value"
									labelKey="label"
									isInvalid={!!$errors.pekerjaan_id}
								/>
								{#if $errors.pekerjaan_id}<span class="text-xs text-red-500"
										>{$errors.pekerjaan_id}</span
									>{/if}
							</div>

							<div class="space-y-2">
								<label
									for="domisili_id"
									class="block text-sm font-semibold {$errors.domisili_id
										? 'text-red-500'
										: 'text-gray-700 dark:text-gray-300'}"
								>
									{m['form.domicile']()} <span class="text-red-500">*</span>
								</label>
								<SearchableSelect
									options={data.domisiliOptions}
									bind:value={$form.domisili_id}
									name="domisili_id"
									placeholder={m['form.domicile_placeholder']()}
									idKey="value"
									labelKey="label"
									isInvalid={!!$errors.domisili_id}
								/>
								{#if $errors.domisili_id}
									<span class="text-xs text-red-500">{$errors.domisili_id}</span>
								{:else}
									<span class="text-xs text-gray-500">{m['form.domicile_hint']()}</span>
								{/if}
							</div>
						</div>

						<!-- Row 4: Alamat -->
						<div class="space-y-2">
							<label
								for="alamat"
								class="block text-sm font-semibold {$errors.alamat
									? 'text-red-500'
									: 'text-gray-700 dark:text-gray-300'}"
							>
								{m['contact.address']()} <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="alamat"
								name="alamat"
								bind:value={$form.alamat}
								placeholder={m['form.address_placeholder']()}
								class="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 text-gray-900 dark:bg-slate-800 dark:text-white {$errors.alamat
									? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
									: 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
								aria-invalid={$errors.alamat ? 'true' : undefined}
							/>
							{#if $errors.alamat}<span class="text-xs text-red-500">{$errors.alamat}</span>{/if}
						</div>

						<!-- Row 5: Upload KTP -->
						<div class="space-y-2">
							<label
								for="foto_ktp"
								class="block text-sm font-semibold {$errors.foto_ktp
									? 'text-red-500'
									: 'text-gray-700 dark:text-gray-300'}"
							>
								{m['form.upload_ktp']()} <span class="text-red-500">*</span>
							</label>
							<input
								type="file"
								id="foto_ktp"
								name="foto_ktp"
								accept="image/jpeg,image/jpg,image/png"
								class="block w-full cursor-pointer rounded-lg border bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-ppid-primary file:px-6 file:py-3 file:text-sm file:font-semibold file:text-white hover:file:bg-ppid-primary/90 focus:ring-2 text-gray-900 dark:bg-slate-800 dark:text-white dark:text-gray-300 {$errors.foto_ktp
									? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
									: 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
							/>
							{#if $errors.foto_ktp}
								<span class="text-xs text-red-500">{$errors.foto_ktp}</span>
							{:else}
								<p class="text-xs text-gray-500">
									<i class="fas fa-info-circle mr-1"></i>
									{m['form.file_format_hint']()}
								</p>
							{/if}
						</div>

						<!-- Row 6: Upload Dokumen Pendukung -->
						<div class="space-y-2">
							<label
								for="dokumen_pendukung"
								class="block text-sm font-semibold text-gray-700 dark:text-gray-300"
							>
								{m['form.upload_supporting_doc']()}
							</label>
							<input
								type="file"
								id="dokumen_pendukung"
								name="dokumen_pendukung"
								accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
								class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-linear-to-r file:from-ppid-primary/90 file:to-ppid-primary file:px-6 file:py-3 file:text-sm file:font-semibold file:text-white hover:file:from-ppid-primary hover:file:to-ppid-primary/90 focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary text-gray-900 dark:bg-slate-800 dark:text-white dark:text-gray-300"
							/>
							<p class="text-xs leading-relaxed text-gray-500">
								{m['form.supporting_doc_hint']()}
							</p>
							<p class="text-xs text-gray-400">
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
								<label
									for="nmr_pengesahan"
									class="block text-sm font-semibold {$errors.nmr_pengesahan
										? 'text-red-500'
										: 'text-gray-700 dark:text-gray-300'}"
								>
									{m['form.agency_number']()} <span class="text-red-500">*</span>
								</label>
								<input
									type="text"
									id="nmr_pengesahan"
									name="nmr_pengesahan"
									bind:value={$form.nmr_pengesahan}
									placeholder={m['form.agency_number_placeholder']()}
									required={isInstansi}
									class="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 text-gray-900 dark:bg-slate-800 dark:text-white {$errors.nmr_pengesahan
										? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
										: 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
									aria-invalid={$errors.nmr_pengesahan ? 'true' : undefined}
								/>
								{#if $errors.nmr_pengesahan}
									<span class="text-xs text-red-500">{$errors.nmr_pengesahan}</span>
								{:else}
									<span class="text-xs text-gray-500">{m['form.agency_number_required']()}</span>
								{/if}
							</div>
						{/if}
					</div>

					<!-- Section 2: Detail Informasi -->
					<div
						class="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-700 text-gray-900 dark:bg-slate-800 dark:text-white"
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
								<div>
									{m['layanan_pages.detail_info']()}
								</div>
								<p class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
									{m['layanan_pages.detail_info_desc']()}
								</p>
							</div>
						</h3>

						<!-- Row 1: Tujuan -->
						<div class="space-y-2">
							<label
								for="tujuan"
								class="block text-sm font-semibold {$errors.tujuan
									? 'text-red-500'
									: 'text-gray-700 dark:text-gray-300'}"
							>
								{m['form.purpose']()} <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="tujuan"
								name="tujuan"
								bind:value={$form.tujuan}
								placeholder={m['form.purpose_placeholder']()}
								class="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 text-gray-900 dark:bg-slate-800 dark:text-white {$errors.tujuan
									? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
									: 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
								aria-invalid={$errors.tujuan ? 'true' : undefined}
							/>
							{#if $errors.tujuan}<span class="text-xs text-red-500">{$errors.tujuan}</span>{/if}
						</div>

						<!-- Row 2: Rincian -->
						<div class="space-y-2">
							<label
								for="rincian"
								class="block text-sm font-semibold {$errors.rincian
									? 'text-red-500'
									: 'text-gray-700 dark:text-gray-300'}"
							>
								{m['form.details']()} <span class="text-red-500">*</span>
							</label>
							<textarea
								id="rincian"
								name="rincian"
								bind:value={$form.rincian}
								rows="5"
								placeholder={m['form.details_placeholder']()}
								class="w-full resize-none rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 text-gray-900 dark:bg-slate-800 dark:text-white {$errors.rincian
									? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
									: 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
								aria-invalid={$errors.rincian ? 'true' : undefined}
							></textarea>
							{#if $errors.rincian}
								<span class="text-xs text-red-500">{$errors.rincian}</span>
							{:else}
								<p class="mt-1 text-xs text-gray-500">{m['form.details_hint']()}</p>
							{/if}
						</div>

						<!-- Row 3: Format & Contoh -->
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<label
									for="id_bentuk_informasi"
									class="block text-sm font-semibold {$errors.id_bentuk_informasi
										? 'text-red-500'
										: 'text-gray-700 dark:text-gray-300'}"
								>
									{m['form.format']()} <span class="text-red-500">*</span>
								</label>
								<select
									id="id_bentuk_informasi"
									name="id_bentuk_informasi"
									bind:value={$form.id_bentuk_informasi}
									class="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 text-gray-900 dark:bg-slate-800 dark:text-white {$errors.id_bentuk_informasi
										? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
										: 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
									aria-invalid={$errors.id_bentuk_informasi ? 'true' : undefined}
								>
									<option value="">{m['form.format_placeholder']()}</option>
									{#each data.bentukInfoOptions as bentuk}
										<option value={bentuk.value}>{bentuk.label}</option>
									{/each}
								</select>
								{#if $errors.id_bentuk_informasi}<span class="text-xs text-red-500"
										>{$errors.id_bentuk_informasi}</span
									>{/if}
							</div>

							<div class="space-y-2">
								<label
									for="contoh_informasi"
									class="block text-sm font-semibold {$errors.contoh_informasi
										? 'text-red-500'
										: 'text-gray-700 dark:text-gray-300'}"
								>
									{m['form.example_link']()}
								</label>
								<input
									type="text"
									id="contoh_informasi"
									name="contoh_informasi"
									bind:value={$form.contoh_informasi}
									placeholder="https://contoh-link-informasi.com"
									class="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 text-gray-900 dark:bg-slate-800 dark:text-white {$errors.contoh_informasi
										? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
										: 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
									aria-invalid={$errors.contoh_informasi ? 'true' : undefined}
								/>
								{#if $errors.contoh_informasi}
									<span class="text-xs text-red-500">{$errors.contoh_informasi}</span>
								{:else}
									<p class="text-xs text-gray-500">{m['form.example_link_hint']()}</p>
								{/if}
							</div>
						</div>
					</div>

					<!-- Submit Buttons -->
					<div class="flex flex-col justify-end gap-4 pt-4 sm:flex-row">
						<button
							type="submit"
							class="flex transform items-center justify-center gap-2 rounded-lg bg-ppid-primary px-8 py-3.5 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-ppid-primary/90 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:translate-y-0"
							disabled={$delayed}
						>
							{#if $delayed}
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
							{/if}
							{m['form.submit']()}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</main>

<SuccessModal bind:isOpen={showSuccessModal} />

<Footer />
