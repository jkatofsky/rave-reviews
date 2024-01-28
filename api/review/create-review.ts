import prisma from "../db";
import type { Genre, Review } from "@prisma/client";

const RATING_KEYS = ['soundSystemRating', 'djAndMusicRating', 'crowdPlurRating', 'safetyAndComfortRating', 'venueRating', 'valueForMoneyRating', 'visualsRating', 'staffRating', 'foodAndDrinkRating'];

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
            ...RATING_KEYS.reduce((ratings, ratingKey) => formData.get(ratingKey) ?
                ({...ratings, [ratingKey]: Number(formData.get(ratingKey))}) : ratings
            , {})
        } as Review
    })

    const organizerAverageRatingsAggregation = await prisma.review.aggregate({
        where: {
            organizerId: organizerId
        },
        _avg: RATING_KEYS.reduce((averagingObject, ratingKey) =>
                  ({ ...averagingObject, [ratingKey]: true }), {})
    });
    const organizerAverageRatings = Object.fromEntries(Object.entries(organizerAverageRatingsAggregation._avg).filter(([_, v]) => v !== null))

    console.log(organizerAverageRatings);

    const organizerAverageRatingsVector: number[] = Object.values(organizerAverageRatings) as number[];
    const organizerOverallAverageRating = organizerAverageRatingsVector.reduce((a, b) => a + b) / organizerAverageRatingsVector.length;

    await prisma.organizer.update({
        where: {
            id: organizerId
        },
        data: {
            overallRating: organizerOverallAverageRating,
            ...organizerAverageRatings
        }
    })
}

export default createReview;