import { Box, Divider, Flex, Group, Space, Stack, Text, Title } from '@mantine/core';
import { Organizer } from '@prisma/client';
import Link from 'next/link';

import { DisplayRating } from '../ratings';
import { GenrePill } from '../genre-pill';
import { RatingList } from '../ratings';

export function OrganizerInfo({ organizer }: { organizer: Organizer }) {
	return (
		<Stack gap={0} miw={200} maw={400}>
			<Flex gap="xs" align="flex-end" mb="sm">
				<Link href="/organizers">
					<Text c="gray">organizers</Text>
				</Link>
				<Text c="gray">/</Text>
				<Title fs="italic" order={1} lh={1}>
					{organizer.name}
				</Title>
			</Flex>
			<Group gap="xs" mb="sm">
				<Text fw={600}>Top genres:</Text>
				{organizer.topGenres.map((genre, index) => (
					<GenrePill genre={genre} key={index} />
				))}
			</Group>
			<DisplayRating
				rating={organizer.overallRating}
				ratingsCount={organizer.reviewCount}
				size="lg"
			/>

			<Divider mt="md" mb="md" />

			<Group gap="lg">
				<RatingList<Organizer> objectWithRatings={organizer} />
			</Group>
		</Stack>
	);
}
