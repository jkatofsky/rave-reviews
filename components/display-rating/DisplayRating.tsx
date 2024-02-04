import { Group, Rating as MantineRating, Text } from '@mantine/core';

export interface RatingProps {
	rating: number | null;
	ratingsCount?: number | null;
}

export function DisplayRating({ rating, ratingsCount }: RatingProps) {
	return rating !== null ? (
		<Group gap="xs" wrap="nowrap">
			<Text c="gray">{rating.toFixed(1)}</Text>
			<MantineRating value={rating} count={5} readOnly fractions={3} />
			{ratingsCount && <Text c="gray">({ratingsCount})</Text>}
		</Group>
	) : (
		<Text c="gray" fs="italic">
			no rating yet
		</Text>
	);
}
