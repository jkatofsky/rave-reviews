import { Center } from '@mantine/core';
import { redirect } from 'next/navigation';

import { getOrganizers, createOrganizer } from '@/data/organizer';
import { Organizers } from '@/components/organizer';
import { organizerSearchParamParser } from '@/shared/search';
import { CreateOrganizer } from '@/shared/types';

export const dynamic = 'force-dynamic';

export const metadata = {
	title: 'Organizers | Rave Reviews',
};

export default async function OrganizersPage({
	searchParams,
}: {
	searchParams: Record<string, string | string[] | undefined>;
}) {
	const { page } = organizerSearchParamParser.page.parse(searchParams);
	const { orderByField, sortOrder } = organizerSearchParamParser.orderBy.parse(searchParams);
	const { cityId } = organizerSearchParamParser.cityId.parse(searchParams);
	const { topGenres } = organizerSearchParamParser.topGenres.parse(searchParams);
	const { expensivenessRange } = organizerSearchParamParser.expensivenessRange.parse(searchParams);

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
