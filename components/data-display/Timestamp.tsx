import { Text, Tooltip } from '@mantine/core';

export function Timestamp({ label, date }: { label: string; date: Date }) {
	return (
		<Tooltip label={date.toLocaleString()}>
			<Text c="gray" size="sm" style={{ width: 'fit-content' }} m={0}>
				{label} {date.toLocaleDateString()}
			</Text>
		</Tooltip>
	);
}
