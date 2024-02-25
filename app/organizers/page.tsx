import { Center } from '@mantine/core';
import { Organizer } from '@prisma/client';
import { redirect } from 'next/navigation';

import { getOrganizers, createOrganizer } from '../../lib/organizer';
import { Organizers } from '../../components/organizer';
import { organizerSearchParamParser } from '../../util';

export const dynamic = 'force-dynamic';

export const metadata = {
	title: 'Organizers | Rave Reviews',
};

// TODO: organizer name text + location search
export default async function OrganizersPage({
	searchParams,
}: {
	searchParams: Record<string, string | string[] | undefined>;
}) {
	const { page } = organizerSearchParamParser.page.parse(searchParams);
	const { orderByField, sortOrder } = organizerSearchParamParser.orderBy.parse(searchParams);
	const { topGenres } = organizerSearchParamParser.topGenres.parse(searchParams);

	const organizers = await getOrganizers({
		page,
		orderBy: {
			[orderByField]: { sort: sortOrder, nulls: 'last' },
		},
		topGenres,
	});

	async function createOrganizerAction(organizer: Organizer) {
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
