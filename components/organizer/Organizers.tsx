'use client';

import { Genre, Organizer } from '@prisma/client';
import { Anchor, Box, Button, Collapse, Group, MultiSelect, Stack, Text } from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useQueryStates } from 'nuqs';

import { OrganizerQuery } from '../../lib/organizer';
import { OrganizerList } from './OrganizerList';
import { CreateOrganizerModal } from './CreateOrganizerModal';
import { PaginationButtons, SortingButton } from '../search';
import {
	RATINGS_INFO,
	enumToSelectData,
	organizerOrderByParser,
	organizerPageParser,
	organizerTopGenresParser,
} from '../../util';

interface OrganizersProps {
	initialOrganizers: { hasNextPage: boolean; organizers: Organizer[] };
	getOrganizers: (
		organizerQuery: OrganizerQuery
	) => Promise<{ hasNextPage: boolean; organizers: Organizer[] }>;
	createOrganizer: (organizer: Organizer) => Promise<void>;
}

export function Organizers({ initialOrganizers, getOrganizers, createOrganizer }: OrganizersProps) {
	const [organizers, setOrganizers] = useState<Organizer[]>(initialOrganizers.organizers);
	const [isCreateOrganizerModalOpen, createOrganizerModalController] = useDisclosure(false);

	const [{ page }, setPage] = useQueryStates(organizerPageParser);
	const [hasNextPage, setHasNextPage] = useState<boolean>(initialOrganizers.hasNextPage);
	const [orderBy, setOrderBy] = useQueryStates(organizerOrderByParser);
	const [{ topGenres }, setTopGenres] = useQueryStates(organizerTopGenresParser);

	const [isRatingCategorySortingExpanded, isRatingCategorySortingExpandedController] =
		useDisclosure(RATINGS_INFO.has(orderBy.orderByField));

	useDidUpdate(() => {
		async function updateOrganizers() {
			const { organizers: updatedOrganizers, hasNextPage: updatedHasNextPage } =
				await getOrganizers({
					page,
					orderBy: {
						[orderBy.orderByField]: { sort: orderBy.sortOrder, nulls: 'last' },
					},
					topGenres,
				});
			setOrganizers(updatedOrganizers);
			setHasNextPage(updatedHasNextPage);
		}
		updateOrganizers();
	}, [page, orderBy, topGenres]);

	return (
		<Stack p="sm" w={800}>
			<CreateOrganizerModal
				opened={isCreateOrganizerModalOpen}
				onClose={createOrganizerModalController.close}
				onCreateOrganizer={createOrganizer}
			/>
			<Button
				onClick={createOrganizerModalController.open}
				variant="gradient"
				gradient={{ from: 'blue', to: 'purple' }}
			>
				<Text fw={600}>Add an organizer!</Text>
			</Button>
			<Box>
				<Group grow>
					{/* TODO: put a search bar right here! */}
					<Group grow>
						<SortingButton<Organizer>
							orderByField="overallRating"
							label="Rating"
							onClick={({ orderByField, sortOrder }) => {
								setOrderBy({ orderByField, sortOrder });
								setPage({ page: 0 });
							}}
							currentOrderBy={{
								orderByField: orderBy.orderByField as keyof Organizer,
								sortOrder: orderBy.sortOrder,
							}}
						/>
						<MultiSelect
							data={enumToSelectData(Genre)}
							searchable
							value={topGenres}
							onChange={(value) => {
								setTopGenres({ topGenres: value as Genre[] });
								setPage({ page: 0 });
							}}
							placeholder="Filter by genre"
						/>
					</Group>
				</Group>

				<Anchor
					mt="xs"
					mb="xs"
					component="button"
					onClick={isRatingCategorySortingExpandedController.toggle}
				>
					Sort by rating category
				</Anchor>
				<Collapse in={isRatingCategorySortingExpanded}>
					<Group gap="xs">
						{[...RATINGS_INFO.entries()].map((ratingInfo, index) => (
							<SortingButton<Organizer>
								key={index}
								orderByField={ratingInfo[0] as keyof Organizer}
								label={ratingInfo[1].title}
								onClick={({ orderByField, sortOrder }) => {
									setOrderBy({ orderByField, sortOrder });
									setPage({ page: 0 });
								}}
								currentOrderBy={{
									orderByField: orderBy.orderByField as keyof Organizer,
									sortOrder: orderBy.sortOrder,
								}}
							/>
						))}
					</Group>
				</Collapse>
			</Box>

			{/* TODO: make this a server component and slot it */}
			<OrganizerList organizers={organizers} />

			<PaginationButtons page={page} setPage={setPage} hasNextPage={hasNextPage} />
		</Stack>
	);
}
