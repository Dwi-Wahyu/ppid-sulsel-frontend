import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	return {
		filters: {
			page: url.searchParams.get('page') || '1',
			search: url.searchParams.get('search') || ''
		}
	};
};
