'use server';

import type { Organizer, Prisma } from '@prisma/client';

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
	sortingFields?: Partial<Record<keyof Organizer, Prisma.SortOrder>>[];
};

const getOrganizers = async ({
	page,
	perPage,
	sortingFields,
}: OrganizerQuery): Promise<Organizer[]> => {
	return await prisma.organizer.findMany({
		skip: page * perPage,
		take: perPage,
		orderBy: sortingFields, // TODO: put nulls last: https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting#sort-with-null-records-first-or-last
	});
};

export { getOrganizer, getOrganizers, type OrganizerQuery };
