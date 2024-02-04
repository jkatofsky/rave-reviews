import { Box, Divider, Group, Space, Stack, Text, Title } from '@mantine/core';
import { Organizer } from '@prisma/client';
import Link from 'next/link';

import { DisplayRating } from '../display-rating';
import { RATINGS_INFO } from '../../lib/constants';

export function OrganizerInfo({ organizer }: { organizer: Organizer }) {
	return (
		<Stack gap={0}>
			<Link href="/organizers" style={{ textDecoration: 'none' }}>
				<Text c="gray">organizers /</Text>
			</Link>
			<Title fs="italic" order={1} mb="sm">
				{organizer?.name}
			</Title>
			<Group mb="sm">
				<Text fw={600}>Top genres:</Text>
				<Text>{organizer.topGenres.join(', ')}</Text>
			</Group>
			<Text fw={600}>Overall rating</Text>
			<DisplayRating rating={organizer.overallRating} ratingsCount={organizer.reviewCount} />
			<Divider mt="sm" mb="sm" />
			{/* TODO: make these format not in a column when it's skinnier */}
			{/* TODO: make the stars bigger */}
			{[...RATINGS_INFO.entries()].map((rating, index) => (
				<Box key={index}>
					<Text fw={600}>{rating[1].title}</Text>
					<DisplayRating rating={organizer[rating[0] as keyof Organizer] as number} />
					<Space h="xs" />
				</Box>
			))}
		</Stack>
	);
}
