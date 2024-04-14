'use client';

import { Organizer, Review } from '@prisma/client';
import { Button, Group, Stack, Text } from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { useQueryStates } from 'nuqs';
import { useQuery } from '@tanstack/react-query';

import { ReviewQuery } from '@/data/review';
import { CreateReviewModal, ReviewList } from '@/components/review';
import { PaginationButtons, SortingButton } from '@/components/search';
import { reviewOrderByParser, reviewPageParser } from '@/shared/search';
import { CreateReview, PaginatedResponse } from '@/shared/types';

interface OrganizerReviewsProps {
	organizer: Organizer;
	initialReviews: PaginatedResponse<Review>;
	getReviews: (reviewQuery: ReviewQuery) => Promise<PaginatedResponse<Review>>;
	createReview: (review: CreateReview) => Promise<void>;
}

export function OrganizerReviews({
	organizer,
	initialReviews,
	getReviews,
	createReview,
}: OrganizerReviewsProps) {
	const [createReviewModalOpened, { open: openCreateReviewModal, close: closeCreateReviewModal }] =
		useDisclosure(false);

	const [{ page }, setPage] = useQueryStates(reviewPageParser);
	const [orderBy, setOrderBy] = useQueryStates(reviewOrderByParser);

	const [debouncedOrderBy] = useDebouncedValue(orderBy, 200, { leading: true });
	const {
		data: { value: reviews, hasNextPage },
	} = useQuery<PaginatedResponse<Review>>({
		queryKey: ['reviews', organizer.updatedAt, page, debouncedOrderBy],
		initialData: initialReviews,
		queryFn: async () => {
			const { value, hasNextPage } = await getReviews({
				organizerId: organizer.id,
				page: page,
				orderBy: { [debouncedOrderBy.orderByField]: debouncedOrderBy.sortOrder },
			});
			return { value, hasNextPage };
		},
	});

	return (
		<Stack miw={400} p="sm">
			<CreateReviewModal
				opened={createReviewModalOpened}
				organizer={organizer}
				onClose={closeCreateReviewModal}
				onCreateReview={createReview}
			/>
			<Button
				onClick={openCreateReviewModal}
				variant="gradient"
				gradient={{ from: 'blue', to: 'purple' }}
			>
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
