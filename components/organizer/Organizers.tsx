'use client';

import { City, Genre, Organizer } from '@prisma/client';
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
import { useQueryStates } from 'nuqs';

import { OrganizerQuery } from '@/data/organizer';
import { CitySuggest, PaginationButtons, SortingButton } from '@/components/search';
import { RATINGS_INFO } from '@/shared/constants';
import {
	organizerCityParser,
	organizerExpensivenessRangeParser,
	organizerOrderByParser,
	organizerPageParser,
	organizerTopGenresParser,
} from '@/shared/search';
import { CreateOrganizer, OrganizerWithLocations, PaginatedResponse } from '@/shared/types';

import { enumToSelectData } from '../util';
import { OrganizerList } from './OrganizerList';
import { CreateOrganizerModal } from './CreateOrganizerModal';
import { organizersDocumentTitle } from '@/shared/metadata';

interface OrganizersProps {
	initialOrganizers: PaginatedResponse<OrganizerWithLocations>;
	getOrganizers: (
		organizerQuery: OrganizerQuery
	) => Promise<PaginatedResponse<OrganizerWithLocations>>;
	createOrganizer: (organizer: CreateOrganizer) => Promise<void>;
}

export function Organizers({ initialOrganizers, getOrganizers, createOrganizer }: OrganizersProps) {
	const [organizers, setOrganizers] = useState<OrganizerWithLocations[]>(initialOrganizers.value);
	const [isCreateOrganizerModalOpen, createOrganizerModalController] = useDisclosure(false);

	const [{ page }, setPage] = useQueryStates(organizerPageParser);
	const [hasNextPage, setHasNextPage] = useState<boolean>(initialOrganizers.hasNextPage);

	const [orderBy, setOrderBy] = useQueryStates(organizerOrderByParser);
	const [selectedCity, setSelectedCity] = useState<City | null>(null);
	const [{ cityId }, setCityId] = useQueryStates(organizerCityParser);
	const [{ topGenres }, setTopGenres] = useQueryStates(organizerTopGenresParser);
	const [{ expensivenessRange }, setExpensivenessRange] = useQueryStates(
		organizerExpensivenessRangeParser
	);

	const [isRatingCategorySortingExpanded, isRatingCategorySortingExpandedController] =
		useDisclosure(RATINGS_INFO.has(orderBy.orderByField));

	useDidUpdate(() => {
		async function updateOrganizers() {
			const { value: updatedOrganizers, hasNextPage: updatedHasNextPage } = await getOrganizers({
				page,
				orderBy: {
					[orderBy.orderByField]: { sort: orderBy.sortOrder, nulls: 'last' },
				},
				cityId,
				expensivenessRange: expensivenessRange as [number, number],
				topGenres,
			});
			setOrganizers(updatedOrganizers);
			setHasNextPage(updatedHasNextPage);
		}
		updateOrganizers();
	}, [page, orderBy, topGenres, cityId, expensivenessRange]);

	useDidUpdate(() => {
		document.title = organizersDocumentTitle(selectedCity);
	}, [selectedCity?.id]);

	return (
		<Stack p="sm" w={800}>
			<CreateOrganizerModal
				opened={isCreateOrganizerModalOpen}
				onClose={createOrganizerModalController.close}
				onCreateOrganizer={createOrganizer}
			/>
			{/* TODO: make fixed top-right on desktop; and do a different design with useMediaQuery */}
			<Button
				onClick={createOrganizerModalController.open}
				variant="gradient"
				gradient={{ from: 'blue', to: 'purple' }}
			>
				<Text fw={600}>Add an organizer!</Text>
			</Button>
			<Box>
				{/* TODO: searching! */}
				<Group align="top" grow>
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
					<Box miw={250}>
						<CitySuggest
							onSelect={(city) => {
								setCityId({ cityId: city?.id || '' });
								setSelectedCity(city);
							}}
							initialCityId={cityId}
							placeholder="Filter by city"
						/>
					</Box>
					<RangeSlider
						value={expensivenessRange as [number, number]}
						onChange={(value) => {
							setExpensivenessRange({ expensivenessRange: value });
						}}
						min={1}
						max={4}
						step={1}
						minRange={0}
						marks={[
							{ value: 1, label: '$' },
							{ value: 2, label: '$$' },
							{ value: 3, label: '$$$' },
							{ value: 4, label: '$$$$' },
						]}
						label={null}
						thumbSize={20}
						miw={150}
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
						miw={200}
					/>
				</Group>

				{/* TODO: make it clear which filter is applied when collapsed */}
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
