'use server';

import prisma from '../db';

import { recomputeOrganizerReviewData } from '@/actions/organizer';
import { CreateReview } from '@/shared/types';

const createReview = async (review: CreateReview): Promise<void> => {
	await prisma.review.create({
		data: review,
	});

	await recomputeOrganizerReviewData(review.organizer.connect!.id!);
};

export { createReview };
