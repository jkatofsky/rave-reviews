import { Metadata } from 'next';
import { cache } from 'react';
import { Group } from '@mantine/core';
import { revalidatePath } from 'next/cache';
import { Review, type Organizer } from '@prisma/client';
import { notFound } from 'next/navigation';

import { getOrganizer } from '../../../lib/organizer';
import { getReviews, createReview } from '../../../lib/review';
import { OrganizerInfo, OrganizerReviews } from '../../../components/organizer';
import { getInitialReviewSearchParams, NextServerSearchParams } from '../../../util';

const cachedGetOrganizer = cache(async (organizerId: number) => await getOrganizer(organizerId));

// TODO: metadata https://developers.google.com/search/docs/appearance/structured-data/review-snippet
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
	const organizerId = Number(params.id);
	const organizer = await cachedGetOrganizer(organizerId);

	return {
		title: `${organizer?.name} | Rave Reviews`,
	};
}

export default async function Organizer({
	params,
	searchParams,
}: {
	params: { id: string };
	searchParams: NextServerSearchParams;
}) {
	const organizerId = Number(params.id);
	const organizer = await cachedGetOrganizer(organizerId);

	if (!organizer) notFound();

	const { page, orderByField, sortOrder } = Object.fromEntries(
		getInitialReviewSearchParams(searchParams)
	);

	const reviews = await getReviews({
		organizerId: organizer.id,
		page: Number(page),
		orderBy: { [orderByField]: sortOrder },
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
