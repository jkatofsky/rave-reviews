import { Center } from '@mantine/core';

import { getOrganizers } from '../../lib/organizer';
import { OrganizerList } from '../../components/organizer-list';

export const metadata = {
	title: 'Organizers | Rave Reviews',
};

export default async function Organizers() {
	// TODO: make these params come from URL
	const organizers = await getOrganizers({ page: 0, perPage: 100 });

	return (
		<Center>
			<OrganizerList initialOrganizers={organizers} getOrganizers={getOrganizers} />
		</Center>
	);
}
