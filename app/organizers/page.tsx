import { Organizer } from '@prisma/client';
import { Center, Paper, Stack, Title, Rating } from '@mantine/core';
import Link from 'next/link';

import { getOrganizers } from '../../lib/organizer';

export const metadata = {
	title: 'Organizers | Rave Radar',
};

// TODO: when it's supported, render the top genres as badges (each with its own assigned color) and the # of reviews
function OrganizerCard({ organizer }: { organizer: Organizer }) {
	return (
		// TODO make this the DEFAULT styles for Paper...
		<Paper
			radius="md"
			bg="gray.1"
			withBorder
			p="lg"
			component={Link}
			href={`/organizers/${organizer.id}`}
		>
			<Title order={3} c="black">
				{organizer.name}
			</Title>
			{organizer.overallRating && (
				<Rating value={organizer.overallRating} count={10} readOnly fractions={5} />
			)}
		</Paper>
	);
}

export default async function Organizers() {
	const organizers = await getOrganizers({ page: 0, perPage: 100 });

	// TODO: migrate to client component to search the organizers
	return (
		<Center>
			<Stack>
				{organizers.map((organizer) => (
					<OrganizerCard key={organizer.id} organizer={organizer} />
				))}
			</Stack>
		</Center>
	);
}
