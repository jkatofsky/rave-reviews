import { Box, Divider, Group, Stack, Title, Text } from '@mantine/core';
import { Organizer } from '@prisma/client';
import Link from 'next/link';

import {
	Card,
	GenrePill,
	DisplayRating,
	RatingList,
	DisplayExpensiveness,
} from '@/components/data-display';

import { humanizeEnumString } from '../util';

function OrganizerCard({ organizer }: { organizer: Organizer }) {
	return (
		<Box component={Link} href={`/organizers/${organizer.id}`} style={{ textDecoration: 'none' }}>
			<Card>
				<Stack gap="xs">
					<Group justify="space-between">
						<Group gap="xs">
							<Title order={3} fs="italic" c="black">
								{organizer.name}
							</Title>
							<Divider orientation="vertical" />
							<Text c="gray" fw={400} size="md">
								{humanizeEnumString(organizer.type, false)}
							</Text>
							{organizer.overallExpensiveness && (
								<>
									<Divider orientation="vertical" />
									<DisplayExpensiveness expensiveness={organizer.overallExpensiveness} />
								</>
							)}
						</Group>

						<Box mr="md">
							<DisplayRating
								rating={organizer.overallRating}
								ratingsCount={organizer.reviewCount}
								size="lg"
							/>
						</Box>
					</Group>
					<Divider />
					{organizer.topGenres.length > 0 && (
						<>
							<Group gap="md">
								<Text c="black" fw={600}>
									Top genres
								</Text>
								{organizer.topGenres.map((genre, index) => (
									<GenrePill genre={genre} key={index} />
								))}
							</Group>
							<Divider />
						</>
					)}

					<Group gap="sm">
						<RatingList<Organizer> objectWithRatings={organizer} size="sm" />
					</Group>
				</Stack>
			</Card>
		</Box>
	);
}
export function OrganizerList({ organizers }: { organizers: Organizer[] }) {
	if (!organizers || organizers.length === 0) {
		return (
			<Text c="gray" fs="italic">
				no organizers
			</Text>
		);
	}
	return (
		<Stack>
			{organizers.map((organizer) => (
				<OrganizerCard key={organizer.id} organizer={organizer} />
			))}
		</Stack>
	);
}
