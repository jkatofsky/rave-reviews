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
import { City, OrganizerType } from '@prisma/client';

import { CreateOrganizer, CreateLocation } from '@/shared/types';
import { autocompleteCities } from '@/data/city';
import { FieldList } from '@/components/form';

import { enumToSelectData } from '../util';
import { useEffect, useMemo, useState } from 'react';

const NEW_CITY_ID = 'NEW';

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
	// TODO: fetch this on type in the Select, based on the select filter query
	const [cities, setCities] = useState<City[]>([]);
	useEffect(() => {
		async function setAutocompletedCities() {
			const autocompletedCities = await autocompleteCities('');
			setCities(autocompletedCities);
		}
		setAutocompletedCities();
	}, []);

	const [areAddressDetailsExpanded, areAddressDetailsExpandedController] = useDisclosure(false);

	// TODO: when the id is NEW_CITY_ID, render the row differently
	return (
		<>
			<Select
				searchable
				label="City"
				data={cities.map(({ id, name, region, country }) => ({
					value: !id || id === -1 ? NEW_CITY_ID : id.toString(),
					label: `${name}, ${region}, ${country}`,
				}))}
				onChange={(value, options) => {
					let city;
					if (!value) {
						city = { name: '', region: '', country: '' };
					} else {
						const [name, region, country] = options.label.split(', ');
						city = { name, region, country };
					}

					form.setFieldValue(`locations.${index}.city.connectOrCreate.create`, city);

					if (value !== NEW_CITY_ID) {
						form.setFieldValue(`locations.${index}.city.connectOrCreate.where`, {
							id: Number(value),
						});
					}
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
	//TODO: ZOD!
	const form = useForm<CreateOrganizer>({
		initialValues: {
			name: '',
			type: OrganizerType.BarOrClub,
			reviewCount: 0,
			websites: [],
			locations: [],
		},
	});

	console.log(form.values);

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
					// TODO: loading state?
					// TODO: reset form on successful create
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
							locations.some((location) => !location.city.connectOrCreate?.create.name)
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
