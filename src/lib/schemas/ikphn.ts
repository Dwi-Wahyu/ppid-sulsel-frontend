import { mixed, number, object, string } from 'yup';

const ikphnSchema = object({
	id: number().optional(),
	nama_jabatan: string().min(3, 'Nama jabatan minimal 3 karakter'),
	file: mixed().test('fileSize', 'File terlalu besar (Max 10MB)', (value) => {
		if (!value || !(value instanceof File)) return true; // Opsional saat edit
		return value.size <= 10000000;
	})
});
