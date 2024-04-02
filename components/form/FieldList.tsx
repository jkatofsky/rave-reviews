import { ActionIcon, Box, Button, Group, Stack } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { ReactElement } from 'react';
import { IconSquareRoundedMinus } from '@tabler/icons-react';

interface FieldListProps<FormValues, FieldType> {
	form: UseFormReturnType<FormValues>;
	listFieldKey: string;
	renderFunction: (value: FieldType, index: number) => ReactElement;
	newFieldInitialValue: FieldType;
	newFieldButtonLabel: string;
	disableNewFieldbutton: boolean;
}

export function FieldList<FormValues, FieldType>({
	form,
	listFieldKey,
	renderFunction,
	newFieldInitialValue,
	newFieldButtonLabel = 'Add item',
	disableNewFieldbutton,
}: FieldListProps<FormValues, FieldType>) {
	const fields = form.getInputProps(listFieldKey).value as FieldType[];
	return (
		<>
			<Stack gap="xs">
				{fields.map((value, index) => (
					<Group key={index}>
						<Box style={{ flexGrow: 1 }}>{renderFunction(value, index)}</Box>
						<ActionIcon
							variant="light"
							size="lg"
							onClick={() => form.removeListItem(listFieldKey, index)}
						>
							<IconSquareRoundedMinus />
						</ActionIcon>
					</Group>
				))}
			</Stack>
			<Button
				mt="xs"
				variant="light"
				onClick={() => form.insertListItem(listFieldKey, newFieldInitialValue)}
				disabled={disableNewFieldbutton}
			>
				{newFieldButtonLabel}
			</Button>
		</>
	);
}
