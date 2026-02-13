import * as yup from 'yup';

export const keberatanSchema = yup.object({
	// Identitas Pemohon
	nama_pemohon: yup
		.string()
		.required('Nama pemohon wajib diisi')
		.matches(/^[\p{L}\s.\-']+$/u, 'Format nama tidak valid'),
	email_pemohon: yup.string().email('Format email tidak valid').required('Email wajib diisi'),
	no_telp_pemohon: yup
		.string()
		.min(10, 'Minimal 10 digit')
		.max(13, 'Maksimal 13 digit')
		.matches(/^[0-9+]+$/, 'Hanya angka diperbolehkan')
		.required('Nomor telepon wajib diisi'),
	pekerjaan_id: yup.string().required('Pekerjaan wajib dipilih'),

	// Alamat Pemohon
	alamat_pemohon: yup.string().required('Alamat wajib diisi'),
	pemohon_domisili_id: yup.string().required('Domisili Pemohon wajib dipilih'),

	// Data Kuasa (Opsional)
	nama_kuasa: yup.string().notRequired(),
	alamat_kuasa: yup.string().notRequired(),
	no_telp_kuasa: yup.string().notRequired(),
	kuasa_domisili_id: yup.string().notRequired(),

	// Detail Keberatan
	no_pendaftaran: yup.string().required('Nomor pendaftaran permohonan wajib diisi'),
	tujuan: yup.string().required('Tujuan penggunaan informasi wajib diisi'),
	alasan: yup
		.array()
		.of(yup.string().required())
		.min(1, 'Pilih minimal satu alasan keberatan')
		.default([]), // [cite: 16]
	kasus: yup.string().required('Kasus posisi wajib diisi'),

	// Honeypot (Security)
	website: yup.string().max(0, 'Bot detected').notRequired()
});

export type KeberatanSchema = yup.InferType<typeof keberatanSchema>;
