<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import type { SosmedItem } from '$lib/types/sosmed';

	const predefinedIcons: Record<string, string> = {
		Facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>',
		'Twitter/X':
			'<path d="M4 4l11.733 16h4.267l-11.733 -16z M4 20l6.768 -6.768 M13.232 10.768l6.768 -6.768"></path>',
		Instagram:
			'<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>',
		YouTube:
			'<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0 1.94 2C1 8.14 1 12 1 12s0 3.86.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>',
		TikTok: '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>',
		LinkedIn:
			'<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>',
		WhatsApp:
			'<path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"></path><path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"></path><path d="M9.5 13a3.5 3.5 0 0 0 5 0"></path>',
		Telegram: '<path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path>',
		Website:
			'<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>'
	};

	let isSaving = $state(false);
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	let formData = $state<Partial<SosmedItem>>({
		sosmed: '',
		judul: '',
		link_sosmed: '',
		icon_sosmed: '',
		urutan: 1
	});

	function handlePlatformChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const platform = target.value;
		if (platform && predefinedIcons[platform]) {
			formData.sosmed = platform;
			formData.judul = platform;
			formData.icon_sosmed = predefinedIcons[platform];
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSaving = true;

		try {
			const result = await api.post('/admin/sosmed', formData);
			if (result.success) {
				notificationType = 'success';
				notificationMessage = 'Tautan berhasil ditambahkan';
				showNotification = true;
				setTimeout(() => {
					goto('/admin/sosial-media');
				}, 1500);
			}
		} catch (error: any) {
			notificationType = 'error';
			notificationMessage = error.message || 'Terjadi kesalahan sistem';
			showNotification = true;
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="p-8">
	<div class="mx-auto max-w-3xl">
		<header class="mb-4">
			<button
				onclick={() => goto('/admin/sosial-media')}
				class="mb-4 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-ppid-primary"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				KEMBALI KE DAFTAR
			</button>
			<h1 class="text-3xl font-black tracking-tight text-slate-800 uppercase dark:text-white">
				Tambah Link Baru
			</h1>
		</header>

		<div class="rounded-4xl bg-white p-10 shadow-xl dark:bg-slate-900">
			<form onsubmit={handleSubmit} class="space-y-6">
				<div>
					<label
						for="platform-select"
						class="mb-2 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
						>Pilih Platform</label
					>
					<select
						id="platform-select"
						onchange={handlePlatformChange}
						class="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-800 transition-all focus:border-ppid-primary focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
					>
						<option value="">-- Pilih Template Ikon --</option>
						{#each Object.keys(predefinedIcons) as platform}
							<option value={platform} selected={formData.sosmed === platform}>{platform}</option>
						{/each}
					</select>
				</div>

				<div class="grid gap-6 sm:grid-cols-2">
					<div class="sm:col-span-2">
						<label
							for="sosmed"
							class="mb-2 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
							>Nama Platform</label
						>
						<input
							type="text"
							id="sosmed"
							bind:value={formData.sosmed}
							required
							placeholder="Misal: Twitter"
							class="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-bold transition-all outline-none focus:border-ppid-primary dark:bg-slate-800 dark:text-white"
						/>
					</div>

					<div class="sm:col-span-2">
						<label
							for="judul"
							class="mb-2 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
							>Label/Judul</label
						>
						<input
							type="text"
							id="judul"
							bind:value={formData.judul}
							placeholder="Misal: Follow Akun X Kami"
							class="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-bold transition-all outline-none focus:border-ppid-primary dark:bg-slate-800 dark:text-white"
						/>
					</div>

					<div class="sm:col-span-2">
						<label
							for="link_sosmed"
							class="mb-2 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
							>URL Tautan</label
						>
						<input
							type="url"
							id="link_sosmed"
							bind:value={formData.link_sosmed}
							required
							placeholder="https://..."
							class="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-bold transition-all outline-none focus:border-ppid-primary dark:bg-slate-800 dark:text-white"
						/>
					</div>

					<div class="sm:col-span-2">
						<div class="mb-2 flex items-center justify-between">
							<label
								for="icon_sosmed"
								class="block text-[10px] font-black tracking-widest text-slate-500 uppercase"
								>SVG Path</label
							>
							<span class="text-[10px] font-bold text-ppid-primary">PREVIEW IKON</span>
						</div>
						<div class="flex gap-4">
							<div class="flex-1">
								<textarea
									id="icon_sosmed"
									bind:value={formData.icon_sosmed}
									required
									rows="4"
									class="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 font-mono text-xs transition-all outline-none focus:border-ppid-primary dark:bg-slate-800 dark:text-white"
									placeholder="<path d='...'></path>"
								></textarea>
							</div>
							<div
								class="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-ppid-primary dark:border-slate-700 dark:bg-slate-800"
							>
								{#if formData.icon_sosmed}
									<svg
										width="40"
										height="40"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										{@html formData.icon_sosmed}
									</svg>
								{:else}
									<span class="text-[10px] font-bold text-slate-400">TIDAK ADA IKON</span>
								{/if}
							</div>
						</div>
					</div>

					<div>
						<label
							for="urutan"
							class="mb-2 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
							>Urutan</label
						>
						<input
							type="number"
							id="urutan"
							bind:value={formData.urutan}
							min="1"
							class="w-full rounded-2xl border-2 border-slate-100 p-4 text-sm font-bold outline-none focus:border-ppid-primary dark:bg-slate-800 dark:text-white"
						/>
					</div>
				</div>

				<footer class="flex justify-end gap-4 pt-6">
					<button
						type="button"
						onclick={() => goto('/admin/sosial-media')}
						class="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-slate-600"
						>Batal</button
					>
					<button
						type="submit"
						disabled={isSaving}
						class="rounded-2xl bg-ppid-primary px-10 py-4 text-xs font-black text-white shadow-xl shadow-ppid-primary/30 transition-all hover:opacity-90 disabled:opacity-50"
					>
						{isSaving ? 'MEMPROSES...' : 'SIMPAN DATA'}
					</button>
				</footer>
			</form>
		</div>
	</div>
</div>

<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'BERHASIL' : 'ERROR SISTEM'}
	description={notificationMessage}
/>
