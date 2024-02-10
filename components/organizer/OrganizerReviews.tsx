'use client';

import { Organizer, Review } from '@prisma/client';
import { Button, Stack, Text } from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

import { ReviewQuery } from '../../lib/review';
import { CreateReviewModal, ReviewList } from '../review';

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
			// TODO: query params!
			const reviews = await getReviews({ organizerId: organizer.id, page: 0, perPage: 100 });
			setReviews(reviews);
		}
		updateReviews();
	}, [organizer.updatedAt]);

	// TODO: review sorting

	return (
		<Stack miw={400} p="sm">
			<CreateReviewModal
				opened={opened}
				organizer={organizer}
				onClose={close}
				onCreateReview={createReview}
			/>
			<Button onClick={open}>
				<Text fw={600}>Add your review!</Text>
			</Button>
			<ReviewList reviews={reviews} />
		</Stack>
	);
}
