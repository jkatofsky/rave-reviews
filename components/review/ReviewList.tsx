import { Divider, Group, Spoiler, Stack, Text } from '@mantine/core';
import { Review } from '@prisma/client';

import {
	Card,
	RatingList,
	GenrePill,
	Timestamp,
	DisplayExpensiveness,
} from '@/components/data-display';

function ReviewCard({ review }: { review: Review }) {
	return (
		<Card>
			<Stack gap="xs">
				{review.description && (
					<>
						<Spoiler maxHeight={120} showLabel="Expand review" hideLabel="Collapse review">
							<Text>{review.description}</Text>
						</Spoiler>
						<Divider />
					</>
				)}
				{review.genres.length > 0 && (
					<>
						<Group>
							<Text c="black" fw={600}>
								Genres
							</Text>
							{review.genres.map((genre, index) => (
								<GenrePill genre={genre} key={index} />
							))}
						</Group>
						<Divider />
					</>
				)}
				{review.expensiveness && (
					<>
						<DisplayExpensiveness expensiveness={review.expensiveness} />
						<Divider />
					</>
				)}
				<Group gap="sm">
					<RatingList<Review> objectWithRatings={review} />
				</Group>
				<Group>
					<Timestamp label="Reviewed" date={review.createdAt} />
					{review.createdAt.getTime() !== review.updatedAt.getTime() && (
						<Timestamp label="Edited" date={review.updatedAt} />
					)}
				</Group>
			</Stack>
		</Card>
	);
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
	if (!reviews || reviews.length === 0) {
		return (
			<Text c="gray" fs="italic">
				no reviews yet
			</Text>
		);
	}
	return (
		<Stack>
			{reviews.map((review) => (
				<ReviewCard review={review} key={review.id} />
			))}
		</Stack>
	);
}
