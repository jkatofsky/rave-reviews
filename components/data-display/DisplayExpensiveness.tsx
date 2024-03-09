'use client';

import { Rating, Text, useMantineTheme } from '@mantine/core';
import { IconCurrencyDollar } from '@tabler/icons-react';

interface DisplayExpensivenessProps {
	expensiveness: number | null;
	sizePx?: number;
}

export function DisplayExpensiveness({ expensiveness, sizePx = 30 }: DisplayExpensivenessProps) {
	const theme = useMantineTheme();

	if (expensiveness === null) {
		return (
			<Text c="gray" fs="italic">
				no expensiveness data
			</Text>
		);
	}

	return (
		<Rating
			m={0}
			count={4}
			value={expensiveness}
			fractions={1}
			readOnly
			emptySymbol={<IconCurrencyDollar color={theme.colors.gray[3]} size={sizePx} stroke={3} />}
			fullSymbol={<IconCurrencyDollar color={theme.colors.yellow[6]} size={sizePx} stroke={3} />}
		/>
	);
}
