'use server';

import type { Review } from '@prisma/client';

import { SortingDirection } from '../../util';
import prisma from '../db';

type ReviewQuery = {
	organizerId: number;
	page: number;
	perPage: number;
	sortingFields?: Partial<Record<keyof Review, SortingDirection>>[];
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
