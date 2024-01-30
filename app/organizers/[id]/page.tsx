import { Metadata } from 'next';
import { cache } from 'react';
import {
	Group,
	Stack,
	Title,
	Text,
	Divider,
	Space,
	Paper,
	Box,
	SimpleGrid,
	Flex,
} from '@mantine/core';
import { revalidatePath } from 'next/cache';
import { Review, type Organizer } from '@prisma/client';

import { getOrganizer } from '../../../lib/organizer';
import { getReviews, createReview } from '../../../lib/review';
import { RATING_KEYS } from '../../../lib/constants';
import { Rating } from '../../../components/rating';

const cachedGetOrganizer = cache(async (organizerId: number) => await getOrganizer(organizerId));

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
	const organizerId = Number(params.id);
	const organizer = await cachedGetOrganizer(organizerId);

	return {
		title: `${organizer?.name} | Rave Reviews`,
	};
}

function OrganizerInfo({ organizer }: { organizer: Organizer }) {
	return (
		<Stack gap={0}>
			<Title fs="italic" order={2} mb="md">
				{organizer?.name}
			</Title>
			<Text fw={600}>Overall rating</Text>
			<Rating rating={organizer.overallRating} />
			<Space h="sm" />
			<Divider />
			<Space h="sm" />
			{/* TODO: make these format not in a column when it's skinnier */}
			{RATING_KEYS.map((ratingKey, index) => (
				<div key={index}>
					<Text>{ratingKey}</Text>
					<Rating rating={organizer[ratingKey as keyof Organizer] as number} />
					<Space h="xs" />
				</div>
			))}
		</Stack>
	);
}

function OrganizerReviews({ reviews }: { reviews: Review[] }) {
	if (!reviews || reviews.length === 0) {
		return (
			<Text c="gray" fs="italic">
				No reviews yet
			</Text>
		);
	}
	return (
		<Stack>
			{/* TODO: rewrap the styling of this whole card */}
			{reviews.map((review) => (
				<Paper mih={250} maw={900} key={review.id} radius="md" bg="gray.1" withBorder p="lg">
					{/* TODO: make the ratings wrap when it's skinnier */}
					<Group align="top">
						<Text>{review.description}</Text>
						<Box>
							<Flex justify="flex-start" align="center" direction="row" wrap="wrap">
								{RATING_KEYS.map((ratingKey, index) => (
									<Box key={index} w={200}>
										<Text mt={0}>{ratingKey}</Text>
										<Rating rating={review[ratingKey as keyof Review] as number} />
									</Box>
								))}
							</Flex>
						</Box>
					</Group>
				</Paper>
			))}
		</Stack>
	);
}

export default async function Organizer({ params }: { params: { id: string } }) {
	const organizerId = Number(params.id);
	const organizer = await cachedGetOrganizer(organizerId);
	const reviews = await getReviews({ organizerId, page: 0, perPage: 100 });

	async function handleReviewCreation(formData: FormData) {
		'use server';
		await createReview(formData);
		revalidatePath('/organizers/[id]/page', 'page');
	}

	return (
		<Group justify="center" align="top">
			<OrganizerInfo organizer={organizer!} />
			<Space w={200} />
			<OrganizerReviews reviews={reviews} />

			<form action={handleReviewCreation}>
				{/* TODO: implement the form; and, decide if this route is the best place for it */}
			</form>
		</Group>
	);
}
