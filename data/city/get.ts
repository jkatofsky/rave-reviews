'use server';

import { City } from '@prisma/client';
import prisma from '../db';

export const getCity = async (id: number): Promise<City | null> => {
	return await prisma.city.findUnique({
		where: {
			id,
		},
	});
};

// TODO make accept bool if it should suggestion google maps cities (true in create organizer modal, false on searching page)
// by default it searches the existing City table
// if bool is true, it also calls google suggest API. Those results should also have an id so the frontend can use it...so maybe flag it as a new city?

// TODO: re-enable fulltext search? And make it not throw stupid errors

export const getSuggestedCities = async (query: string): Promise<City[]> =>
	await prisma.city.findMany({
		where: {
			name: {
				contains: query,
				mode: 'insensitive',
			},
		},
	});
