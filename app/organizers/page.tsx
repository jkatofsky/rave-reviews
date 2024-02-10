import { Center } from '@mantine/core';
import { Organizer } from '@prisma/client';
import { redirect } from 'next/navigation';

import { getOrganizers, createOrganizer } from '../../lib/organizer';
import { Organizers } from '../../components/organizer';

export const metadata = {
	title: 'Organizers | Rave Reviews',
};

export default async function OrganizersPage() {
	// TODO: make these params come from URL
	const organizers = await getOrganizers({ page: 0, perPage: 100 });

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
