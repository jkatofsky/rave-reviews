import { humanizeEnumString } from './string';

const enumToSelectData = (enumToSelect: any) =>
	Object.keys(enumToSelect)
		.sort()
		.map((genre) => ({
			value: genre,
			label: humanizeEnumString(genre),
		}));

export { enumToSelectData };
