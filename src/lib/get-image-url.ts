import { PUBLIC_BACKEND_URL } from '$env/static/public';

export function getImageUrl(path: string) {
	return `${PUBLIC_BACKEND_URL}/storage/${path}`;
}
