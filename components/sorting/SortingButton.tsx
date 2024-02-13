import { Button } from '@mantine/core';
import { Prisma } from '@prisma/client';

export function SortingButon<ObjectType>({
	sortingFieldName,
	label,
	setSortingField,
	currentSortingField,
}: {
	sortingFieldName: keyof ObjectType;
	label: string;
	setSortingField: React.Dispatch<
		React.SetStateAction<{
			fieldName: keyof ObjectType;
			sortOrder: Prisma.SortOrder;
		}>
	>;
	currentSortingField: {
		fieldName: keyof ObjectType;
		sortOrder: Prisma.SortOrder;
	};
}) {
	const isActiveSort = currentSortingField.fieldName === sortingFieldName;

	const variant = isActiveSort ? 'light' : 'outline';
	const icon = isActiveSort ? (
		currentSortingField.sortOrder === Prisma.SortOrder.asc ? (
			<>&uarr;</>
		) : (
			<>&darr;</>
		)
	) : (
		<>&uarr;&darr;</>
	);

	const onClick = () => {
		if (isActiveSort) {
			setSortingField((prevSortingField) => ({
				...prevSortingField,
				sortOrder:
					prevSortingField.sortOrder === Prisma.SortOrder.asc
						? Prisma.SortOrder.desc
						: Prisma.SortOrder.asc,
			}));
		} else {
			setSortingField({
				fieldName: sortingFieldName,
				sortOrder: Prisma.SortOrder.desc,
			});
		}
	};

	return (
		<Button variant={variant} leftSection={icon} onClick={onClick}>
			{label}
		</Button>
	);
}
