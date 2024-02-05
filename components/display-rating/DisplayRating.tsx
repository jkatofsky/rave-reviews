import { Group, Rating as MantineRating, MantineSize, Text } from '@mantine/core';

// TODO: make this component also responsible for rendering the title?
export interface DisplayRatingProps {
	rating: number | null;
	ratingsCount?: number | null;
	size?: MantineSize;
}

export function DisplayRating({ rating, ratingsCount, size }: DisplayRatingProps) {
	return rating !== null ? (
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
	) : (
		<Text c="gray" fs="italic">
			no rating yet
		</Text>
	);
}
