'use server';

import prisma from '../db';
import { RATING_KEYS } from '../constants';
import type { Genre, Review } from '@prisma/client';

// TODO: extract stuff from this function
const createReview = async (formData: FormData): Promise<void> => {
	// TODO: data validation with zod

	const organizerId = Number(formData.get('organizerId'));
	const description = formData.get('description') as string;
	const genres = (formData.get('genres') as string).split(',') as Genre[];
	const moneySpent = Number(formData.get('moneySpent'));

	await prisma.review.create({
		data: {
			organizerId,
			description,
			genres,
			moneySpent,
			...RATING_KEYS.reduce(
				(ratings, ratingKey) =>
					formData.get(ratingKey)
						? { ...ratings, [ratingKey]: Number(formData.get(ratingKey)) }
						: ratings,
				{}
			),
		} as Review,
	});

	const organizerRatingsAggregation = await prisma.review.aggregate({
		where: {
			organizerId: organizerId,
		},
		_avg: RATING_KEYS.reduce(
			(averagingObject, ratingKey) => ({
				...averagingObject,
				[ratingKey]: true,
			}),
			{}
		),
	});
	const organizerRatings = Object.fromEntries(
		Object.entries(organizerRatingsAggregation._avg).filter(([_, v]) => v !== null)
	);
	const organizerRatingsVector: number[] = Object.values(organizerRatings) as number[];
	const organizerOverallRating =
		organizerRatingsVector.reduce((a, b) => a + b) / organizerRatingsVector.length;

	await prisma.organizer.update({
		where: {
			id: organizerId,
		},
		data: {
			overallRating: organizerOverallRating,
			...organizerRatings,
		},
	});
};

export { createReview };
