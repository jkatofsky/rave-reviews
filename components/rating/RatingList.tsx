import { RATINGS_INFO } from '../../util/constants';
import { Box, MantineSize, Text } from '@mantine/core';
import { DisplayRating } from '.';

export function RatingList<ObjectType>({
	objectWithRatings,
	size,
}: {
	objectWithRatings: ObjectType;
	size?: MantineSize;
}) {
	return (
		<>
			{[...RATINGS_INFO.entries()].map((rating, index) => (
				<Box key={index}>
					<Text fw={600} size={size}>
						{rating[1].title}
					</Text>
					<DisplayRating
						size={size}
						rating={objectWithRatings[rating[0] as keyof ObjectType] as number}
					/>
				</Box>
			))}
		</>
	);
}
