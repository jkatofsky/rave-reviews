'use server';

import { type Review, Prisma } from '@prisma/client';

import prisma from '../db';
import { DEFAULT_PAGE_SIZE } from '../../util';

type ReviewQuery = {
	organizerId: number;
	page: number;
	perPage?: number;
	orderBy: Prisma.ReviewOrderByWithRelationInput;
};

const getReviews = async ({
	organizerId,
	page,
	perPage = DEFAULT_PAGE_SIZE,
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
