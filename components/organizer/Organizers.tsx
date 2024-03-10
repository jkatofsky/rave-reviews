'use client';

import { Genre, Organizer } from '@prisma/client';
import {
	Anchor,
	Box,
	Button,
	Collapse,
	Group,
	MultiSelect,
	Stack,
	Text,
	RangeSlider,
} from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useQueryState, useQueryStates } from 'nuqs';

import { OrganizerQuery } from '@/api/organizer';
import { PaginationButtons, SortingButton } from '@/components/search';
import {
	RATINGS_INFO,
	enumToSelectData,
	organizerExpensivenessRangeParser,
	organizerOrderByParser,
	organizerPageParser,
	organizerTopGenresParser,
} from '@/util';

import { OrganizerList } from './OrganizerList';
import { CreateOrganizerModal } from './CreateOrganizerModal';

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
	const [{ expensivenessRange }, setExpensivenessRange] = useQueryStates(
		organizerExpensivenessRangeParser
	);

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
					expensivenessRange: expensivenessRange as [number, number],
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
				{/* TODO: searching! */}
				<Group align="top">
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
					<RangeSlider
						value={expensivenessRange as [number, number]}
						onChange={(value) => {
							setExpensivenessRange({ expensivenessRange: value });
						}}
						min={1}
						max={4}
						step={1}
						minRange={0}
						w={150}
						marks={[
							{ value: 1, label: '$' },
							{ value: 2, label: '$$' },
							{ value: 3, label: '$$$' },
							{ value: 4, label: '$$$$' },
						]}
						label={null}
						thumbSize={20}
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
						clearable
						style={{ flexGrow: 1 }}
					/>
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
