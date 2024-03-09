import { Button } from '@mantine/core';
import { Prisma } from '@prisma/client';
import { IconArrowDown, IconArrowUp, IconArrowsUpDown } from '@tabler/icons-react';

export function SortingButton<ObjectType>({
	orderByField,
	label,
	onClick,
	currentOrderBy,
}: {
	orderByField: keyof ObjectType;
	label: string;
	onClick: (orderBy: { orderByField: keyof ObjectType; sortOrder: Prisma.SortOrder }) => void;
	currentOrderBy: {
		orderByField: keyof ObjectType;
		sortOrder: Prisma.SortOrder;
	};
}) {
	const isActiveSort = currentOrderBy.orderByField === orderByField;

	const variant = isActiveSort ? 'filled' : 'light';
	const icon = isActiveSort ? (
		currentOrderBy.sortOrder === Prisma.SortOrder.asc ? (
			<IconArrowUp />
		) : (
			<IconArrowDown />
		)
	) : (
		<IconArrowsUpDown />
	);

	return (
		<Button
			maw="fit-content"
			variant={variant}
			leftSection={icon}
			onClick={() => {
				let sortOrder: Prisma.SortOrder;
				if (isActiveSort) {
					sortOrder =
						currentOrderBy.sortOrder === Prisma.SortOrder.asc
							? Prisma.SortOrder.desc
							: Prisma.SortOrder.asc;
				} else {
					sortOrder = Prisma.SortOrder.desc;
				}
				onClick({
					orderByField,
					sortOrder,
				});
			}}
		>
			{label}
		</Button>
	);
}
