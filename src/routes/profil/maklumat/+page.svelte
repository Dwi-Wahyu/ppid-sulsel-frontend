<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	interface ProfilData {
		deskripsi: string;
		file_banner: string | null;
	}

	let profil = $state<ProfilData>({
		deskripsi: '',
		file_banner: null
	});

	onMount(async () => {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/public/profil/maklumat`);
			const result = await response.json();
			if (result.success && result.data) {
				profil.deskripsi = result.data.deskripsi || '';
				if (result.data.file_banner) {
					// Check if it's already a full URL or needs storage prefix
					// Usually files stored via `storeAs` need `storage/` prefix if symlinked
					profil.file_banner = `${PUBLIC_API_URL}/storage/${result.data.file_banner}`;
				}
			}
		} catch (error) {
			console.error('Error fetching Maklumat:', error);
		}
	});
</script>

<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-6">
		<Breadcrumb
			items={[{ label: 'breadcrumb.profile', href: '#' }, { label: 'profile.service_declaration' }]}
		/>
		<div class="mt-4">
			<PageTitle title={m['profile.service_declaration']()} />
		</div>
	</div>
</div>

<main class="bg-gray-50 py-10 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-5xl space-y-8">
			<!-- Maklumat Document -->
			<div
				class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div
					class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900"
				>
					<h2 class="font-bold text-gray-900 dark:text-white">
						{m['maklumat.title']()}
					</h2>
					<button
						class="flex items-center gap-2 text-sm font-medium text-ppid-primary transition-colors hover:text-ppid-accent dark:text-white"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-4 w-4"
						>
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="7 10 12 15 17 10" />
							<line x1="12" x2="12" y1="15" y2="3" />
						</svg>
						{m['common.download']()}
					</button>
				</div>

				<div class="p-6">
					<div class="overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
						{#if profil.file_banner}
							<img
								src={profil.file_banner}
								alt={m['maklumat.banner_alt']()}
								class="h-auto w-full"
							/>
						{:else}
							<img
								src="/images/20230918134717_Maklumat pelayanan informasi publik.png"
								alt={m['maklumat.banner_alt']()}
								class="h-auto w-full"
							/>
						{/if}
					</div>
					<p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
						{m['maklumat.caption']()}
					</p>
				</div>
			</div>

			<!-- Dynamic Content -->
			<div
				class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="prose max-w-none prose-slate dark:prose-invert">
					{@html profil.deskripsi}
				</div>
			</div>

			<!-- Contact Info -->
			<div
				class="rounded-xl bg-linear-to-br from-ppid-primary to-ppid-text p-6 text-center text-white md:p-8"
			>
				<h3 class="mb-2 text-lg font-bold">{m['maklumat.info_complaint_title']()}</h3>
				<p class="text-sm text-white/90">
					{m['maklumat.info_complaint_desc']()}
				</p>
			</div>
		</div>
	</div>
</main>

<Footer />
