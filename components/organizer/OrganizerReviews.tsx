'use client';

import { Organizer, Review } from '@prisma/client';
import { Button, Group, Stack, Text } from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useQueryStates } from 'nuqs';

import { ReviewQuery } from '@/data/review';
import { CreateReviewModal, ReviewList } from '@/components/review';
import { PaginationButtons, SortingButton } from '@/components/search';
import { reviewOrderByParser, reviewPageParser } from '@/shared/search';
import { PaginatedResponse } from '@/shared/types';

interface OrganizerReviewsProps {
	organizer: Organizer;
	initialReviews: PaginatedResponse<Review>;
	getReviews: (reviewQuery: ReviewQuery) => Promise<PaginatedResponse<Review>>;
	createReview: (review: Review) => Promise<void>;
}

export function OrganizerReviews({
	organizer,
	initialReviews,
	getReviews,
	createReview,
}: OrganizerReviewsProps) {
	const [reviews, setReviews] = useState<Review[]>(initialReviews.value);
	const [opened, { open, close }] = useDisclosure(false);

	const [{ page }, setPage] = useQueryStates(reviewPageParser);
	const [hasNextPage, setHasNextPage] = useState<boolean>(initialReviews.hasNextPage);
	const [orderBy, setOrderBy] = useQueryStates(reviewOrderByParser);

	useDidUpdate(() => {
		async function updateReviews() {
			const { value: updatedReviews, hasNextPage: updatedHasNextPage } = await getReviews({
				organizerId: organizer.id,
				page: page,
				orderBy: { [orderBy.orderByField]: orderBy.sortOrder },
			});
			setReviews(updatedReviews);
			setHasNextPage(updatedHasNextPage);
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
				<Text fw={600}>Add your review of {organizer.name}</Text>
			</Button>
			{organizer.reviewCount > 0 && (
				<>
					<Group>
						{/* TODO: more sorting/filtering options */}
						<SortingButton<Review>
							orderByField="createdAt"
							label="Review date"
							onClick={(orderBy) => {
								setOrderBy(orderBy);
								setPage({ page: 0 });
							}}
							currentOrderBy={{
								orderByField: orderBy.orderByField as keyof Review,
								sortOrder: orderBy.sortOrder,
							}}
						/>
					</Group>
					{/* TODO: make this a server component and slot it */}
					<ReviewList reviews={reviews} />
					<PaginationButtons page={page} setPage={setPage} hasNextPage={hasNextPage} />
				</>
			)}
		</Stack>
	);
}
