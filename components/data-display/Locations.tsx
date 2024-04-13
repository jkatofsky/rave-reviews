import { LocationWithCity } from '@/shared/types';
import { MantineSize, Text } from '@mantine/core';

interface LocationsProps {
	locations: LocationWithCity[];
	size?: MantineSize;
	max?: number;
}

export function Locations({ locations, size = 'sm', max = 3 }: LocationsProps) {
	const locationStrings = locations
		.slice(0, max)
		.map((location) =>
			[
				location.streetAddress,
				location.postalCode,
				location.city.name,
				location.city.region,
				location.city.country,
			]
				.filter((partOfAddress) => partOfAddress)
				.join(', ')
		);

	return (
		<Text c="dimmed" size={size}>
			{locationStrings.map((locationString, index) => (
				<>
					<span key={index}>{locationString}</span>
					<br />
				</>
			))}
			{max < locations.length && '...'}
		</Text>
	);
}
