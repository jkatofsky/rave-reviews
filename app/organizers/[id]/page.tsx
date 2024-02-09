import { Metadata } from 'next';
import { cache } from 'react';
import { Button, Group, Space } from '@mantine/core';
import { revalidatePath } from 'next/cache';
import { Review, type Organizer } from '@prisma/client';

import { getOrganizer } from '../../../lib/organizer';
import { getReviews, createReview } from '../../../lib/review';
import { OrganizerInfo, OrganizerReviews } from '../../../components/organizer';
import Link from 'next/link';

const cachedGetOrganizer = cache(async (organizerId: number) => await getOrganizer(organizerId));

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

	// TODO: make these params come from URL
	const reviews = await getReviews({ organizerId, page: 0, perPage: 100 });

	async function onCreateReview(review: Review) {
		'use server';
		await createReview(review);
		revalidatePath('/organizers/[id]/page', 'page');
	}

	// TODO: rework this layout; make the info sticky (when not wrapped) and stay to the left
	// https://www.freecodecamp.org/news/fixed-side-and-bottom-navbar-with-css-flexbox
	return (
		<>
			<Group justify="center" align="top" p="xl">
				<OrganizerInfo organizer={organizer!} />
				<Space w={50} />
				<OrganizerReviews
					initialReviews={reviews}
					organizer={organizer!}
					getReviews={getReviews}
					onCreateReview={onCreateReview}
				/>
			</Group>
		</>
	);
}
