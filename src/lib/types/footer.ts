// src/lib/types/footer.ts
export interface FooterData {
	footer_logo: string | null;
	footer_description: string;
	footer_address: string;
	footer_phone: string;
	footer_email: string;
	privacy_policy: string;
	terms_conditions: string;
	is_stats_visible: string | boolean;
}

export interface NotificationState {
	show: boolean;
	title: string;
	description: string;
	theme: 'success' | 'error' | 'warning' | 'info';
}
