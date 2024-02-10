import { Divider, Group, Stack, Text } from '@mantine/core';
import { Review } from '@prisma/client';

import { Card } from '../card';
import { GenrePill } from '../genre-pill';
import { RatingList } from '../rating';

// TODO: make the review collapsable/expandable as needed
function ReviewCard({ review }: { review: Review }) {
	return (
		<Card>
			{review.description && (
				<>
					<Text>{review.description}</Text>
					<Divider mt="xs" mb="xs" />
				</>
			)}
			{review.genres.length > 0 && (
				<>
					<Group>
						<Text fw={600}>Genres</Text>
						{review.genres.map((genre, index) => (
							<GenrePill genre={genre} key={index} />
						))}
					</Group>
					<Divider mt="xs" mb="xs" />
				</>
			)}
			{review.moneySpent && (
				<>
					<Group>
						<Text fw={600}>Money spent</Text>
						<Text>${review.moneySpent}</Text>
					</Group>
					<Divider mt="xs" mb="xs" />
				</>
			)}
			<Group gap="sm">
				<RatingList<Review> objectWithRatings={review} />
			</Group>
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
