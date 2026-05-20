<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getImageUrl } from '$lib/get-image-url';

	interface ProfilData {
		deskripsi: string;
		foto_kepala: string | null;
	}

	let profil = $state<ProfilData>({
		deskripsi: '',
		foto_kepala: null
	});

	let isLoading = $state(true);

	onMount(async () => {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/public/profil/sambutan`);
			const result = await response.json();
			if (result.success && result.data) {
				profil.deskripsi = result.data.deskripsi;
				if (result.data.foto_kepala) {
					profil.foto_kepala = getImageUrl(result.data.foto_kepala);
				}
			}
		} catch (error) {
			console.error('Error fetching Sambutan:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>{m['profile.welcome_title']()} - PPID Provinsi Sulawesi Selatan</title>
</svelte:head>

<main class="min-h-screen bg-white transition-colors dark:bg-slate-900">
	<PageTitle title={m['profile.welcome_title']()} />

	<div class="container mx-auto px-4 py-12">
		<div class="mx-auto max-w-5xl">
			<Breadcrumb
				items={[{ label: m['common.home'](), href: '/' }, { label: m['profile.welcome_title']() }]}
				class="mb-10"
			/>

			<div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
				<!-- Main Content -->
				<div class="lg:col-span-2">
					<div class="prose prose-lg max-w-none dark:prose-invert prose-headings:font-black prose-headings:text-ppid-primary prose-a:text-ppid-primary">
						{#if isLoading}
							<div class="space-y-4">
								<div class="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
								<div class="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
								<div class="h-4 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
							</div>
						{:else}
							{@html profil.deskripsi || '<p>Konten sambutan belum tersedia.</p>'}
						{/if}
					</div>
				</div>

				<!-- Sidebar Info -->
				<aside class="space-y-8">
					<div class="sticky top-24">
						<div class="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
							<div class="aspect-[4/5] overflow-hidden">
								{#if isLoading}
									<div class="flex h-full w-full animate-pulse items-center justify-center bg-slate-200 dark:bg-slate-700"></div>
								{:else if profil.foto_kepala}
									<img
										src={profil.foto_kepala}
										alt="Kepala PPID Utama"
										class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
									/>
								{:else}
									<div class="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-slate-700">
										<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-slate-400">
											<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
											<circle cx="12" cy="7" r="4" />
										</svg>
									</div>
								{/if}
							</div>
							<div class="p-6">
								<h3 class="mb-1 text-lg font-black text-ppid-primary dark:text-white">
									{m['leadership.head_ppid_name']()}
								</h3>
								<div class="mb-2 h-0.5 w-12 rounded-full bg-ppid-accent"></div>
								<p class="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
									{m['profile.main_ppid_province']()}
								</p>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
	</div>
</main>

<Footer />
