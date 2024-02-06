'use client';

import { Box, Stack, Title } from '@mantine/core';
import { Organizer } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';

import { DisplayRating } from '../ratings';
import { OrganizerQuery } from '../../lib/organizer';
import { Card } from '../card';

function OrganizerCard({ organizer }: { organizer: Organizer }) {
	return (
		<Box component={Link} href={`/organizers/${organizer.id}`} style={{ textDecoration: 'none' }}>
			<Card>
				<Title order={3} fs="italic" c="black">
					{organizer.name}
				</Title>
				{organizer.overallRating && (
					<DisplayRating rating={organizer.overallRating} ratingsCount={organizer.reviewCount} />
				)}
			</Card>
		</Box>
	);
}

export interface OrganizerListProps {
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
