import { Box, Divider, Flex, Group, Stack, Text } from '@mantine/core';
import { Review } from '@prisma/client';

import { Card } from '../card';
import { RATINGS_INFO } from '../../lib/constants';
import { DisplayRating } from '../display-rating';
import { GenrePill } from '../genre-pill';

// TODO: make the review collapsable/expandable as needed
function ReviewCard({ review }: { review: Review }) {
	return (
		<Box mih={250} maw={700}>
			<Card>
				<Text>{review.description}</Text>
				<Divider mt="xs" mb="xs" />
				<Group>
					<Text fw={600}>Genres:</Text>
					{review.genres.map((genre, index) => (
						<GenrePill genre={genre} key={index} />
					))}
				</Group>
				<Divider mt="xs" mb="xs" />
				{review.moneySpent && (
					<>
						<Group>
							<Text fw={600}>Money spent:</Text>
							<Text>${review.moneySpent}</Text>
						</Group>
						<Divider mt="xs" mb="xs" />
					</>
				)}
				<Flex justify="flex-start" align="center" direction="row" wrap="wrap" gap="sm">
					{/* TODO: extract this list to a generic component */}
					{[...RATINGS_INFO.entries()].map((rating, index) => (
						<Box key={index}>
							<Text fw={600}>{rating[1].title}</Text>
							<DisplayRating rating={review[rating[0] as keyof Review] as number} />
						</Box>
					))}
				</Flex>
			</Card>
		</Box>
	);
}

export default function OrganizerReviewsList({ reviews }: { reviews: Review[] }) {
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
