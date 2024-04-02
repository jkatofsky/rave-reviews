'use client';

import { Rating, Text, useMantineTheme } from '@mantine/core';
import { IconCurrencyDollar } from '@tabler/icons-react';

interface DisplayExpensivenessProps {
	expensiveness: number | null;
	sizePx?: number;
}

export function DisplayExpensiveness({ expensiveness, sizePx = 24 }: DisplayExpensivenessProps) {
	const theme = useMantineTheme();

	if (expensiveness === null) {
		return (
			<Text c="gray" fs="italic">
				no expensiveness
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
			styles={{
				symbolBody: { height: sizePx },
			}}
			emptySymbol={<IconCurrencyDollar color={theme.colors.gray[3]} size={sizePx} stroke={3.5} />}
			fullSymbol={<IconCurrencyDollar color={theme.colors.yellow[6]} size={sizePx} stroke={3.5} />}
		/>
	);
}
