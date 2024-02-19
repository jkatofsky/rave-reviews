'use client';

import { Genre, Organizer, Prisma } from '@prisma/client';
import { Button, Divider, Group, MultiSelect, Stack, Text } from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

import { OrganizerQuery } from '../../lib/organizer';
import { OrganizerList } from './OrganizerList';
import { CreateOrganizerModal } from './CreateOrganizerModal';
import { SortingButon } from '../sorting';
import { DEFAULT_PAGE_SIZE, enumToSelectData } from '../../util';

interface OrganizersProps {
	initialOrganizers: Organizer[];
	getOrganizers: (organizerQuery: OrganizerQuery) => Promise<Organizer[]>;
	createOrganizer: (organizer: Organizer) => Promise<void>;
}

export function Organizers({ initialOrganizers, getOrganizers, createOrganizer }: OrganizersProps) {
	const [organizers, setOrganizers] = useState<Organizer[]>(initialOrganizers);

	// TODO: put these two in query params
	const [sortingField, setSortingField] = useState<{
		fieldName: keyof Organizer;
		sortOrder: Prisma.SortOrder;
	}>({
		fieldName: 'overallRating',
		sortOrder: Prisma.SortOrder.desc,
	});
	const [topGenresToFilter, setTopGenresToFilter] = useState<Genre[]>([]);

	const [opened, { open, close }] = useDisclosure(false);

	useDidUpdate(() => {
		async function updateOrganizers() {
			const organizers = await getOrganizers({
				page: 0,
				perPage: DEFAULT_PAGE_SIZE,
				orderBy: {
					[sortingField.fieldName]: { sort: sortingField.sortOrder, nulls: 'last' },
				},
				topGenresToFilter,
			});
			setOrganizers(organizers);
		}
		updateOrganizers();
	}, [sortingField, JSON.stringify(topGenresToFilter)]);

	return (
		<Stack miw={800} p="sm">
			<CreateOrganizerModal opened={opened} onClose={close} onCreateOrganizer={createOrganizer} />
			<Button onClick={open} variant="gradient" gradient={{ from: 'blue', to: 'purple' }}>
				<Text fw={600}>Add an organizer!</Text>
			</Button>
			{organizers.length > 0 && (
				<Group>
					<SortingButon<Organizer>
						sortingFieldName="overallRating"
						label="Rating"
						setSortingField={setSortingField}
						currentSortingField={sortingField}
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
			)}
			<OrganizerList organizers={organizers} />
		</Stack>
	);
}
