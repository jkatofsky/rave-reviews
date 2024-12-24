import { Metadata } from 'next';
import { cache } from 'react';
import { Group } from '@mantine/core';
import { revalidatePath } from 'next/cache';
import { type Organizer } from '@prisma/client';
import { notFound } from 'next/navigation';
import { EntertainmentBusiness, WithContext } from 'schema-dts';

import { getOrganizer } from '@/actions/organizer';
import { getReviews, createReview } from '@/actions/review';
import { OrganizerInfo, OrganizerReviews } from '@/components/organizer';
import { reviewSearchParamParser } from '@/shared/search';
import { CreateReview } from '@/shared/types';

const cachedOrganizer = cache(async (organizerId: string) => await getOrganizer(organizerId));

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const organizer = await cachedOrganizer(id);

	return {
		title: organizer ? `${organizer.name} | Rave Reviews` : 'Organizer not found | Rave Reviews',
	};
}

export default async function Organizer({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { id } = await params;

	const organizer = await cachedOrganizer(id);

	if (!organizer) notFound();

	// TODO: make the individual reviews accessble too?
	// TODO: add locations to this
	const jsonLd: WithContext<EntertainmentBusiness> = {
		'@context': 'https://schema.org',
		'@type': 'EntertainmentBusiness',
		name: organizer.name,
		priceRange: '$'.repeat(organizer.overallExpensiveness || 0),
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: organizer.overallRating?.toFixed(2).toString(),
			ratingCount: organizer.reviewCount,
			worstRating: '1',
			bestRating: '5',
		},
	};

	const awaitedSearchParams = await searchParams;
	const { page } = reviewSearchParamParser.page.parse(awaitedSearchParams);
	const { orderByField, sortOrder } = reviewSearchParamParser.orderBy.parse(awaitedSearchParams);

	const reviews = await getReviews({
		organizerId: organizer.id,
		page,
		orderBy: { [orderByField]: sortOrder },
	});

	async function createReviewAction(review: CreateReview) {
		'use server';
		await createReview(review);
		revalidatePath('/organizers/[id]/page', 'page');
	}

	// TODO: rework this layout; make the info sticky (when not wrapped) and stay to the left
	// https://www.freecodecamp.org/news/fixed-side-and-bottom-navbar-with-css-flexbox
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<Group justify="space-around" align="top" grow>
				<OrganizerInfo organizer={organizer!} />
				<OrganizerReviews
					initialReviews={reviews}
					organizer={organizer}
					getReviews={getReviews}
					createReview={createReviewAction}
				/>
			</Group>
		</>
	);
}
