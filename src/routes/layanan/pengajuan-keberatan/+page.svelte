<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import SearchableSelect from '$lib/components/SearchableSelect.svelte';
	import SuccessModal from '$lib/components/SuccessModal.svelte';
	import * as m from '$lib/paraglide/messages.js';

	// Superforms
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { untrack } from 'svelte';

	// Props dari server
	let { data }: { data: PageData } = $props();

	// Ambil daftar provinsi unik dari data domisili
	const provinsiOptions = [...new Set(data.domisiliOptions.map((item: any) => item.provinsi))].map(
		(prov) => ({ value: prov, label: prov })
	);

	// Inisialisasi Superform
	const { form, errors, enhance, delayed, message } = superForm(data.form, {
		taintedMessage: null,
		scrollToError: 'smooth',
		onResult: ({ result }) => {
			if (result.type === 'success') {
				showSuccessModal = true;
			}
		}
	});

	// Gunakan $derived untuk memfilter kota berdasarkan provinsi yang dipilih di form
	// Kita hubungkan dengan $form.state_pemohon (sesuai input hidden yang Anda miliki)
	let filteredDomisili = $derived(
		$form.state_pemohon
			? data.domisiliOptions.filter((item: any) => item.provinsi === $form.state_pemohon)
			: []
	);

	$effect(() => {
		// Kita ingin effect ini HANYA bereaksi saat provinsi (state_pemohon) berubah
		const selectedProvince = $form.state_pemohon;

		// Gunakan untrack untuk operasi pengecekan dan perubahan kota
		untrack(() => {
			if (selectedProvince) {
				// Cek apakah kota yang sekarang dipilih masih ada di dalam daftar kota provinsi baru
				const isValid = filteredDomisili.some((opt: any) => opt.value === $form.city_pemohon);

				// Jika tidak valid (atau kota belum dipilih), reset ke kosong
				if (!isValid && $form.city_pemohon !== '') {
					$form.city_pemohon = '';
				}
			}
		});
	});

	let isInstansi = $state<boolean>(false);
	let showSuccessModal = $state<boolean>(false);
</script>

<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-8">
		<Breadcrumb
			items={[
				{ label: 'breadcrumb.home', href: '/' },
				{ label: 'layanan.services' },
				{ label: 'layanan_pages.keberatan_title' }
			]}
		/>
		<div class="mt-4 flex items-end justify-between">
			<PageTitle
				title={m['layanan_pages.keberatan_title']()}
				subtitle={m['layanan_pages.keberatan_subtitle']()}
			/>
		</div>
	</div>
</div>

<main class="bg-gray-50 py-12 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-5xl">
			<div
				class="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-10 dark:border-slate-700 dark:bg-slate-800"
			>
				{#if $message}
					<div class="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
						{$message}
					</div>
				{/if}

				<form method="POST" use:enhance class="space-y-8" id="keberatanForm">
					<input type="text" name="website" class="hidden" bind:value={$form.website} />
					<input type="hidden" name="state_pemohon" bind:value={$form.state_pemohon} />

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
								{m['layanan_pages.personal_data']()}
							</div>
						</h3>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<h1 class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									{m['form.fullname']()} <span class="text-red-500">*</span>
								</h1>
								<input
									type="text"
									name="nama_pemohon"
									bind:value={$form.nama_pemohon}
									placeholder={m['form.fullname_placeholder']()}
									class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
									aria-invalid={$errors.nama_pemohon ? 'true' : undefined}
								/>
								{#if $errors.nama_pemohon}<span class="text-xs text-red-500"
										>{$errors.nama_pemohon}</span
									>{/if}
							</div>

							<div class="space-y-2">
								<h1 class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									{m['contact.phone']()} <span class="text-red-500">*</span>
								</h1>
								<input
									type="text"
									name="no_telp_pemohon"
									bind:value={$form.no_telp_pemohon}
									placeholder="08xxxxxxxxxx"
									class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
								/>
								{#if $errors.no_telp_pemohon}<span class="text-xs text-red-500"
										>{$errors.no_telp_pemohon}</span
									>{/if}
							</div>
						</div>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<h1 class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									{m['contact.email']()} <span class="text-red-500">*</span>
								</h1>
								<input
									type="email"
									name="email_pemohon"
									bind:value={$form.email_pemohon}
									placeholder="contoh@email.com"
									class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
								/>
								{#if $errors.email_pemohon}<span class="text-xs text-red-500"
										>{$errors.email_pemohon}</span
									>{/if}
							</div>

							<div class="space-y-2">
								<h1 class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									{m['form.job']()} <span class="text-red-500">*</span>
								</h1>
								<SearchableSelect
									options={data.pekerjaanOptions}
									bind:value={$form.pekerjaan_pemohon}
									name="pekerjaan_pemohon"
									placeholder={m['form.job_placeholder']()}
									idKey="value"
									labelKey="label"
								/>
								{#if $errors.pekerjaan_pemohon}<span class="text-xs text-red-500"
										>{$errors.pekerjaan_pemohon}</span
									>{/if}
							</div>
						</div>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<h1 class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									Provinsi <span class="text-red-500">*</span>
								</h1>
								<SearchableSelect
									options={provinsiOptions}
									bind:value={$form.state_pemohon}
									name="state_pemohon"
									placeholder="Pilih Provinsi..."
									idKey="value"
									labelKey="label"
								/>
								{#if $errors.state_pemohon}<span class="text-xs text-red-500"
										>{$errors.state_pemohon}</span
									>{/if}
							</div>

							<div class="space-y-2">
								<h1 class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									{m['form.domicile']()} (Kab/Kota) <span class="text-red-500">*</span>
								</h1>
								<SearchableSelect
									options={filteredDomisili}
									bind:value={$form.city_pemohon}
									name="city_pemohon"
									placeholder={$form.state_pemohon
										? m['form.domicile_placeholder']()
										: 'Pilih provinsi terlebih dahulu'}
									idKey="value"
									labelKey="label"
								/>
								{#if $errors.city_pemohon}<span class="text-xs text-red-500"
										>{$errors.city_pemohon}</span
									>{/if}
							</div>
						</div>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<h1 class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									{m['contact.address']()} <span class="text-red-500">*</span>
								</h1>
								<input
									type="text"
									name="alamat_pemohon"
									bind:value={$form.alamat_pemohon}
									placeholder={m['form.address_placeholder']()}
									class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
								/>
								{#if $errors.alamat_pemohon}<span class="text-xs text-red-500"
										>{$errors.alamat_pemohon}</span
									>{/if}
							</div>
						</div>

						<div class="mt-2 border-t-2 border-gray-100 pt-6 pb-2 dark:border-slate-700">
							<div
								class="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-slate-600 dark:bg-slate-700/30"
							>
								<div class="mb-2 flex items-start">
									<input
										type="checkbox"
										id="isKuasa"
										bind:checked={isInstansi}
										class="mt-0.5 h-4 w-4 cursor-pointer rounded border-gray-300 text-ppid-primary focus:ring-ppid-primary"
									/>
									<label
										for="isKuasa"
										class="ml-3 block cursor-pointer text-sm font-semibold text-gray-800 dark:text-gray-200"
									>
										{m['objection.proxy']()} / {m['form.agency_question']()}
									</label>
								</div>
							</div>
						</div>

						{#if isInstansi}
							<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div class="space-y-2">
									<h1 class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
										{m['objection.name_proxy']()}
									</h1>
									<input
										type="text"
										name="nama_kuasa"
										bind:value={$form.nama_kuasa}
										class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
									/>
								</div>
								<div class="space-y-2">
									<h1 class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
										{m['objection.phone']()} (Kuasa)
									</h1>
									<input
										type="text"
										name="no_telp_kuasa"
										bind:value={$form.no_telp_kuasa}
										class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
									/>
								</div>
							</div>
							<div class="space-y-2">
								<h1 class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
									{m['contact.address']()} (Kuasa)
								</h1>
								<input
									type="text"
									name="alamat_kuasa"
									bind:value={$form.alamat_kuasa}
									class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
								/>
							</div>
						{/if}
					</div>

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
								{m['layanan_pages.keberatan_detail']()}
							</div>
						</h3>

						<div class="space-y-2">
							<h1 class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
								{m['objection.reg_no']()} <span class="text-red-500">*</span>
							</h1>
							<input
								type="text"
								name="no_pendaftaran"
								bind:value={$form.no_pendaftaran}
								placeholder={m['form.request_number_placeholder']()}
								class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
							/>
							{#if $errors.no_pendaftaran}<span class="text-xs text-red-500"
									>{$errors.no_pendaftaran}</span
								>{/if}
						</div>

						<div class="space-y-2">
							<h1 class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
								{m['objection.purpose']()} <span class="text-red-500">*</span>
							</h1>
							<textarea
								name="tujuan"
								bind:value={$form.tujuan}
								rows="3"
								placeholder={m['objection.purpose_placeholder']()}
								class="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
							></textarea>
							{#if $errors.tujuan}<span class="text-xs text-red-500">{$errors.tujuan}</span>{/if}
						</div>

						<div class="space-y-2">
							<h1 class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
								{m['form.objection_reason']()} <span class="text-red-500">*</span>
							</h1>
							<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
								{#each data.alasanOptions as opt}
									<label
										class="flex items-start gap-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700"
									>
										<input
											type="checkbox"
											name="alasan"
											value={opt.label}
											bind:group={$form.alasan}
											class="mt-1 h-4 w-4 rounded border-gray-300 text-ppid-primary focus:ring-ppid-primary"
										/>
										<span class="text-sm text-gray-700 dark:text-gray-300">
											{opt.label}
										</span>
									</label>
								{/each}
							</div>
							{#if $errors.alasan}
								<span class="text-xs text-red-500">{$errors.alasan}</span>
							{/if}
						</div>

						<div class="space-y-2">
							<h1 class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
								{m['form.case_position']()} <span class="text-red-500">*</span>
							</h1>
							<textarea
								name="kasus"
								bind:value={$form.kasus}
								rows="5"
								placeholder={m['form.case_position_placeholder']()}
								class="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:bg-slate-800"
							></textarea>
							{#if $errors.kasus}<span class="text-xs text-red-500">{$errors.kasus}</span>{/if}
						</div>
					</div>

					<div class="mt-2 pt-8">
						<div class="flex flex-col justify-end gap-4 sm:flex-row">
							<button
								type="submit"
								disabled={$delayed}
								class="flex transform items-center justify-center gap-2 rounded-lg bg-ppid-primary px-8 py-3.5 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-ppid-primary/90 hover:shadow-xl disabled:opacity-50"
							>
								{#if $delayed}
									{m['form.submitting']()}
								{:else}
									{m['form.submit_objection']()}
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
