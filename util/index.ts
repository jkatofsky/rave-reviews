export function humanizeEnumString(enumString: string, capitalize: boolean = true): string {
	const lowercaseGenreWithSpaces = enumString
		.split(/(?=[A-Z])/)
		.join(' ')
		.toLowerCase();

	// TODO: "or" -> /
	// TODO: "and" -> &

	return capitalize
		? lowercaseGenreWithSpaces.charAt(0).toUpperCase() + lowercaseGenreWithSpaces.slice(1)
		: lowercaseGenreWithSpaces;
}
