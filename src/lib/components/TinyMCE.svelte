<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		value?: string;
		name?: string;
		id?: string;
		height?: number;
		placeholder?: string;
	}

	let {
		value = $bindable(''),
		name = '',
		id = 'tinymce-' + Math.random().toString(36).substr(2, 9),
		height = 400,
		placeholder = ''
	}: Props = $props();

	let editorInstance: any = null;
	let element: HTMLTextAreaElement;

	// Perbaikan: Gunakan status loading global
	const TINY_SCRIPT_ID = 'tinymce-script';

	const initEditor = () => {
		// Pastikan DOM sudah siap dan tinymce sudah tersedia secara global
		if (typeof window === 'undefined' || !(window as any).tinymce) return;

		const tinymce = (window as any).tinymce;

		// Bersihkan instance lama jika ada dengan ID yang sama
		if (tinymce.get(id)) {
			tinymce.remove(`#${id}`);
		}

		const isDarkMode = document.documentElement.classList.contains('dark');

		tinymce.init({
			target: element, // Menggunakan referensi element langsung lebih aman [cite: 14]
			height: height,
			placeholder: placeholder,
			menubar: 'file edit view insert format tools table help',
			plugins: [
				'preview',
				'importcss',
				'searchreplace',
				'autolink',
				'autosave',
				'save',
				'directionality',
				'visualblocks',
				'visualchars',
				'fullscreen',
				'link',
				'template',
				'table',
				'charmap',
				'pagebreak',
				'nonbreaking',
				'anchor',
				'insertdatetime',
				'advlist',
				'lists',
				'wordcount',
				'help',
				'quickbars',
				'emoticons'
			],
			toolbar:
				'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen preview | link anchor',
			skin: isDarkMode ? 'oxide-dark' : 'oxide',
			content_css: isDarkMode ? 'dark' : 'default',
			setup: (editor: any) => {
				editorInstance = editor;
				editor.on('change input undo redo', () => {
					value = editor.getContent();
				});
			},
			init_instance_callback: (editor: any) => {
				if (value) editor.setContent(value);
			}
		});
	};

	onMount(() => {
		if (!(window as any).tinymce) {
			// Periksa apakah skrip sedang dimuat oleh komponen lain
			let script = document.getElementById(TINY_SCRIPT_ID) as HTMLScriptElement;

			if (!script) {
				script = document.createElement('script');
				script.id = TINY_SCRIPT_ID;
				script.src = '/vendor/tinymce/tinymce.min.js';
				script.onload = () => {
					// Trigger event custom agar komponen lain tahu skrip sudah siap
					window.dispatchEvent(new Event('tinymce-loaded'));
					initEditor();
				};
				document.head.appendChild(script);
			} else {
				// Jika skrip sudah ada tapi belum selesai dimuat, tunggu event
				window.addEventListener('tinymce-loaded', initEditor);
			}
		} else {
			initEditor();
		}

		// Dark mode observer
		const observer = new MutationObserver(() => {
			if (editorInstance) {
				(window as any).tinymce.remove(editorInstance);
				initEditor();
			}
		});

		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

		return () => {
			observer.disconnect();
			window.removeEventListener('tinymce-loaded', initEditor);
		};
	});

	onDestroy(() => {
		if (editorInstance && (window as any).tinymce) {
			(window as any).tinymce.remove(editorInstance); // Pastikan dibersihkan [cite: 19]
		}
	});

	$effect(() => {
		if (editorInstance && value !== editorInstance.getContent()) {
			editorInstance.setContent(value || '');
		}
	});
</script>

<div class="tinymce-container w-full">
	<textarea {id} {name} bind:this={element} class="hidden"></textarea>
</div>

<style>
	:global(.tox-tinymce) {
		border-radius: 0.75rem !important;
		border: 1px solid rgb(226, 232, 240) !important;
		overflow: hidden;
	}

	:global(.dark .tox-tinymce) {
		border-color: rgba(255, 255, 255, 0.1) !important;
	}
</style>
