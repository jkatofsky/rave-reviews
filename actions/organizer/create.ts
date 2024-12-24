'use server';

import prisma from '../db';
import { CreateOrganizer } from '@/shared/types';

const createOrganizer = async (organizer: CreateOrganizer): Promise<string> => {
	const { locations, ...organizerData } = organizer;

	const createdOrganizer = await prisma.organizer.create({
		data: organizerData,
	});

	for (const location of locations) {
		await prisma.location.create({
			data: {
				...location,
				organizer: {
					connect: {
						id: createdOrganizer.id,
					},
				},
			},
		});
	}

	return createdOrganizer.id;
};

export { createOrganizer };
