import { City } from '@prisma/client';

export const organizersDocumentTitle = (city: City | null) =>
	city ? `${city.name}, ${city.country} | Organizers | Rave Reviews` : 'Organizers | Rave Reviews';
