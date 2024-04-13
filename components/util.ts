import { City } from '@prisma/client';

import { LocationWithCity } from '@/shared/types';

const humanizeEnumString = (enumString: string, capitalize: boolean = true): string => {
	const humanizedEnumString = enumString
		.split(/(?=[A-Z])/)
		.map((_word) => {
			const word = _word.toLowerCase();
			if (word === 'and') return '&';
			if (word === 'or') return '/';
			return word;
		})
		.join(' ');

	return capitalize
		? humanizedEnumString.charAt(0).toUpperCase() + humanizedEnumString.slice(1)
		: humanizedEnumString;
};
const enumToSelectData = (enumToSelect: any) =>
	Object.keys(enumToSelect)
		.sort()
		.map((genre) => ({
			value: genre,
			label: humanizeEnumString(genre),
		}));

const stringifyCity = ({ name, region, country }: City) =>
	[name, region, country].filter((partOfAddress) => partOfAddress).join(', ');

const stringifyLocation = (location: LocationWithCity) =>
	[location.streetAddress, location.postalCode]
		.filter((partOfAddress) => partOfAddress)
		.join(', ') +
	', ' +
	stringifyCity(location.city);

export { humanizeEnumString, enumToSelectData, stringifyCity, stringifyLocation };
