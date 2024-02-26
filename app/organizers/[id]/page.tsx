import { Metadata } from 'next';
import { cache } from 'react';
import { Group } from '@mantine/core';
import { revalidatePath } from 'next/cache';
import { Review, type Organizer } from '@prisma/client';
import { notFound } from 'next/navigation';
import { AggregateRating, WithContext } from 'schema-dts';

import { getOrganizer } from '@/lib/organizer';
import { getReviews, createReview } from '@/lib/review';
import { OrganizerInfo, OrganizerReviews } from '@/components/organizer';
import { reviewSearchParamParser } from '@/util';

const cachedGetOrganizer = cache(async (organizerId: number) => await getOrganizer(organizerId));

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
	const organizer = await cachedGetOrganizer(Number(params.id));

	return {
		title: `${organizer?.name} | Rave Reviews`,
	};
}

export default async function Organizer({
	params,
	searchParams,
}: {
	params: { id: string };
	searchParams: Record<string, string | string[] | undefined>;
}) {
	const organizer = await cachedGetOrganizer(Number(params.id));

	if (!organizer) notFound();

	const jsonLd: WithContext<AggregateRating> = {
		'@context': 'https://schema.org',
		'@type': 'AggregateRating',
		itemReviewed: {
			'@type': 'Organization',
			name: organizer.name,
		},
		ratingValue: organizer.overallRating?.toFixed(2).toString(),
		ratingCount: organizer.reviewCount,
		worstRating: '1',
		bestRating: '5',
	};

	const { page } = reviewSearchParamParser.page.parse(searchParams);
	const { orderByField, sortOrder } = reviewSearchParamParser.orderBy.parse(searchParams);

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
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<Group justify="space-around" align="top" grow p="xl">
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
