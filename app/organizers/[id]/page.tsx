import { Metadata } from 'next';
import { cache } from 'react';
import { Group } from '@mantine/core';
import { revalidatePath } from 'next/cache';
import { type Organizer } from '@prisma/client';
import { notFound } from 'next/navigation';
import { EntertainmentBusiness, WithContext } from 'schema-dts';

import { getOrganizer } from '@/data/organizer';
import { getReviews, createReview } from '@/data/review';
import { OrganizerInfo, OrganizerReviews } from '@/components/organizer';
import { reviewSearchParamParser } from '@/shared/search';
import { CreateReview } from '@/shared/types';

const cachedOrganizer = cache(async (organizerId: string) => await getOrganizer(organizerId));

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
	const organizer = await cachedOrganizer(params.id);

	return {
		title: organizer ? `${organizer.name} | Rave Reviews` : 'Organizer not found | Rave Reviews',
	};
}

export default async function Organizer({
	params,
	searchParams,
}: {
	params: { id: string };
	searchParams: Record<string, string | string[] | undefined>;
}) {
	const organizer = await cachedOrganizer(params.id);

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

	const { page } = reviewSearchParamParser.page.parse(searchParams);
	const { orderByField, sortOrder } = reviewSearchParamParser.orderBy.parse(searchParams);

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
