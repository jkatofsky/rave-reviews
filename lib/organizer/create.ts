'use server';

import type { Organizer } from '@prisma/client';

import prisma from '../db';

const createOrganizer = async (organizer: Organizer): Promise<number> => {
	// TODO: type the params as any and use zod to get the review?
	const { name, type, websites } = organizer;

	const createdOrganizer = await prisma.organizer.create({
		data: { name, type, websites, reviewCount: 0 },
	});

	return createdOrganizer.id;
};

export { createOrganizer };
