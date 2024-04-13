'use server';

import type { Genre, Prisma } from '@prisma/client';

import prisma from '../db';
import { DEFAULT_PAGE_SIZE } from '@/shared/constants';
import { PaginatedResponse, OrganizerWithLocations } from '@/shared/types';

import { getPaginatedResponse } from '../util';

const getOrganizer = async (id: number): Promise<OrganizerWithLocations | null> => {
	return await prisma.organizer.findUnique({
		where: {
			id,
		},
		include: {
			locations: {
				include: {
					city: true,
				},
			},
		},
	});
};

function addCityIdToFilters(
	cityId: number | undefined,
	filters: Prisma.OrganizerWhereInput
): Prisma.OrganizerWhereInput {
	if (!cityId) {
		return filters;
	}
	return {
		...filters,
		locations: {
			some: {
				cityId,
			},
		},
	};
}

function addExpensivenessRangeToFilters(
	expensivenessRange: [number, number] | undefined,
	filters: Prisma.OrganizerWhereInput
): Prisma.OrganizerWhereInput {
	if (
		(expensivenessRange?.length || 0) !== 2 ||
		!expensivenessRange?.every((entry) => typeof entry === 'number') ||
		expensivenessRange[0] > expensivenessRange[1] ||
		(expensivenessRange[0] === 1 && expensivenessRange[1] === 4)
	) {
		return filters;
	}
	return {
		...filters,
		overallExpensiveness: {
			gte: expensivenessRange![0],
			lte: expensivenessRange![1],
		},
	};
}

function addTopGenresToFilters(
	topGenres: Genre[] | undefined,
	filters: Prisma.OrganizerWhereInput
): Prisma.OrganizerWhereInput {
	if (!topGenres?.length) {
		return filters;
	}
	return {
		...filters,
		topGenres: {
			hasSome: topGenres,
		},
	};
}

type OrganizerQuery = {
	page: number;
	perPage?: number;
	orderBy: Prisma.OrganizerOrderByWithRelationInput;
	cityId?: number;
	expensivenessRange?: [number, number];
	topGenres?: Genre[];
};

const getOrganizers = async ({
	page,
	perPage = DEFAULT_PAGE_SIZE,
	orderBy,
	cityId,
	expensivenessRange,
	topGenres,
}: OrganizerQuery): Promise<PaginatedResponse<OrganizerWithLocations>> => {
	let filters: Prisma.OrganizerWhereInput = {};
	filters = addCityIdToFilters(cityId, filters);
	filters = addExpensivenessRangeToFilters(expensivenessRange, filters);
	filters = addTopGenresToFilters(topGenres, filters);

	const organizersQueryPromise = (_perPage: number) =>
		prisma.organizer.findMany({
			skip: page * perPage,
			take: _perPage,
			orderBy,
			where: filters,
			include: {
				locations: {
					include: {
						city: true,
					},
				},
			},
		});

	return await getPaginatedResponse<OrganizerWithLocations>(organizersQueryPromise, perPage);
};

export { getOrganizer, getOrganizers, type OrganizerQuery };
