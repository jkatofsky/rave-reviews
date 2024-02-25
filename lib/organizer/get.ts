'use server';

import type { Genre, Organizer, Prisma } from '@prisma/client';

import prisma from '../db';
import { DEFAULT_PAGE_SIZE } from '../../util';

const getOrganizer = async (id: number): Promise<Organizer | null> => {
	return await prisma.organizer.findUnique({
		where: {
			id,
		},
	});
};

type OrganizerQuery = {
	page: number;
	perPage?: number;
	orderBy: Prisma.OrganizerOrderByWithRelationInput;
	topGenres?: Genre[];
};

const getOrganizers = async ({
	page,
	perPage = DEFAULT_PAGE_SIZE,
	orderBy,
	topGenres,
}: OrganizerQuery): Promise<Organizer[]> => {
	const filters =
		topGenres !== undefined && topGenres.length > 0
			? {
					topGenres: {
						hasSome: topGenres,
					},
			  }
			: undefined;

	return await prisma.organizer.findMany({
		skip: page * perPage,
		take: perPage,
		orderBy,
		where: filters,
	});
};

export { getOrganizer, getOrganizers, type OrganizerQuery };
