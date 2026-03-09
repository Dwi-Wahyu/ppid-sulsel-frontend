export interface LoginLogResponse {
	success: boolean;
	message: string;
	data: PaginationData<LoginLog>;
}

export interface PaginationData<T> {
	current_page: number;
	data: T[];
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

export interface PaginationLink {
	url: string | null;
	label: string;
	page: number | null;
	active: boolean;
}

export interface LoginLog {
	id: number;
	id_user: number;
	tipe: 'login' | 'logout';
	ip: string;
	createdAt: string;
	user: UserSummary;
}

export interface UserSummary {
	id: number;
	name: string;
	username: string;
}
