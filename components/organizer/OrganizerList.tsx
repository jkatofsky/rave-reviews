'use client';

import { Box, Divider, Flex, Group, Stack, Title, Text } from '@mantine/core';
import { Organizer } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';

import { DisplayRating, RatingList } from '../rating';
import { OrganizerQuery } from '../../lib/organizer';
import { Card } from '../card';
import { GenrePill } from '../genre-pill';
import { humanizeEnumString } from '../../util';

function OrganizerCard({ organizer }: { organizer: Organizer }) {
	return (
		<Box
			component={Link}
			href={`/organizers/${organizer.id}`}
			style={{ textDecoration: 'none' }}
			maw={700}
		>
			<Card>
				<Group justify="space-between">
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
				<Divider mt="sm" mb="sm" />
				<Flex gap="md">
					{organizer.topGenres.map((genre, index) => (
						<GenrePill genre={genre} key={index} />
					))}
				</Flex>
				<Divider mt="sm" mb="sm" />
				<Group gap="sm">
					<RatingList<Organizer> objectWithRatings={organizer} size="sm" />
				</Group>
			</Card>
		</Box>
	);
}
interface OrganizerListProps {
	initialOrganizers: Organizer[];
	getOrganizers: (organizerQuery: OrganizerQuery) => Promise<Organizer[]>;
}

export function OrganizerList({ initialOrganizers, getOrganizers }: OrganizerListProps) {
	const [organizers, setOrganizers] = useState<Organizer[]>(initialOrganizers);

	return (
		<Stack>
			{organizers.map((organizer) => (
				<OrganizerCard key={organizer.id} organizer={organizer} />
			))}
		</Stack>
	);
}
