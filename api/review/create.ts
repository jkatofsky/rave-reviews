'use server';

import type { Review } from '@prisma/client';

import prisma from '@/api/db';
import { recomputeOrganizerReviewData } from '@/api/organizer';
import { RATINGS_INFO } from '@/shared/constants';

const createReview = async (review: Review): Promise<void> => {
	// TODO: type the params as any and use zod to get the review?
	const { organizerId, description, genres, expensiveness } = review;

	await prisma.review.create({
		data: {
			organizerId,
			description,
			genres,
			expensiveness,
			...[...RATINGS_INFO.keys()].reduce(
				(ratings, ratingKey) =>
					review[ratingKey as keyof Review]
						? { ...ratings, [ratingKey]: review[ratingKey as keyof Review] }
						: ratings,
				{}
			),
		} as Review,
	});

	await recomputeOrganizerReviewData(organizerId);
};

export { createReview };
