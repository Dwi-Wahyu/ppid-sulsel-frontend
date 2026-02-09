export interface Notification {
	id_notification: string;
	title: string;
	message: string;
	url: string | null;
	read_at: string | null;
	created_at: string;
	diff_for_humans?: string;
}

export interface NotificationResponse {
	data: {
		data: Notification[];
		current_page: number;
		last_page: number;
		total: number;
	};
}
