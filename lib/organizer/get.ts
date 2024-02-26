'use server';

import type { Genre, Organizer, Prisma } from '@prisma/client';

import prisma from '@/lib/db';
import { DEFAULT_PAGE_SIZE } from '@/util';

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
}: OrganizerQuery): Promise<{ hasNextPage: boolean; organizers: Organizer[] }> => {
	const filters =
		topGenres !== undefined && topGenres.length > 0
			? {
					topGenres: {
						hasSome: topGenres,
					},
			  }
			: undefined;
	const organizersWithExtra = await prisma.organizer.findMany({
		skip: page * perPage,
		take: perPage + 1,
		orderBy,
		where: filters,
	});
	const hasNextPage = organizersWithExtra.length > perPage;
	return {
		hasNextPage,
		organizers: hasNextPage ? organizersWithExtra.slice(0, -1) : organizersWithExtra,
	};
};

export { getOrganizer, getOrganizers, type OrganizerQuery };
