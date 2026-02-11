export interface ContactForm {
	name: string;
	phone: string;
	email: string;
	subject: string;
	message: string;
}

export type SubjectOption = 'permohonan' | 'pengaduan' | 'saran' | '';
