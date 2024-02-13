'use client';

import { Organizer, Prisma } from '@prisma/client';
import { Button, Group, Stack, Text } from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

import { OrganizerQuery } from '../../lib/organizer';
import { OrganizerList } from './OrganizerList';
import { CreateOrganizerModal } from './CreateOrganizerModal';
import { SortingButon } from '../sorting';
import { DEFAULT_PAGE_SIZE } from '../../util';

interface OrganizersProps {
	initialOrganizers: Organizer[];
	getOrganizers: (organizerQuery: OrganizerQuery) => Promise<Organizer[]>;
	createOrganizer: (organizer: Organizer) => Promise<void>;
}

export function Organizers({ initialOrganizers, getOrganizers, createOrganizer }: OrganizersProps) {
	const [organizers, setOrganizers] = useState<Organizer[]>(initialOrganizers);
	const [opened, { open, close }] = useDisclosure(false);
	// TODO: put in query params
	const [sortingField, setSortingField] = useState<{
		fieldName: keyof Organizer;
		sortOrder: Prisma.SortOrder;
	}>({
		fieldName: 'overallRating',
		sortOrder: Prisma.SortOrder.desc,
	});

	useDidUpdate(() => {
		async function updateOrganizers() {
			const reviews = await getOrganizers({
				page: 0,
				perPage: DEFAULT_PAGE_SIZE,
				sortingFields: [{ [sortingField.fieldName]: sortingField.sortOrder }],
			});
			setOrganizers(reviews);
		}
		updateOrganizers();
	}, [sortingField]);

	return (
		<Stack miw={400} p="sm">
			<CreateOrganizerModal opened={opened} onClose={close} onCreateOrganizer={createOrganizer} />
			<Button onClick={open} variant="gradient" gradient={{ from: 'blue', to: 'purple' }}>
				<Text fw={600}>Add an organizer!</Text>
			</Button>
			<Group>
				{/* TODO: more sorting/filtering options */}
				<SortingButon<Organizer>
					sortingFieldName="overallRating"
					label="Rating"
					setSortingField={setSortingField}
					currentSortingField={sortingField}
				/>
			</Group>
			<OrganizerList organizers={organizers} />
		</Stack>
	);
}
