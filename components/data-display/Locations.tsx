'use client';

import { Anchor, Box, Group, MantineSize, Text, useMantineTheme } from '@mantine/core';

import { IconExternalLink } from '@tabler/icons-react';

import { OrganizerWithLocations } from '@/shared/types';
import { stringifyLocation } from '../util';

interface LocationsProps {
	organizer: OrganizerWithLocations;
	size?: MantineSize;
	max?: number;
	clickable?: boolean;
}

export function Locations({ organizer, size = 'sm', max = 3, clickable = false }: LocationsProps) {
	const locationStrings = organizer.locations.slice(0, max).map(stringifyLocation);
	const theme = useMantineTheme();

	return (
		<>
			{locationStrings.map((locationString, index) => (
				<Box key={index}>
					{clickable ? (
						<Group style={{ cursor: 'pointer' }} gap="xs">
							<Anchor
								href={`https://www.google.com/maps?q=${organizer.name} ${locationString}`}
								target="_blank"
								key={index}
								size={size}
							>
								{locationString}
							</Anchor>
							<IconExternalLink stroke={1.5} size={24} color={theme.colors.blue[6]} />
						</Group>
					) : (
						<Text c="dimmed" size={size} key={index}>
							{locationString}
						</Text>
					)}
				</Box>
			))}
			{max < organizer.locations.length && '...'}
		</>
	);
}
