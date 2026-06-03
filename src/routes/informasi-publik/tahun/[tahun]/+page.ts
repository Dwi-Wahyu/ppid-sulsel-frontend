import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, url }) => {
	return {
		tahun: params.tahun,
		filters: {
			page: url.searchParams.get('page') || '1',
			search: url.searchParams.get('search') || ''
		}
	};
};
