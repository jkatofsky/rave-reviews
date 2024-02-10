'use client';

import { Organizer } from '@prisma/client';
import { Button, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

import { OrganizerQuery } from '../../lib/organizer';
import { OrganizerList } from './OrganizerList';
import { CreateOrganizerModal } from './CreateOrganizerModal';

interface OrganizersProps {
	initialOrganizers: Organizer[];
	getOrganizers: (organizerQuery: OrganizerQuery) => Promise<Organizer[]>;
	createOrganizer: (organizer: Organizer) => Promise<void>;
}

export function Organizers({ initialOrganizers, getOrganizers, createOrganizer }: OrganizersProps) {
	const [organizers, setOrganizers] = useState<Organizer[]>(initialOrganizers);
	const [opened, { open, close }] = useDisclosure(false);

	// TODO: organizer searching/sorting

	return (
		<Stack miw={400} p="sm">
			<CreateOrganizerModal opened={opened} onClose={close} onCreateOrganizer={createOrganizer} />
			<Button onClick={open}>
				<Text fw={600}>Add an organizer!</Text>
			</Button>
			<OrganizerList organizers={organizers} />
		</Stack>
	);
}
