import { Box, Divider, Group, Stack, Title, Text } from '@mantine/core';
import { Organizer } from '@prisma/client';
import Link from 'next/link';

import { DisplayRating, RatingList } from '../rating';
import { Card, GenrePill } from '../data-display';
import { humanizeEnumString } from '../../util';

function OrganizerCard({ organizer }: { organizer: Organizer }) {
	return (
		<Box
			component={Link}
			href={`/organizers/${organizer.id}`}
			style={{ textDecoration: 'none' }}
			maw={800}
		>
			<Card>
				<Group justify="space-between" mb="sm">
					<Group gap="xs">
						<Title order={3} fs="italic" c="black">
							{organizer.name}
						</Title>
						<Divider orientation="vertical" />
						<Text c="gray" fw={400} size="md">
							{humanizeEnumString(organizer.type, false)}
						</Text>
					</Group>

					<Box mr="md">
						<DisplayRating
							rating={organizer.overallRating}
							ratingsCount={organizer.reviewCount}
							size="lg"
						/>
					</Box>
				</Group>
				<Divider mb="sm" />
				{organizer.topGenres.length > 0 && (
					<>
						<Group gap="md">
							{organizer.topGenres.map((genre, index) => (
								<GenrePill genre={genre} key={index} />
							))}
						</Group>
						<Divider mt="sm" />
					</>
				)}
				<Group gap="sm" mt="sm">
					<RatingList<Organizer> objectWithRatings={organizer} size="sm" />
				</Group>
			</Card>
		</Box>
	);
}
export function OrganizerList({ organizers }: { organizers: Organizer[] }) {
	return (
		<Stack>
			{organizers.map((organizer) => (
				<OrganizerCard key={organizer.id} organizer={organizer} />
			))}
		</Stack>
	);
}
