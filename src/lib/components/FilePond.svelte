<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		name?: string;
		id?: string;
		allowMultiple?: boolean;
		acceptedFileTypes?: string[];
		label?: string;
		value?: any;
	}

	let {
		name = 'file',
		id = 'filepond-' + Math.random().toString(36).substr(2, 9),
		allowMultiple = false,
		acceptedFileTypes = ['image/png', 'image/jpeg', 'image/gif'],
		label = 'Seret & Letakkan file atau <span class="filepond--label-action">Telusuri</span>',
		value = $bindable()
	}: Props = $props();

	let element: HTMLInputElement;
	let pond: any = null;

	const initFilePond = () => {
		if (typeof window === 'undefined' || !(window as any).FilePond) return;

		const FilePond = (window as any).FilePond;
		const FilePondPluginImagePreview = (window as any).FilePondPluginImagePreview;

		if (FilePondPluginImagePreview) {
			FilePond.registerPlugin(FilePondPluginImagePreview);
		}

		pond = FilePond.create(element, {
			name: name,
			allowMultiple: allowMultiple,
			acceptedFileTypes: acceptedFileTypes,
			labelIdle: label,
			imagePreviewHeight: 170,
			storeAsFile: true, // Crucial for standard form submission
			onaddfile: (error: any, fileItem: any) => {
				if (!error) {
					value = fileItem.file;
				}
			},
			onremovefile: () => {
				value = null;
			}
		});
	};

	onMount(async () => {
		// Load styles
		if (!document.getElementById('filepond-css')) {
			const link = document.createElement('link');
			link.id = 'filepond-css';
			link.rel = 'stylesheet';
			link.href = '/vendor/filepond/index.css';
			document.head.appendChild(link);
		}

		if (!document.getElementById('filepond-image-preview-css')) {
			const link = document.createElement('link');
			link.id = 'filepond-image-preview-css';
			link.rel = 'stylesheet';
			link.href = '/vendor/filepond/image-preview.css';
			document.head.appendChild(link);
		}

		// Load scripts sequentially
		const loadScript = (src: string, id: string) => {
			return new Promise((resolve, reject) => {
				if (document.getElementById(id)) return resolve(true);
				const script = document.createElement('script');
				script.id = id;
				script.src = src;
				script.onload = () => resolve(true);
				script.onerror = reject;
				document.head.appendChild(script);
			});
		};

		try {
			await loadScript('/vendor/filepond/index.js', 'filepond-js');
			await loadScript('/vendor/filepond/image-preview.js', 'filepond-image-preview-js');
			initFilePond();
		} catch (e) {
			console.error('Failed to load FilePond assets', e);
		}
	});

	onDestroy(() => {
		if (pond) {
			pond.destroy();
		}
	});
</script>

<div class="filepond-container w-full">
	<input type="file" bind:this={element} {id} {name} />
</div>

<style>
	:global(.filepond--root) {
		margin-bottom: 0;
		font-family: inherit;
	}

	:global(.filepond--panel-root) {
		background-color: #f8fafc;
		border: 1px dashed #cbd5e1;
		border-radius: 0.75rem;
	}

	:global(.dark .filepond--panel-root) {
		background-color: #1e293b;
		border-color: rgba(255, 255, 255, 0.1);
	}

	:global(.filepond--drop-label) {
		color: #64748b;
	}

	:global(.dark .filepond--drop-label) {
		color: #94a3b8;
	}

	:global(.filepond--label-action) {
		text-decoration-color: #0081d0;
		color: #0081d0;
		font-weight: 600;
	}
</style>
