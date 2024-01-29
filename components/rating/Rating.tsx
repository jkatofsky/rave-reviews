import { Rating as MantineRating, Text } from '@mantine/core';

function Rating({ rating }: { rating: number | null }) {
	return rating !== null ? (
		<MantineRating value={rating} count={10} readOnly fractions={5} />
	) : (
		<Text c="gray" fs="italic">
			no rating yet
		</Text>
	);
}

export { Rating };
