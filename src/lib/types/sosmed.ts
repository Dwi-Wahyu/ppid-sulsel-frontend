export interface SosmedItem {
	id_sosmed: number;
	sosmed: string;
	icon_sosmed: string; // Berisi path SVG seperti <path d="...">
	urutan: number;
	judul: string;
	link_sosmed: string;
	created_at: string;
	updated_at: string;
}

export interface SosmedResponse {
	data: SosmedItem[];
}
