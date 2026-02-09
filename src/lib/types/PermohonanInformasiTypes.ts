export interface Skpd {
	id_skpd: string;
	nm_skpd: string;
}

export interface PermohonanDisposisi {
	id_disposisi: number;
	id_permohonan: number;
	id_skpd: string;
	pesan?: string;
	created_at: string;
	updated_at: string;
	skpd?: Skpd;
}

export interface PermohonanInformasi {
	id_permohonan: number;
	nama: string;
	email: string;
	no_hp: string;
	alamat: string;
	pekerjaan: string;
	tujuan: string;
	rincian_informasi: string;
	cara_memperoleh: string;
	cara_mendapat_salinan: string;
	status: number; // 0=pending, 1=proses, 2=selesai, 3=tolak, 4=batal, 5=disposisi
	status_label: string;
	status_color: string;
	pesan?: string;
	file?: string;
	foto_ktp?: string;
	id_skpd?: string;
	created_at: string;
	updated_at: string;
	skpd?: Skpd;
	disposisi?: PermohonanDisposisi[];
}

export interface PaginationLink {
	url: string | null;
	label: string;
	active: boolean;
}

export interface PermohonanInformasiPaginatedResponse {
	current_page: number;
	data: PermohonanInformasi[];
	first_page_url: string;
	from: number;
	last_page: number;
	last_page_url: string;
	links: PaginationLink[];
	next_page_url: string | null;
	path: string;
	per_page: number;
	prev_page_url: string | null;
	to: number;
	total: number;
}

export interface PermohonanInformasiApiResponse {
	success: boolean;
	data: PermohonanInformasiPaginatedResponse;
}
