import * as yup from 'yup';

export const permohonanSchema = yup.object({
	// Identitas Pemohon
	nama: yup
		.string()
		.required('Nama pemohon wajib diisi')
		.matches(/^[\p{L}\s.\-']+$/u, 'Format nama tidak valid'),
	nik: yup
		.string()
		.required('NIK wajib diisi')
		.length(16, 'NIK harus terdiri dari 16 digit angka')
		.matches(/^[0-9]+$/, 'Hanya angka diperbolehkan'),
	email: yup.string().email('Format email tidak valid').required('Email wajib diisi'),
	no_hp: yup
		.string()
		.min(10, 'Minimal 10 digit')
		.max(13, 'Maksimal 13 digit')
		.matches(/^[0-9+]+$/, 'Hanya angka diperbolehkan')
		.required('Nomor telepon wajib diisi'),
	pekerjaan_id: yup.string().required('Pekerjaan wajib dipilih'),
	domisili_id: yup.string().required('Domisili wajib dipilih'),
	alamat: yup.string().required('Alamat wajib diisi'),

	// Instansi / Badan Hukum
	nmr_pengesahan: yup.string().notRequired(),

	// Rincian Informasi
	tujuan: yup.string().required('Tujuan penggunaan informasi wajib diisi'),
	rincian: yup.string().required('Rincian informasi wajib diisi'),
	id_bentuk_informasi: yup.string().required('Bentuk informasi wajib dipilih'),
	contoh_informasi: yup.string().url('Format URL tidak valid').notRequired(),

	// Files are handled differently in Superforms with FormData, 
    // we use a custom validator or handle them server-side, 
    // but we define them here to generate types.
	foto_ktp: yup.mixed().notRequired(), 
	dokumen_pendukung: yup.mixed().notRequired(),

	// Honeypot (Security)
	website: yup.string().max(0, 'Bot detected').notRequired()
});

export type PermohonanSchema = yup.InferType<typeof permohonanSchema>;
