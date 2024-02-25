import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { NextServerSearchParams } from '../util';

export function useInitialSearchParams(
	getInitialParams: (
		searchParams: ReadonlyURLSearchParams | NextServerSearchParams
	) => URLSearchParams
) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	useEffect(() => {
		router.push(`${pathname}?${getInitialParams(searchParams).toString()}`);
	}, []);
}
