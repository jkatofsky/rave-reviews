'use client';

import { Organizer, Review, Prisma } from '@prisma/client';
import { Button, Group, Stack, Text } from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

import { ReviewQuery } from '../../lib/review';
import { CreateReviewModal, ReviewList } from '../review';
import { DEFAULT_PAGE_SIZE } from '../../util';
import { SortingButon } from '../sorting';

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
	// TODO: put in query params
	const [sortingField, setSortingField] = useState<{
		fieldName: keyof Review;
		sortOrder: Prisma.SortOrder;
	}>({
		fieldName: 'createdAt',
		sortOrder: Prisma.SortOrder.desc,
	});

	useDidUpdate(() => {
		async function updateReviews() {
			const reviews = await getReviews({
				organizerId: organizer.id,
				page: 0,
				perPage: DEFAULT_PAGE_SIZE,
				orderBy: { [sortingField.fieldName]: sortingField.sortOrder },
			});
			setReviews(reviews);
		}
		updateReviews();
	}, [organizer.updatedAt, sortingField]);

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
			{reviews.length > 0 && (
				<Group>
					{/* TODO: more sorting/filtering options */}
					<SortingButon<Review>
						sortingFieldName="createdAt"
						label="Review date"
						setSortingField={setSortingField}
						currentSortingField={sortingField}
					/>
				</Group>
			)}
			<ReviewList reviews={reviews} />
		</Stack>
	);
}
