import { Pill, Text } from '@mantine/core';
import { Genre } from '@prisma/client';

import { humanizeEnumString } from '../util';

function stringToHSLColour(string: string): string {
	let stringHash = [...string].reduce((acc, char) => {
		return char.charCodeAt(0) + ((acc << 5) - acc);
	}, 0);
	return `hsl(${stringHash % 360}, 80%, 80%)`;
}

export function GenrePill({ genre }: { genre: Genre }) {
	return (
		<Pill bg={stringToHSLColour(genre)} m={0}>
			<Text fw={600} size="sm">
				{humanizeEnumString(genre)}
			</Text>
		</Pill>
	);
}
