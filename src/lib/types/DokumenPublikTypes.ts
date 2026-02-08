export interface KategoriInformasi {
    id_kat_info: number;
    nm_kat_info: string;
}

export interface Skpd {
    id_skpd: string;
    nm_skpd: string;
}

export interface DokumenPublik {
    id_informasi: number;
    judul: string;
    file: string | null;
    tgl_upload: string | null;
    id_kat_info: number;
    id_skpd: string;
    ket: string;
    verify: 'y' | 'n' | 't';
    jumlah_download: number;
    kategori?: KategoriInformasi;
    skpd?: Skpd;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface DokumenPublikPaginatedResponse {
    current_page: number;
    data: DokumenPublik[];
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

export interface DokumenPublikApiResponse {
    success: boolean;
    data: DokumenPublikPaginatedResponse;
}

export interface FilterParams {
    search?: string;
    id_kat_info?: string;
    id_skpd?: string;
    verify?: 'y' | 'n' | 't';
    start_date?: string;
    end_date?: string;
    sort?: 'newest' | 'oldest' | 'title_asc' | 'title_desc';
    page?: string;
}
