'use server';

import { type Review, Prisma } from '@prisma/client';

import prisma from '../db';
import { DEFAULT_PAGE_SIZE } from '@/shared/constants';
import { PaginatedResponse } from '@/shared/types';

import { getPaginatedResponse } from '../util';

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
}: ReviewQuery): Promise<PaginatedResponse<Review>> => {
	const reviewsQueryPromise = (_perPage: number) =>
		prisma.review.findMany({
			where: { organizerId },
			skip: page * perPage,
			take: _perPage,
			orderBy,
		});

	return await getPaginatedResponse<Review>(reviewsQueryPromise, perPage);
};

export { type ReviewQuery, getReviews };
