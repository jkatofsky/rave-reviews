import { Metadata } from 'next';
import { cache } from 'react';
import { Group } from '@mantine/core';
import { revalidatePath } from 'next/cache';
import { Review, type Organizer, Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';

import { getOrganizer } from '../../../lib/organizer';
import { getReviews, createReview } from '../../../lib/review';
import { OrganizerInfo, OrganizerReviews } from '../../../components/organizer';
import { DEFAULT_PAGE_SIZE } from '../../../util';

const cachedGetOrganizer = cache(async (organizerId: number) => await getOrganizer(organizerId));

// TODO: metadata https://developers.google.com/search/docs/appearance/structured-data/review-snippet
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
	const organizerId = Number(params.id);
	const organizer = await cachedGetOrganizer(organizerId);

	return {
		title: `${organizer?.name} | Rave Reviews`,
	};
}

export default async function Organizer({ params }: { params: { id: string } }) {
	const organizerId = Number(params.id);
	const organizer = await cachedGetOrganizer(organizerId);

	if (!organizer) notFound();

	// TODO: figure out how to make this use the same query params as client component
	const reviews = await getReviews({
		organizerId,
		page: 0,
		perPage: DEFAULT_PAGE_SIZE,
		orderBy: {
			createdAt: Prisma.SortOrder.desc,
		},
	});

	async function createReviewAction(review: Review) {
		'use server';
		await createReview(review);
		revalidatePath('/organizers/[id]/page', 'page');
	}

	// TODO: rework this layout; make the info sticky (when not wrapped) and stay to the left
	// https://www.freecodecamp.org/news/fixed-side-and-bottom-navbar-with-css-flexbox
	return (
		<Group justify="space-around" align="top" grow p="xl">
			<OrganizerInfo organizer={organizer!} />
			<OrganizerReviews
				initialReviews={reviews}
				organizer={organizer}
				getReviews={getReviews}
				createReview={createReviewAction}
			/>
		</Group>
	);
}
