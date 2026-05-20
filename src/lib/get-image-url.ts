import { env } from '$env/dynamic/public';

/**
 * Menghasilkan URL lengkap untuk aset yang disimpan di Laravel storage.
 * Laravel mengekspos storage via symlink public/storage -> storage/app/public
 * sehingga URL yang benar adalah: {BACKEND_URL}/storage/{path}
 */
export function getImageUrl(path: string): string {
	if (!path) return '';
	// Jika sudah berupa URL lengkap, kembalikan apa adanya
	if (path.startsWith('http://') || path.startsWith('https://')) return path;
	// Bersihkan leading slash agar tidak double slash
	const cleanPath = path.startsWith('/') ? path.slice(1) : path;
	return `${env.PUBLIC_BACKEND_URL}/storage/${cleanPath}`;
}
