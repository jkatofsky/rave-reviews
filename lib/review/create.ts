'use server';

import type { Review } from '@prisma/client';

import prisma from '../db';
import { RATINGS_INFO } from '../../util';
import { recomputeOrganizerReviewData } from '../organizer/update';

const createReview = async (review: Review): Promise<void> => {
	// TODO: type the params as any and use zod to get the review?
	const { organizerId, description, genres, moneySpent } = review;

	await prisma.review.create({
		data: {
			organizerId,
			description,
			genres,
			moneySpent,
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
