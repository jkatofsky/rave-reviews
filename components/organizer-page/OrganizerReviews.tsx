'use client';

import { Organizer, Review } from '@prisma/client';
import { Button, Stack, Text } from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

import { ReviewQuery } from '../../lib/review';
import CreateReviewModal from './CreateReviewModal';
import OrganizerReviewsList from './OrganizerReviewsList';

export interface OrganizerReviewsProps {
	organizer: Organizer;
	initialReviews: Review[];
	getReviews: (reviewQuery: ReviewQuery) => Promise<Review[]>;
	onCreateReview: (review: Review) => Promise<void>;
}

export function OrganizerReviews({
	organizer,
	initialReviews,
	getReviews,
	onCreateReview,
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

	return (
		<Stack>
			<CreateReviewModal
				opened={opened}
				organizer={organizer}
				onClose={close}
				onCreateReview={onCreateReview}
			/>
			<Button onClick={open}>
				<Text fw={600}>Add your review!</Text>
			</Button>
			<OrganizerReviewsList reviews={reviews} />
		</Stack>
	);
}
