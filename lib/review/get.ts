'use server';

import type { Review } from '@prisma/client';

import { Prisma } from '@prisma/client';
import prisma from '../db';

type ReviewQuery = {
	organizerId: number;
	page: number;
	perPage: number;
	orderBy: Prisma.ReviewOrderByWithRelationInput;
};

const getReviews = async ({
	organizerId,
	page,
	perPage,
	orderBy,
}: ReviewQuery): Promise<Review[]> => {
	return await prisma.review.findMany({
		where: { organizerId },
		skip: page * perPage,
		take: perPage,
		orderBy,
	});
};

export { type ReviewQuery, getReviews };
