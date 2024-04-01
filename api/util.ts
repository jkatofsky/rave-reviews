import { PaginatedResponse } from '@/shared/types';

export async function getPaginatedResponse<T>(
	dbQueryPromise: (perPage: number) => Promise<T[]>,
	perPage: number
): Promise<PaginatedResponse<T>> {
	const valueWithExtra = await dbQueryPromise(perPage + 1);
	const hasNextPage = valueWithExtra.length > perPage;
	return { hasNextPage, value: hasNextPage ? valueWithExtra.slice(0, -1) : valueWithExtra };
}
