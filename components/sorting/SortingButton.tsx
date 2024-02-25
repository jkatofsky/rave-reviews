import { Button } from '@mantine/core';
import { Prisma } from '@prisma/client';

export function SortingButon<ObjectType>({
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

	const variant = isActiveSort ? 'light' : 'outline';
	const icon = isActiveSort ? (
		currentOrderBy.sortOrder === Prisma.SortOrder.asc ? (
			<>&uarr;</>
		) : (
			<>&darr;</>
		)
	) : (
		<>&uarr;&darr;</>
	);

	return (
		<Button
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
