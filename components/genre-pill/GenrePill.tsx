import { Pill, Text } from '@mantine/core';
import { Genre } from '@prisma/client';

// TODO: make this a gradient?
export function deterministicStringToHSLColour(string: string): string {
	let stringHash = [...string].reduce((acc, char) => {
		return char.charCodeAt(0) + ((acc << 5) - acc);
	}, 0);
	return `hsl(${stringHash % 360}, 80%, 70%)`;
}

export const humanizeGenreName = (genre: Genre): string => {
	const lowercaseGenreWithSpaces = genre
		.split(/(?=[A-Z])/)
		.join(' ')
		.toLowerCase();

	return lowercaseGenreWithSpaces.charAt(0).toUpperCase() + lowercaseGenreWithSpaces.slice(1);
};

export function GenrePill({ genre }: { genre: Genre }) {
	return (
		<Pill bg={deterministicStringToHSLColour(genre)} m={0}>
			<Text fw={600} size="sm">
				{humanizeGenreName(genre)}
			</Text>
		</Pill>
	);
}
