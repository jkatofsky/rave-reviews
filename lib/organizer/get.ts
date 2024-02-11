'use server';

import type { Organizer } from '@prisma/client';

import { SortingDirection } from '../../util';
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
	sortingFields?: Partial<Record<keyof Organizer, SortingDirection>>[];
};

const getOrganizers = async ({
	page,
	perPage,
	sortingFields,
}: OrganizerQuery): Promise<Organizer[]> => {
	return await prisma.organizer.findMany({
		skip: page * perPage,
		take: perPage,
		orderBy: sortingFields,
	});
};

export { getOrganizer, getOrganizers, type OrganizerQuery };
