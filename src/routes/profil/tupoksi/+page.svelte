<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	interface ProfilData {
		deskripsi: string;
	}

	let profil = $state<ProfilData>({
		deskripsi: ''
	});
	let isLoading = $state(true);

	onMount(async () => {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/public/profil/tupoksi`);
			const result = await response.json();
			if (result.success && result.data) {
				profil.deskripsi = result.data.deskripsi;
			}
		} catch (error) {
			console.error('Error fetching Tupoksi profile:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-6">
		<Breadcrumb
			items={[{ label: 'breadcrumb.profile', href: '#' }, { label: 'profile.tupoksi_title' }]}
		/>
		<div class="mt-4">
			<PageTitle title={m['profile.tupoksi_title']()} />
		</div>
	</div>
</div>

<main class="bg-gray-50 py-10 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-5xl space-y-8">
			<div
				class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-10 dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="prose max-w-none prose-slate dark:prose-invert">
					{@html profil.deskripsi}
				</div>
			</div>
		</div>
	</div>
</main>

<Footer />
