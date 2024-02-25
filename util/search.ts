import { ReadonlyURLSearchParams } from 'next/navigation';
import { Prisma } from '@prisma/client';

export type NextServerSearchParams = { [key: string]: string | string[] | undefined };

function getGeneralSearchParams(
	searchParams: ReadonlyURLSearchParams | NextServerSearchParams
): NextServerSearchParams {
	return searchParams instanceof ReadonlyURLSearchParams
		? Object.fromEntries(searchParams)
		: searchParams;
}

export function getInitialReviewSearchParams(
	searchParams: ReadonlyURLSearchParams | NextServerSearchParams
): URLSearchParams {
	const generalSearchParams = getGeneralSearchParams(searchParams);

	//TODO: what to do when we need to deal with arrays?
	const initialSearchParams = new URLSearchParams();
	initialSearchParams.set('page', (generalSearchParams['page'] as string) || '0');
	initialSearchParams.set(
		'orderByField',
		(generalSearchParams['orderByField'] as string) || 'createdAt'
	);
	initialSearchParams.set(
		'sortOrder',
		(generalSearchParams['sortOrder'] as string) || Prisma.SortOrder.desc
	);

	return initialSearchParams;
}
