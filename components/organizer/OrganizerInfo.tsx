import { Anchor, Box, Divider, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { Organizer } from '@prisma/client';

import { DisplayRating } from '../rating';
import { GenrePill } from '../genre-pill';
import { RatingList } from '../rating';
import { humanizeEnumString } from '../../util';

export function OrganizerInfo({ organizer }: { organizer: Organizer }) {
	return (
		<Stack gap={0} miw={200} maw={400}>
			<Group gap="sm" mb="sm" wrap="nowrap">
				<Title fs="italic" order={1} lh={1} style={{ width: 'min-content' }}>
					{organizer.name}
				</Title>
				<Divider orientation="vertical" />
				<Text c="gray" fw={400} size="lg">
					{humanizeEnumString(organizer.type, false)}
				</Text>
			</Group>
			<Box>
				<DisplayRating
					rating={organizer.overallRating}
					ratingsCount={organizer.reviewCount}
					size="xl"
				/>
			</Box>

			{organizer.topGenres.length > 0 && (
				<Group gap="xs" mt="lg">
					<Text fw={600}>Genres</Text>
					{organizer.topGenres.map((genre, index) => (
						<GenrePill genre={genre} key={index} />
					))}
				</Group>
			)}

			<Divider mt="md" mb="md" />

			<Group gap="md">
				<RatingList<Organizer> objectWithRatings={organizer} />
			</Group>

			<Divider mt="md" mb="md" />

			{organizer.websites.map((website: string, index: number) => (
				<Anchor key={index} mb="xs">
					{website}
				</Anchor>
			))}
		</Stack>
	);
}
