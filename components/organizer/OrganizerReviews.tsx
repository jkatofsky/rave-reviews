'use client';

import { Organizer, Review } from '@prisma/client';
import { Button, Group, Stack, Text } from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useQueryStates } from 'nuqs';

import { ReviewQuery } from '../../lib/review';
import { CreateReviewModal, ReviewList } from '../review';
import { SortingButon } from '../sorting';
import { reviewOrderByParser, reviewPageParser } from '../../util';

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

	const [{ page }, setPage] = useQueryStates(reviewPageParser);
	const [orderBy, setOrderBy] = useQueryStates(reviewOrderByParser);

	useDidUpdate(() => {
		async function updateReviews() {
			const updatedReviews = await getReviews({
				organizerId: organizer.id,
				page: page,
				orderBy: { [orderBy.orderByField]: orderBy.sortOrder },
			});
			setReviews(updatedReviews);
		}
		updateReviews();
	}, [organizer.updatedAt, page, orderBy]);

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
						setOrderBy(orderBy);
					}}
					currentOrderBy={{
						orderByField: orderBy.orderByField as keyof Review,
						sortOrder: orderBy.sortOrder,
					}}
				/>
			</Group>
			{/* TODO: make this a server component and slot it */}
			<ReviewList reviews={reviews} />
		</Stack>
	);
}
