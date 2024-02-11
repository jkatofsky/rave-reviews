'use client';

import { Organizer, Review } from '@prisma/client';
import { Button, Stack, Text } from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

import { ReviewQuery } from '../../lib/review';
import { CreateReviewModal, ReviewList } from '../review';
import { SortingDirection } from '../../util';

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

	useDidUpdate(() => {
		async function updateReviews() {
			const reviews = await getReviews({
				organizerId: organizer.id,
				page: 0,
				perPage: 100,
				sortingFields: [{ createdAt: SortingDirection.DESCENDING }],
			});
			setReviews(reviews);
		}
		updateReviews();
	}, [organizer.updatedAt]);

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
			<ReviewList reviews={reviews} />
		</Stack>
	);
}
