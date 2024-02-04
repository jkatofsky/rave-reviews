import { Box, Divider, Flex, Group, Stack, Text } from '@mantine/core';
import { Review } from '@prisma/client';

import { Card } from '../card';
import { RATINGS_INFO } from '../../lib/constants';
import { DisplayRating } from '../display-rating';

// TODO: make the review collapsable/expandable as needed
function ReviewCard({ review }: { review: Review }) {
	return (
		<Box mih={250} maw={1000}>
			<Card>
				<Group>
					<Text fw={600}>Description:</Text>
					<Text>{review.description}</Text>
				</Group>
				<Divider mt="xs" mb="xs" />
				<Group>
					<Text fw={600}>Genres:</Text>
					<Text>{review.genres.join(', ')}</Text>
				</Group>
				<Divider mt="xs" mb="xs" />
				<Group>
					<Text fw={600}>Money spent:</Text>
					<Text>{review.moneySpent}</Text>
				</Group>
				<Divider mt="xs" mb="xs" />
				<Flex justify="flex-start" align="center" direction="row" wrap="wrap">
					{/* TODO: extract this list to a generic component */}
					{/* TODO: improve spacing; consider using grid */}
					{[...RATINGS_INFO.entries()].map((rating, index) => (
						<Box key={index} mr="xs">
							<Text>
								<b>{rating[1].title}</b>
							</Text>
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
