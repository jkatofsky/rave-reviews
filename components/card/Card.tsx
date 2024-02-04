import { Paper } from '@mantine/core';
import { ReactNode } from 'react';

export function Card({ children }: { children: ReactNode }) {
	return (
		<Paper radius="md" bg="gray.1" withBorder p="lg">
			{children}
		</Paper>
	);
}
