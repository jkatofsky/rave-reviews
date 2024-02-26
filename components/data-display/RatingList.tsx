import { Box, MantineSize, Text } from '@mantine/core';

import { RATINGS_INFO } from '@/util';
import { DisplayRating } from './DisplayRating';

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
				<Box key={index} miw={120} mr="sm">
					<Text fw={600} size={size} c="black">
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
