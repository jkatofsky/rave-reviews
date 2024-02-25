'use client';

import { Genre, Organizer, Prisma } from '@prisma/client';
import { Button, Divider, Group, MultiSelect, Stack, Text } from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

import { OrganizerQuery } from '../../lib/organizer';
import { OrganizerList } from './OrganizerList';
import { CreateOrganizerModal } from './CreateOrganizerModal';
import { SortingButon } from '../sorting';
import { enumToSelectData } from '../../util';

interface OrganizersProps {
	initialOrganizers: Organizer[];
	getOrganizers: (organizerQuery: OrganizerQuery) => Promise<Organizer[]>;
	createOrganizer: (organizer: Organizer) => Promise<void>;
}

export function Organizers({ initialOrganizers, getOrganizers, createOrganizer }: OrganizersProps) {
	const [organizers, setOrganizers] = useState<Organizer[]>(initialOrganizers);

	// TODO: do the query params here too, like in OrganizerReviews
	const [orderBy, setOrderBy] = useState<{
		orderByField: keyof Organizer;
		sortOrder: Prisma.SortOrder;
	}>({
		orderByField: 'overallRating',
		sortOrder: Prisma.SortOrder.desc,
	});
	const [topGenresToFilter, setTopGenresToFilter] = useState<Genre[]>([]);

	const [opened, { open, close }] = useDisclosure(false);

	useDidUpdate(() => {
		async function updateOrganizers() {
			const organizers = await getOrganizers({
				page: 0,
				orderBy: {
					[orderBy.orderByField]: { sort: orderBy.sortOrder, nulls: 'last' },
				},
				topGenresToFilter,
			});
			setOrganizers(organizers);
		}
		updateOrganizers();
	}, [orderBy, JSON.stringify(topGenresToFilter)]);

	return (
		<Stack p="sm" w={800}>
			<CreateOrganizerModal opened={opened} onClose={close} onCreateOrganizer={createOrganizer} />
			<Button onClick={open} variant="gradient" gradient={{ from: 'blue', to: 'purple' }}>
				<Text fw={600}>Add an organizer!</Text>
			</Button>
			<Group>
				<SortingButon<Organizer>
					orderByField="overallRating"
					label="Rating"
					onClick={({ orderByField, sortOrder }) => {
						setOrderBy({ orderByField, sortOrder });
					}}
					currentOrderBy={orderBy}
				/>
				<Divider orientation="vertical" />
				<MultiSelect
					data={enumToSelectData(Genre)}
					searchable
					value={topGenresToFilter}
					onChange={(value) => {
						setTopGenresToFilter(value as Genre[]);
					}}
					placeholder="Filter by genre"
				/>
			</Group>
			<OrganizerList organizers={organizers} />
		</Stack>
	);
}
