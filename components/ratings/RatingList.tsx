import { RATINGS_INFO } from '../../lib/constants';
import { Box, Text } from '@mantine/core';
import { DisplayRating } from '.';

export function RatingList<ObjectType>({ objectWithRatings }: { objectWithRatings: ObjectType }) {
	return (
		<>
			{[...RATINGS_INFO.entries()].map((rating, index) => (
				<Box key={index}>
					<Text fw={600}>{rating[1].title}</Text>
					<DisplayRating rating={objectWithRatings[rating[0] as keyof ObjectType] as number} />
				</Box>
			))}
		</>
	);
}
