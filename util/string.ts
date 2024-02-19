export function humanizeEnumString(enumString: string, capitalize: boolean = true): string {
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
}
