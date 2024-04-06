'use server';

import { City } from '@prisma/client';
import prisma from '../db';

// TODO: implement the actual logic
// make accept bool if it should suggestion google maps cities (true in create organizer modal, false on searching page)
// by default it freetext searches the existing City table
// if bool is true, it also calls google autocomplete API. Those results, if they are not in the table, have null ID (checked via googleMapsPlaceId)

export const autocompleteCities = async (query: string): Promise<City[]> => {
	return await prisma.city.findMany();
};
