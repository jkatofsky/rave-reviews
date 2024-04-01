'use server';

import type { Genre, Organizer, Prisma } from '@prisma/client';

import prisma from '@/data/db';
import { DEFAULT_PAGE_SIZE } from '@/shared/constants';
import { PaginatedResponse } from '@/shared/types';

import { getPaginatedResponse } from '../util';

const getOrganizer = async (id: number): Promise<Organizer | null> => {
	return await prisma.organizer.findUnique({
		where: {
			id,
		},
	});
};

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

type OrganizerQuery = {
	page: number;
	perPage?: number;
	orderBy: Prisma.OrganizerOrderByWithRelationInput;
	expensivenessRange?: [number, number];
	topGenres?: Genre[];
};

const getOrganizers = async ({
	page,
	perPage = DEFAULT_PAGE_SIZE,
	orderBy,
	expensivenessRange,
	topGenres,
}: OrganizerQuery): Promise<PaginatedResponse<Organizer>> => {
	let filters: Prisma.OrganizerWhereInput = {};
	filters = addExpensivenessRangeToFilters(expensivenessRange, filters);
	filters = addTopGenresToFilters(topGenres, filters);

	const organizersQueryPromise = (_perPage: number) =>
		prisma.organizer.findMany({
			skip: page * perPage,
			take: _perPage,
			orderBy,
			where: filters,
		});

	return await getPaginatedResponse<Organizer>(organizersQueryPromise, perPage);
};

export { getOrganizer, getOrganizers, type OrganizerQuery };
