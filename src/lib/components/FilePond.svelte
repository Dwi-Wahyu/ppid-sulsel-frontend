<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	// Definisi Props menggunakan Svelte 5 [cite: 3, 31, 32]
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
		acceptedFileTypes = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf'],
		label = 'Seret & Letakkan file atau <span class="filepond--label-action">Telusuri</span>',
		value = $bindable() // Memungkinkan binding dua arah [cite: 32]
	}: Props = $props();

	let element: HTMLInputElement;
	let pond: any = null;

	const initFilePond = () => {
		if (typeof window === 'undefined' || !(window as any).FilePond) return;

		const FilePond = (window as any).FilePond;
		const ImagePreview = (window as any).FilePondPluginImagePreview;
		const PdfPreview = (window as any).FilePondPluginPdfPreview; // Plugin PDF [cite: 34]

		// Registrasi Plugin [cite: 34, 35]
		const plugins = [];
		if (ImagePreview) plugins.push(ImagePreview);
		if (PdfPreview) plugins.push(PdfPreview);

		if (plugins.length > 0) {
			FilePond.registerPlugin(...plugins);
		}

		// Inisialisasi Instance FilePond [cite: 35]
		pond = FilePond.create(element, {
			name: name,
			allowMultiple: allowMultiple,
			acceptedFileTypes: acceptedFileTypes,
			labelIdle: label,
			imagePreviewHeight: 170,
			storeAsFile: true, // Crucial agar file asli dikirim saat submit form [cite: 35]

			// Konfigurasi PDF Preview
			allowPdfPreview: true,
			pdfPreviewHeight: 320,
			pdfComponentExtraParams: 'toolbar=0&view=fit&page=1',

			onaddfile: (error: any, fileItem: any) => {
				if (!error) {
					value = fileItem.file; // Update binding value [cite: 35]
				}
			},
			onremovefile: () => {
				value = null; // Reset binding value [cite: 35]
			}
		});
	};

	onMount(async () => {
		// Load Styles secara dinamis [cite: 36]
		const styles = [
			{ id: 'filepond-css', href: '/vendor/filepond/index.css' },
			{ id: 'filepond-image-preview-css', href: '/vendor/filepond/image-preview.css' },
			{
				id: 'filepond-pdf-preview-css',
				href: '/vendor/filepond/filepond-plugin-pdf-preview.min.css'
			}
		];

		styles.forEach((style) => {
			if (!document.getElementById(style.id)) {
				const link = document.createElement('link');
				link.id = style.id;
				link.rel = 'stylesheet';
				link.href = style.href;
				document.head.appendChild(link);
			}
		});

		// Helper untuk memuat Script secara berurutan [cite: 36]
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
			// Memuat aset JS vendor
			await loadScript('/vendor/filepond/index.js', 'filepond-js');
			await loadScript('/vendor/filepond/image-preview.js', 'filepond-image-preview-js');
			await loadScript(
				'/vendor/filepond/filepond-plugin-pdf-preview.min.js',
				'filepond-pdf-preview-js'
			);

			initFilePond();
		} catch (e) {
			console.error('Gagal memuat aset FilePond', e);
		}
	});

	onDestroy(() => {
		if (pond) {
			pond.destroy(); // Bersihkan instance saat komponen dihancurkan [cite: 37]
		}
	});
</script>

<div class="filepond-container w-full">
	<input type="file" bind:this={element} {id} {name} />
</div>

<style>
	/* Styling FilePond agar sesuai dengan desain dashboard [cite: 38, 39, 40] */
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
