'use server';

import prisma from '../db';
import type { Organizer } from '@prisma/client';

// TODO: make this return:
// the number of reviews for the organization
// the top genres for the organization

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
};

const getOrganizers = async (organizerQuery: OrganizerQuery): Promise<Organizer[]> => {
	const { page, perPage } = organizerQuery;
	return await prisma.organizer.findMany({
		skip: page * perPage,
		take: perPage,
	});
};

export { getOrganizer, getOrganizers, type OrganizerQuery };
