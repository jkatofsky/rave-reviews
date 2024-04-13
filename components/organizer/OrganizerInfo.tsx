import { Anchor, Box, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { Organizer } from '@prisma/client';

import {
	GenrePill,
	Timestamp,
	DisplayRating,
	RatingList,
	DisplayExpensiveness,
	Locations,
} from '@/components/data-display';
import { OrganizerWithLocations } from '@/shared/types';

import { humanizeEnumString } from '../util';

export function OrganizerInfo({ organizer }: { organizer: OrganizerWithLocations }) {
	return (
		<Stack miw={200} maw={500} p="sm">
			<Stack gap="sm">
				<Text fs="italic" order={1} component={Title} c="black" textWrap="nowrap" truncate="end">
					{organizer.name}
				</Text>
				<Box>
					<DisplayRating
						rating={organizer.overallRating}
						ratingsCount={organizer.reviewCount}
						size="xl"
					/>
				</Box>
				<Group gap="sm" wrap="nowrap">
					<Text c="gray" fw={400} size="lg">
						{humanizeEnumString(organizer.type, false)}
					</Text>
					<Divider orientation="vertical" />
					<DisplayExpensiveness expensiveness={organizer.overallExpensiveness} />
				</Group>

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

			{organizer.locations.length > 0 && (
				<>
					<Divider />
					<Locations organizer={organizer} clickable size="md" />
				</>
			)}

			{/* TODO: auto-detect common websites and give nice formatting; and still have a default nice icon for custom sites */}
			{organizer.websites.length > 0 && (
				<>
					<Divider />
					<Stack gap="xs">
						{organizer.websites?.map((website: string, index: number) => (
							<Anchor key={index} href={website} target="_blank">
								{website}
							</Anchor>
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
