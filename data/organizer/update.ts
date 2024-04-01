'use server';

import { Genre } from '@prisma/client';

import { RATINGS_INFO, NUMBER_OF_TOP_REVIEWS_PER_ORGANIZER } from '@/shared/constants';
import prisma from '@/data/db';

// TODO: why so much "as" needed?

async function getAverageRatings(organizerId: number): Promise<{
	overallRating: number;
	averageRatings: Record<string, unknown>; // TODO: be able to type this as number
}> {
	const organizerRatingsAggregation = await prisma.review.aggregate({
		where: {
			organizerId: organizerId,
		},
		_avg: [...RATINGS_INFO.keys()].reduce(
			(averagingObject, ratingKey) => ({
				...averagingObject,
				[ratingKey]: true,
			}),
			{} as Record<string, boolean>
		),
	});
	const averageRatings = Object.fromEntries(
		Object.entries(organizerRatingsAggregation._avg).filter(([_, v]) => v !== null)
	);
	const averageRatingsVector: number[] = Object.values(averageRatings) as number[];
	const overallRating =
		averageRatingsVector.reduce((a, b) => a + b, 0) / averageRatingsVector.length;

	return { overallRating, averageRatings };
}

async function getReviewCount(organizerId: number): Promise<number> {
	return await prisma.review.count({
		where: {
			organizerId: organizerId,
		},
	});
}

async function getTopGenres(organizerId: number): Promise<Genre[]> {
	const organizerReviews = await prisma.review.findMany({
		where: {
			organizerId,
		},
		select: {
			genres: true,
		},
	});

	const organizerReviewGenreCounts = Object.keys(Genre).reduce(
		(prev, genre) => ({
			[genre]: 0,
			...prev,
		}),
		{} as Record<Genre, number>
	);

	for (let { genres: reviewGenres } of organizerReviews) {
		for (let _genre in Genre) {
			const genre = _genre as Genre;
			if (reviewGenres.includes(genre)) {
				organizerReviewGenreCounts[genre] = organizerReviewGenreCounts[genre] + 1;
			}
		}
	}

	return Object.keys(organizerReviewGenreCounts)
		.filter((genre) => organizerReviewGenreCounts[genre as Genre] > 0)
		.sort((a, b) => organizerReviewGenreCounts[b as Genre] - organizerReviewGenreCounts[a as Genre])
		.slice(0, NUMBER_OF_TOP_REVIEWS_PER_ORGANIZER) as Genre[];
}

async function getOverallExpensiveness(organizerId: number): Promise<number | null> {
	const organizerExpensivenessAggregation = await prisma.review.aggregate({
		where: {
			organizerId: organizerId,
		},
		_avg: {
			expensiveness: true,
		},
	});

	if (!organizerExpensivenessAggregation._avg.expensiveness) {
		return null;
	}
	return Math.round(organizerExpensivenessAggregation._avg.expensiveness);
}

// TODO: run this on a cron job for all reviews?
export async function recomputeOrganizerReviewData(organizerId: number) {
	// TODO: these functions re-query the Review table one-after-the-other. Surely can be optimized
	// TODO: weight recent reviews higher?
	const { overallRating, averageRatings } = await getAverageRatings(organizerId);
	const reviewCount = await getReviewCount(organizerId);
	const topGenres = await getTopGenres(organizerId);
	const overallExpensiveness = await getOverallExpensiveness(organizerId);

	await prisma.organizer.update({
		where: {
			id: organizerId,
		},
		data: {
			overallRating,
			...averageRatings,
			reviewCount,
			topGenres,
			overallExpensiveness,
		},
	});
}
