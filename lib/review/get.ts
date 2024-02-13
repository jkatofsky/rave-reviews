'use server';

import type { Review } from '@prisma/client';

import { Prisma } from '@prisma/client';
import prisma from '../db';

type ReviewQuery = {
	organizerId: number;
	page: number;
	perPage: number;
	sortingFields?: Partial<Record<keyof Review, Prisma.SortOrder>>[];
};

const getReviews = async ({
	organizerId,
	page,
	perPage,
	sortingFields,
}: ReviewQuery): Promise<Review[]> => {
	return await prisma.review.findMany({
		where: { organizerId },
		skip: page * perPage,
		take: perPage,
		orderBy: sortingFields,
	});
};

export { type ReviewQuery, getReviews };
