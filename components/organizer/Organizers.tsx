'use client';

import { Genre, Organizer } from '@prisma/client';
import { Button, Divider, Group, MultiSelect, Stack, Text } from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useQueryStates } from 'nuqs';

import { OrganizerQuery } from '../../lib/organizer';
import { OrganizerList } from './OrganizerList';
import { CreateOrganizerModal } from './CreateOrganizerModal';
import { SortingButon } from '../sorting';
import {
	enumToSelectData,
	organizerOrderByParser,
	organizerPageParser,
	organizerTopGenresParser,
} from '../../util';

interface OrganizersProps {
	initialOrganizers: Organizer[];
	getOrganizers: (organizerQuery: OrganizerQuery) => Promise<Organizer[]>;
	createOrganizer: (organizer: Organizer) => Promise<void>;
}

export function Organizers({ initialOrganizers, getOrganizers, createOrganizer }: OrganizersProps) {
	const [organizers, setOrganizers] = useState<Organizer[]>(initialOrganizers);
	const [opened, { open, close }] = useDisclosure(false);

	const [{ page }, setPage] = useQueryStates(organizerPageParser);
	const [orderBy, setOrderBy] = useQueryStates(organizerOrderByParser);
	const [{ topGenres }, setTopGenres] = useQueryStates(organizerTopGenresParser);

	useDidUpdate(() => {
		async function updateOrganizers() {
			const organizers = await getOrganizers({
				page,
				orderBy: {
					[orderBy.orderByField]: { sort: orderBy.sortOrder, nulls: 'last' },
				},
				topGenres,
			});
			setOrganizers(organizers);
		}
		updateOrganizers();
	}, [page, orderBy, topGenres]);

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
					currentOrderBy={{
						orderByField: orderBy.orderByField as keyof Organizer,
						sortOrder: orderBy.sortOrder,
					}}
				/>
				<Divider orientation="vertical" />
				<MultiSelect
					data={enumToSelectData(Genre)}
					searchable
					value={topGenres}
					onChange={(value) => {
						setTopGenres({ topGenres: value as Genre[] });
					}}
					placeholder="Filter by genre"
				/>
			</Group>
			{/* TODO: make this a server component and slot it */}
			<OrganizerList organizers={organizers} />
		</Stack>
	);
}
