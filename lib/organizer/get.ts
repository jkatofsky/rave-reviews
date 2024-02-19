'use server';

import type { Genre, Organizer, Prisma } from '@prisma/client';

import prisma from '../db';

const getOrganizer = async (id: number): Promise<Organizer | null> => {
	return await prisma.organizer.findUnique({
		where: {
			id,
		},
	});
};

type OrganizerQuery = {
	page: number;
	perPage: number;
	orderBy: Prisma.OrganizerOrderByWithRelationInput;
	topGenresToFilter?: Genre[];
};

const getOrganizers = async ({
	page,
	perPage,
	orderBy,
	topGenresToFilter,
}: OrganizerQuery): Promise<Organizer[]> => {
	const filters =
		topGenresToFilter !== undefined && topGenresToFilter.length > 0
			? {
					topGenres: {
						hasSome: topGenresToFilter,
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
