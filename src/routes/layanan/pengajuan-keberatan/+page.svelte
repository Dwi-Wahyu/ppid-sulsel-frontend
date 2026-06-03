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

	const { form, errors, enhance, delayed, message, validate } = superForm(untrack(() => data.form), {
		taintedMessage: null,
		scrollToError: 'smooth',
		validationMethod: 'onInput',
		onResult: ({ result }) => {
			if (result.type === 'success') {
				showSuccessModal = true;
			}
		}
	});

	$inspect($errors);

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

<main class="bg-gray-50 pt-6 pb-12 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
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

					<div
						class="space-y-6 rounded-2xl md:border md:border-gray-100 md:p-6 md:dark:border-slate-700"
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

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<label for="nama_pemohon" class="block text-sm font-semibold {$errors.nama_pemohon ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}">
									{m['form.fullname']()} <span class="text-red-500">*</span>
								</label>
								<input
									type="text"
									id="nama_pemohon"
									name="nama_pemohon"
									bind:value={$form.nama_pemohon}
									placeholder={m['form.fullname_placeholder']()}
									class="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 dark:bg-slate-800 {$errors.nama_pemohon ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
									aria-invalid={$errors.nama_pemohon ? 'true' : undefined}
								/>
								{#if $errors.nama_pemohon}<span class="text-xs text-red-500"
										>{$errors.nama_pemohon}</span
									>{/if}
							</div>

							<div class="space-y-2">
								<label for="no_telp_pemohon" class="block text-sm font-semibold {$errors.no_telp_pemohon ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}">
									{m['contact.phone']()} <span class="text-red-500">*</span>
								</label>
								<input
									type="tel"
									id="no_telp_pemohon"
									name="no_telp_pemohon"
									bind:value={$form.no_telp_pemohon}
									oninput={(e) => ($form.no_telp_pemohon = e.currentTarget.value.replace(/\D/g, ''))}
									maxlength="15"
									placeholder="08xxxxxxxxxx"
									class="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 dark:bg-slate-800 {$errors.no_telp_pemohon ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
									aria-invalid={$errors.no_telp_pemohon ? 'true' : undefined}
								/>
								{#if $errors.no_telp_pemohon}<span class="text-xs text-red-500"
										>{$errors.no_telp_pemohon}</span
									>{/if}
							</div>
						</div>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<label for="email_pemohon" class="block text-sm font-semibold {$errors.email_pemohon ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}">
									{m['contact.email']()} <span class="text-red-500">*</span>
								</label>
								<input
									type="email"
									id="email_pemohon"
									name="email_pemohon"
									bind:value={$form.email_pemohon}
									placeholder="contoh@email.com"
									class="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 dark:bg-slate-800 {$errors.email_pemohon ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
									aria-invalid={$errors.email_pemohon ? 'true' : undefined}
								/>
								{#if $errors.email_pemohon}<span class="text-xs text-red-500"
										>{$errors.email_pemohon}</span
									>{/if}
							</div>

							<div class="space-y-2">
								<label for="pekerjaan_id" class="block text-sm font-semibold {$errors.pekerjaan_id ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}">
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
						</div>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<label for="pemohon_domisili_id" class="block text-sm font-semibold {$errors.pemohon_domisili_id ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}">
									{m['form.domicile']()} <span class="text-red-500">*</span>
								</label>
								<SearchableSelect
									options={data.domisiliOptions}
									bind:value={$form.pemohon_domisili_id}
									name="pemohon_domisili_id"
									placeholder={$form.pemohon_domisili_id
										? m['form.domicile_placeholder']()
										: 'Pilih domisili'}
									idKey="value"
									labelKey="label"
									isInvalid={!!$errors.pemohon_domisili_id}
								/>
								{#if $errors.pemohon_domisili_id}<span class="text-xs text-red-500"
										>{$errors.pemohon_domisili_id}</span
									>{/if}
							</div>

							<div class="space-y-2">
								<label for="alamat_pemohon" class="block text-sm font-semibold {$errors.alamat_pemohon ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}">
									{m['objection.address']()} <span class="text-red-500">*</span>
								</label>
								<input
									type="text"
									id="alamat_pemohon"
									name="alamat_pemohon"
									bind:value={$form.alamat_pemohon}
									placeholder={m['form.address_placeholder']()}
									class="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 dark:bg-slate-800 {$errors.alamat_pemohon ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
									aria-invalid={$errors.alamat_pemohon ? 'true' : undefined}
								/>
								{#if $errors.alamat_pemohon}<span class="text-xs text-red-500"
										>{$errors.alamat_pemohon}</span
									>{/if}
							</div>
						</div>

						<div class="mt-2 border-gray-100 pt-6 pb-2 dark:border-slate-700">
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
									<label for="nama_kuasa" class="block text-sm font-semibold {$errors.nama_kuasa ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}">
										{m['objection.name_proxy']()}
									</label>
									<input
										type="text"
										id="nama_kuasa"
										name="nama_kuasa"
										bind:value={$form.nama_kuasa}
										class="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 dark:bg-slate-800 {$errors.nama_kuasa ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
										aria-invalid={$errors.nama_kuasa ? 'true' : undefined}
									/>
									{#if $errors.nama_kuasa}<span class="text-xs text-red-500">{$errors.nama_kuasa}</span>{/if}
								</div>
								<div class="space-y-2">
									<label for="no_telp_kuasa" class="block text-sm font-semibold {$errors.no_telp_kuasa ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}">
										{m['objection.phone']()} (Kuasa)
									</label>
									<input
										type="tel"
										id="no_telp_kuasa"
										name="no_telp_kuasa"
										bind:value={$form.no_telp_kuasa}
										oninput={(e) => ($form.no_telp_kuasa = e.currentTarget.value.replace(/\D/g, ''))}
										maxlength="15"
										class="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 dark:bg-slate-800 {$errors.no_telp_kuasa ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
										aria-invalid={$errors.no_telp_kuasa ? 'true' : undefined}
									/>
									{#if $errors.no_telp_kuasa}<span class="text-xs text-red-500">{$errors.no_telp_kuasa}</span>{/if}
								</div>
							</div>

							<div class="space-y-2">
								<label for="kuasa_domisili_id" class="block text-sm font-semibold {$errors.kuasa_domisili_id ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}">
									{m['objection.domicile_proxy']()}
								</label>
								<SearchableSelect
									options={data.domisiliOptions}
									bind:value={$form.kuasa_domisili_id as string}
									name="kuasa_domisili_id"
									placeholder={m['form.domicile_placeholder']()}
									idKey="value"
									labelKey="label"
									isInvalid={!!$errors.kuasa_domisili_id}
								/>
								{#if $errors.kuasa_domisili_id}<span class="text-xs text-red-500"
										>{$errors.kuasa_domisili_id}</span
									>{/if}
							</div>

							<div class="space-y-2">
								<label for="alamat_kuasa" class="block text-sm font-semibold {$errors.alamat_kuasa ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}">
									{m['contact.address']()} (Kuasa)
								</label>
								<input
									type="text"
									id="alamat_kuasa"
									name="alamat_kuasa"
									bind:value={$form.alamat_kuasa}
									class="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 dark:bg-slate-800 {$errors.alamat_kuasa ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
									aria-invalid={$errors.alamat_kuasa ? 'true' : undefined}
								/>
								{#if $errors.alamat_kuasa}<span class="text-xs text-red-500">{$errors.alamat_kuasa}</span>{/if}
							</div>
						{/if}
					</div>

					<div
						class="space-y-6 rounded-2xl md:border md:border-gray-100 md:p-6 md:dark:border-slate-700"
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
									{m['layanan_pages.keberatan_detail']()}
								</div>
								<p class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
									{m['layanan_pages.keberatan_detail_desc']()}
								</p>
							</div>
						</h3>

						<div class="space-y-2">
							<label for="no_pendaftaran" class="block text-sm font-semibold {$errors.no_pendaftaran ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}">
								{m['objection.reg_no']()} <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="no_pendaftaran"
								name="no_pendaftaran"
								bind:value={$form.no_pendaftaran}
								placeholder={m['form.request_number_placeholder']()}
								class="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 dark:bg-slate-800 {$errors.no_pendaftaran ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
								aria-invalid={$errors.no_pendaftaran ? 'true' : undefined}
							/>
							{#if $errors.no_pendaftaran}<span class="text-xs text-red-500"
									>{$errors.no_pendaftaran}</span
								>{/if}
						</div>

						<div class="space-y-2">
							<label for="tujuan" class="block text-sm font-semibold {$errors.tujuan ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}">
								{m['objection.purpose']()} <span class="text-red-500">*</span>
							</label>
							<textarea
								id="tujuan"
								name="tujuan"
								bind:value={$form.tujuan}
								rows="3"
								placeholder={m['objection.purpose_placeholder']()}
								class="w-full resize-none rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 dark:bg-slate-800 {$errors.tujuan ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
								aria-invalid={$errors.tujuan ? 'true' : undefined}
							></textarea>
							{#if $errors.tujuan}<span class="text-xs text-red-500">{$errors.tujuan}</span>{/if}
						</div>

						<div class="space-y-2">
							<label for="alasan" class="block text-sm font-semibold {$errors.alasan ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}">
								{m['form.objection_reason']()} <span class="text-red-500">*</span>
							</label>
							<div id="alasan" class="grid grid-cols-1 gap-2 md:grid-cols-2">
								{#each data.alasanOptions as opt}
									<label
										class="flex items-start gap-2 rounded-lg border p-3 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700 {$errors.alasan ? 'border-red-500 bg-red-50/50' : 'border-gray-200'}"
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
							<label for="kasus" class="block text-sm font-semibold {$errors.kasus ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}">
								{m['form.case_position']()} <span class="text-red-500">*</span>
							</label>
							<textarea
								id="kasus"
								name="kasus"
								bind:value={$form.kasus}
								rows="5"
								placeholder={m['form.case_position_placeholder']()}
								class="w-full resize-none rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 dark:bg-slate-800 {$errors.kasus ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-ppid-primary focus:ring-ppid-primary'}"
								aria-invalid={$errors.kasus ? 'true' : undefined}
							></textarea>
							{#if $errors.kasus}<span class="text-xs text-red-500">{$errors.kasus}</span>{/if}
						</div>
					</div>

					<div class="pt-6">
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

<Footer />
