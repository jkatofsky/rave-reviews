import { Genre, Prisma } from '@prisma/client';
import {
	parseAsInteger,
	parseAsString,
	parseAsStringEnum,
	createSearchParamsCache,
	parseAsArrayOf,
} from 'nuqs/server';

// TODO: move this code elsewhere?
// TODO: do all of these need to be objects?

export const reviewPageParser = {
	page: parseAsInteger.withDefault(0),
};
export const reviewOrderByParser = {
	orderByField: parseAsString.withDefault('createdAt'),
	sortOrder: parseAsStringEnum<Prisma.SortOrder>(Object.values(Prisma.SortOrder)).withDefault(
		Prisma.SortOrder.desc
	),
};

export const reviewSearchParamParser = {
	page: createSearchParamsCache(reviewPageParser),
	orderBy: createSearchParamsCache(reviewOrderByParser),
};

export const organizerPageParser = {
	page: parseAsInteger.withDefault(0),
};
export const organizerOrderByParser = {
	orderByField: parseAsString.withDefault('overallRating'),
	sortOrder: parseAsStringEnum<Prisma.SortOrder>(Object.values(Prisma.SortOrder)).withDefault(
		Prisma.SortOrder.desc
	),
};
export const organizerTopGenresParser = {
	topGenres: parseAsArrayOf(parseAsStringEnum<Genre>(Object.values(Genre))).withDefault([]),
};

export const organizerSearchParamParser = {
	page: createSearchParamsCache(organizerPageParser),
	orderBy: createSearchParamsCache(organizerOrderByParser),
	topGenres: createSearchParamsCache(organizerTopGenresParser),
};
