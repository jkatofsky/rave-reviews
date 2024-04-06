import { Prisma } from '@prisma/client';

export type PaginatedResponse<T> = {
	hasNextPage: boolean;
	value: T[];
};

export type CreateReview = Prisma.ReviewCreateInput;
export type CreateLocation = Prisma.LocationCreateWithoutOrganizerInput;

export type CreateOrganizer = Prisma.OrganizerCreateWithoutLocationsInput & {
	locations: CreateLocation[];
};
