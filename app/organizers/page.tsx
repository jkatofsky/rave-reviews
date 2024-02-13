import { Center } from '@mantine/core';
import { Organizer, Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';

import { getOrganizers, createOrganizer } from '../../lib/organizer';
import { Organizers } from '../../components/organizer';
import { DEFAULT_PAGE_SIZE } from '../../util';

export const dynamic = 'force-dynamic';

export const metadata = {
	title: 'Organizers | Rave Reviews',
};

// TODO: organizer text + location search. Also in the client component
export default async function OrganizersPage() {
	// TODO: figure out how to make this use the same query params as client component
	const organizers = await getOrganizers({
		page: 0,
		perPage: DEFAULT_PAGE_SIZE,
		sortingFields: [
			{
				overallRating: Prisma.SortOrder.desc,
			},
		],
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
