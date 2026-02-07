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

	const initEditor = () => {
		if (typeof window === 'undefined' || !(window as any).tinymce) return;

		const tinymce = (window as any).tinymce;
		const isDarkMode = document.documentElement.classList.contains('dark');

		tinymce.init({
			target: element,
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
				'charmap',
				'quickbars',
				'emoticons'
			],
			toolbar:
				'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview print | template link anchor | ltr rtl',
			skin: isDarkMode ? 'oxide-dark' : 'oxide',
			content_css: isDarkMode ? 'dark' : 'default',
			content_style: `
				@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
				body {
					font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif;
					font-size: 16px;
					color: ${isDarkMode ? '#cbd5e1' : '#334155'};
					background-color: ${isDarkMode ? '#1e293b' : '#ffffff'};
				}
				h1,h2,h3,h4,h5,h6 {
					color: ${isDarkMode ? '#f8fafc' : '#1e293b'};
				}
			`,
			setup: (editor: any) => {
				editorInstance = editor;
				editor.on('change input undo redo', () => {
					value = editor.getContent();
				});

				// Handle focus/blur if needed
			},
			init_instance_callback: (editor: any) => {
				if (value) {
					editor.setContent(value);
				}
			}
		});
	};

	onMount(() => {
		// Load TinyMCE if not already loaded
		if (!(window as any).tinymce) {
			const script = document.createElement('script');
			script.src = '/vendor/tinymce/tinymce.min.js';
			script.onload = initEditor;
			document.head.appendChild(script);
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

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});

		return () => observer.disconnect();
	});

	onDestroy(() => {
		if (editorInstance && (window as any).tinymce) {
			(window as any).tinymce.remove(editorInstance);
		}
	});

	// Sync value changes from outside
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
