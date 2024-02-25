'use client';

import { Organizer, Review, Prisma } from '@prisma/client';
import { Button, Group, Stack, Text } from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { parseAsInteger, parseAsStringEnum, useQueryState } from 'nuqs';

import { ReviewQuery } from '../../lib/review';
import { CreateReviewModal, ReviewList } from '../review';
import { getInitialReviewSearchParams } from '../../util';
import { SortingButon } from '../sorting';
import { useInitialSearchParams } from '../../hooks/search';

interface OrganizerReviewsProps {
	organizer: Organizer;
	initialReviews: Review[];
	getReviews: (reviewQuery: ReviewQuery) => Promise<Review[]>;
	createReview: (review: Review) => Promise<void>;
}

export function OrganizerReviews({
	organizer,
	initialReviews,
	getReviews,
	createReview,
}: OrganizerReviewsProps) {
	const [reviews, setReviews] = useState<Review[]>(initialReviews);
	const [opened, { open, close }] = useDisclosure(false);

	useInitialSearchParams(getInitialReviewSearchParams);

	const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(0));
	const [orderByField, setOrderByField] = useQueryState('orderByField', {
		defaultValue: 'createdAt',
	});
	const [sortOrder, setSortOrder] = useQueryState(
		'sortOrder',
		parseAsStringEnum<Prisma.SortOrder>(Object.values(Prisma.SortOrder)).withDefault(
			Prisma.SortOrder.desc
		)
	);

	// TODO: after this runs, in DEV mode only, the useQueryState variables reset???!
	useDidUpdate(() => {
		async function updateReviews() {
			const updatedReviews = await getReviews({
				organizerId: organizer.id,
				page: page,
				orderBy: { [orderByField]: sortOrder },
			});
			setReviews(updatedReviews);
		}
		updateReviews();
	}, [organizer.updatedAt, orderByField, sortOrder, page]);

	return (
		<Stack miw={400} p="sm">
			<CreateReviewModal
				opened={opened}
				organizer={organizer}
				onClose={close}
				onCreateReview={createReview}
			/>
			<Button onClick={open} variant="gradient" gradient={{ from: 'blue', to: 'purple' }}>
				<Text fw={600}>Add your review!</Text>
			</Button>
			<Group>
				{/* TODO: more sorting/filtering options */}
				<SortingButon<Review>
					orderByField="createdAt"
					label="Review date"
					onClick={(orderBy) => {
						setOrderByField(orderBy.orderByField);
						setSortOrder(orderBy.sortOrder);
					}}
					currentOrderBy={{
						orderByField: orderByField as keyof Review,
						sortOrder: sortOrder,
					}}
				/>
			</Group>
			<ReviewList reviews={reviews} />
		</Stack>
	);
}
