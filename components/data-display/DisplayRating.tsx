import { Group, Rating as MantineRating, MantineSize, Text } from '@mantine/core';

interface DisplayRatingProps {
	rating: number | null;
	ratingsCount?: number | null;
	size?: MantineSize;
}

export function DisplayRating({ rating, ratingsCount, size }: DisplayRatingProps) {
	if (rating === null) {
		return (
			<Text c="gray" fs="italic">
				no rating
			</Text>
		);
	}

	return (
		<Group gap="xs" wrap="nowrap">
			<Text size={size} c="gray" m={0}>
				{rating.toFixed(1)}
			</Text>
			<MantineRating value={rating} count={5} readOnly fractions={10} size={size} />
			{ratingsCount && (
				<Text c="gray" size={size} m={0}>
					({ratingsCount})
				</Text>
			)}
		</Group>
	);
}
