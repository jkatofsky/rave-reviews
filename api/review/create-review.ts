import prisma from "../db";
import type { Review } from "@prisma/client";

const REVIEW_RATING_KEYS = ['soundSystemRating', 'djAndMusicRating', 'crowdPlurRating', 'safetyAndComfortRating', 'venueRating', 'valueForMoneyRating', 'visualsRating', 'staffRating', 'foodAndDrinkRating']

const createReview = async (review: Review): Promise<void> => {
    // TODO: data validation with zod

    await prisma.review.create({
        data: {
            ...review
        }
    })

    const organizerAverageRatingsAggregation = await prisma.review.aggregate({
        where: {
            organizerId: review.organizerId
        },
        _avg: REVIEW_RATING_KEYS.reduce((averagingObject, ratingKey) =>
                  ({ ...averagingObject, [ratingKey]: true }), {})
    });

    const oganizerAverageRatings: number[] = Object.values(organizerAverageRatingsAggregation._avg)
    const organizerOverallAverageRating = oganizerAverageRatings.reduce((a, b) => a + b) / oganizerAverageRatings.length;

    await prisma.organizer.update({
        where: {
            id: review.organizerId
        },
        data: {
            overallAverageRating: organizerOverallAverageRating,
            ...organizerAverageRatingsAggregation._avg
        }
    })
}

export default createReview;