import { Center } from '@mantine/core';
import { Organizer } from '@prisma/client';
import { redirect } from 'next/navigation';

import { getOrganizers, createOrganizer } from '../../lib/organizer';
import { Organizers } from '../../components/organizer';
import { SortingDirection } from '../../util';

export const dynamic = 'force-dynamic';

export const metadata = {
	title: 'Organizers | Rave Reviews',
};

// TODO: organizer sorting, with query params, etc. Also in the client component
// TODO: organizer text + location search. Also in the client component
export default async function OrganizersPage() {
	const organizers = await getOrganizers({
		page: 0,
		perPage: 100,
		sortingFields: [{ createdAt: SortingDirection.DESCENDING }],
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
