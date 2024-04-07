import {
	Anchor,
	Button,
	Collapse,
	Fieldset,
	Group,
	InputWrapper,
	Modal,
	Select,
	Stack,
	TextInput,
	Title,
} from '@mantine/core';
import { UseFormReturnType, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { OrganizerType } from '@prisma/client';

import { CreateOrganizer, CreateLocation } from '@/shared/types';
import { FieldList } from '@/components/form';
import { CitySuggest } from '@/components/search';

import { enumToSelectData } from '../util';

interface CreateOrganizerModalProps {
	opened: boolean;
	onClose: () => void;
	onCreateOrganizer: (organizer: CreateOrganizer) => Promise<void>;
}

function LocationForm({
	index,
	form,
}: {
	index: number;
	form: UseFormReturnType<CreateOrganizer>;
}) {
	const [areAddressDetailsExpanded, areAddressDetailsExpandedController] = useDisclosure(false);

	return (
		<>
			<CitySuggest
				onSelect={({ name, region, country, id }) => {
					form.setFieldValue(`locations.${index}.city.connectOrCreate`, {
						create: {
							name,
							region,
							country,
						},
						where: { id },
					});
				}}
			/>
			<Anchor
				mt="xs"
				mb="xs"
				component="button"
				type="button"
				onClick={() => {
					if (areAddressDetailsExpanded) {
						form.setFieldValue(`locations.${index}.streetAddress`, '');
						form.setFieldValue(`locations.${index}.postalCode`, '');
					}
					areAddressDetailsExpandedController.toggle();
				}}
			>
				{areAddressDetailsExpanded ? 'Clear' : 'Add'} address
			</Anchor>
			<Collapse in={areAddressDetailsExpanded}>
				<Group gap="xs">
					<TextInput
						label="Street address"
						{...form.getInputProps(`locations.${index}.streetAddress`)}
						style={{ flexGrow: 1 }}
					/>
					<TextInput
						label="Postal code"
						{...form.getInputProps(`locations.${index}.postalCode`)}
						w={100}
					/>
				</Group>
			</Collapse>
		</>
	);
}

export function CreateOrganizerModal({
	opened,
	onClose,
	onCreateOrganizer,
}: CreateOrganizerModalProps) {
	const form = useForm<CreateOrganizer>({
		initialValues: {
			name: '',
			type: OrganizerType.BarOrClub,
			reviewCount: 0,
			websites: [],
			locations: [],
		},
	});

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={<Title order={3}>Create an organizer</Title>}
			centered
			size="lg"
		>
			<form
				onSubmit={form.onSubmit((values) => {
					onCreateOrganizer(values);
					onClose();
				})}
			>
				<Fieldset legend="Basic information">
					<Stack gap="xs">
						<TextInput label="Name" {...form.getInputProps('name')} withAsterisk />

						<Select
							label="Type"
							data={enumToSelectData(OrganizerType)}
							{...form.getInputProps('type')}
							searchable
							withAsterisk
						/>
						<InputWrapper label="Websites / social media pages">
							<FieldList<CreateOrganizer, string>
								form={form}
								listFieldKey="websites"
								renderFunction={(_, index) => (
									<TextInput {...form.getInputProps(`websites.${index}`)} />
								)}
								newFieldInitialValue=""
								newFieldButtonLabel="Add URL"
								disableNewFieldButton={(websites) =>
									websites?.some((website) => !website || website.trim() === '') ?? true
								}
							/>
						</InputWrapper>
					</Stack>
				</Fieldset>
				<Fieldset legend="Location(s)">
					<FieldList<CreateOrganizer, CreateLocation>
						form={form}
						listFieldKey="locations"
						renderFunction={(_, index) => <LocationForm index={index} form={form} />}
						newFieldInitialValue={{
							city: {
								connectOrCreate: {
									where: { id: -1 },
									create: { name: '', region: '', country: '' },
								},
							},
							streetAddress: '',
							postalCode: '',
						}}
						newFieldButtonLabel="Add location"
						disableNewFieldButton={(locations) =>
							locations.some((location) => location.city.connectOrCreate?.where.id === -1)
						}
					/>
				</Fieldset>
				<Button
					type="submit"
					fullWidth
					mt="lg"
					variant="gradient"
					gradient={{ from: 'blue', to: 'purple' }}
				>
					Create organizer
				</Button>
			</form>
		</Modal>
	);
}
