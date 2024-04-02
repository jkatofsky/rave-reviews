import { Anchor, Box, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { Organizer } from '@prisma/client';

import {
	GenrePill,
	Timestamp,
	DisplayRating,
	RatingList,
	DisplayExpensiveness,
} from '@/components/data-display';

import { humanizeEnumString } from '../util';

export function OrganizerInfo({ organizer }: { organizer: Organizer }) {
	return (
		<Stack miw={200} maw={400}>
			<Stack gap="sm">
				<Group gap="sm" wrap="nowrap">
					<Title fs="italic" order={1} lh={1} style={{ width: 'min-content' }}>
						{organizer.name}
					</Title>
					<Divider orientation="vertical" />
					<Text c="gray" fw={400} size="lg">
						{humanizeEnumString(organizer.type, false)}
					</Text>
					<Divider orientation="vertical" />
					<DisplayExpensiveness expensiveness={organizer.overallExpensiveness} />
				</Group>
				<Box>
					<DisplayRating
						rating={organizer.overallRating}
						ratingsCount={organizer.reviewCount}
						size="xl"
					/>
				</Box>
				{organizer.topGenres.length > 0 && (
					<Group gap="xs">
						<Text c="black" fw={600}>
							Top genres
						</Text>
						{organizer.topGenres.map((genre, index) => (
							<GenrePill genre={genre} key={index} />
						))}
					</Group>
				)}
			</Stack>

			<Divider />

			<Group gap="md">
				<RatingList<Organizer> objectWithRatings={organizer} />
			</Group>

			{organizer.websites.length > 0 && (
				<>
					<Divider />
					<Stack gap="xs">
						{organizer.websites?.map((website: string, index: number) => (
							<Anchor key={index}>{website}</Anchor>
						))}
					</Stack>
				</>
			)}

			<Divider />

			<Group m={0}>
				<Timestamp label="Created" date={organizer.createdAt} />
				{organizer.createdAt.getTime() !== organizer.updatedAt.getTime() && (
					<Timestamp label="Updated" date={organizer.updatedAt} />
				)}
			</Group>
		</Stack>
	);
}
