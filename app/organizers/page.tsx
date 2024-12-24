import { Center } from '@mantine/core';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { cache } from 'react';

import { getOrganizers, createOrganizer } from '@/actions/organizer';
import { getCity } from '@/actions/city';
import { Organizers } from '@/components/organizer';
import { organizerSearchParamParser } from '@/shared/search';
import { CreateOrganizer } from '@/shared/types';
import { organizersDocumentTitle } from '@/shared/metadata';

export const dynamic = 'force-dynamic';

const cachedCityId = cache(
	(searchParams: Record<string, string | string[] | undefined>) =>
		organizerSearchParamParser.cityId.parse(searchParams).cityId
);

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
	const awaitedSearchParams = await searchParams;
	const cityId = cachedCityId(awaitedSearchParams);
	const city = await getCity(cityId);

	return {
		title: organizersDocumentTitle(city),
	};
}

export default async function OrganizersPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const awaitedSearchParams = await searchParams;
	const { page } = organizerSearchParamParser.page.parse(awaitedSearchParams);
	const { orderByField, sortOrder } = organizerSearchParamParser.orderBy.parse(awaitedSearchParams);
	const cityId = cachedCityId(awaitedSearchParams);
	const { topGenres } = organizerSearchParamParser.topGenres.parse(awaitedSearchParams);
	const { expensivenessRange } =
		organizerSearchParamParser.expensivenessRange.parse(awaitedSearchParams);

	const organizers = await getOrganizers({
		page,
		orderBy: {
			[orderByField]: { sort: sortOrder, nulls: 'last' },
		},
		cityId,
		expensivenessRange: expensivenessRange as [number, number],
		topGenres,
	});

	async function createOrganizerAction(organizer: CreateOrganizer) {
		'use server';
		const newOrganizerId = await createOrganizer(organizer);
		redirect(`/organizers/${newOrganizerId}`);
	}

	return (
		<Center>
			<Organizers
				initialOrganizers={organizers}
				getOrganizers={getOrganizers}
				createOrganizer={createOrganizerAction}
			/>
		</Center>
	);
}
