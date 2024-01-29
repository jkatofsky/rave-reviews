'use server';

import prisma from '../db';
import type { Review } from '@prisma/client';

type ReviewQuery = {
	organizerId: number;
	page: number;
	perPage: number;
};

const getReviews = async (reviewQuery: ReviewQuery): Promise<Review[]> => {
	const { organizerId, page, perPage } = reviewQuery;
	return await prisma.review.findMany({
		where: { organizerId },
		skip: page * perPage,
		take: perPage,
	});
};

export { type ReviewQuery, getReviews };
