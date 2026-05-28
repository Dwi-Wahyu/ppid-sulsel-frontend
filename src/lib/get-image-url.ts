import { env } from '$env/dynamic/public';

/**
 * Menghasilkan URL lengkap untuk aset yang disimpan di Laravel.
 * Default menggunakan prefix 'uploads'.
 */
export function getImageUrl(path: string, forceStorage = false): string {
	if (!path) return '';
	// Jika sudah berupa URL lengkap, kembalikan apa adanya
	if (path.startsWith('http://') || path.startsWith('https://')) return path;

	const backendUrl = env.PUBLIC_BACKEND_URL;
	if (!backendUrl) {
		console.warn('PUBLIC_BACKEND_URL is not defined in environment variables');
	}

	// Bersihkan leading slash agar tidak double slash
	const cleanPath = path.startsWith('/') ? path.slice(1) : path;

	// Pilih prefix: storage atau uploads
	const prefix = forceStorage ? 'storage' : 'uploads';

	const fullUrl = `${backendUrl || ''}/${prefix}/${cleanPath}`;

	return fullUrl;
}
