import {
	Button,
	Fieldset,
	InputWrapper,
	Modal,
	Select,
	Space,
	Stack,
	TextInput,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Organizer, OrganizerType, Location } from '@prisma/client';

import { FieldList } from '@/components/form';

import { enumToSelectData } from '../util';

interface CreateOrganizerModalProps {
	opened: boolean;
	onClose: () => void;
	onCreateOrganizer: (organizer: Organizer) => Promise<void>;
}

interface CreateOrganizerForm {
	organizer: Partial<Organizer>;
	locations: Location[];
}

export function CreateOrganizerModal({
	opened,
	onClose,
	onCreateOrganizer,
}: CreateOrganizerModalProps) {
	//TODO: ZOD!
	const form = useForm<CreateOrganizerForm>({
		initialValues: {
			organizer: {
				name: '',
				type: undefined,
				websites: [],
			},
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
					const { organizer } = values;
					// TODO: loading state?
					// TODO: reset form on successful create
					onCreateOrganizer(organizer as Organizer);
					onClose();
				})}
			>
				<Fieldset legend="Basic information">
					<Stack gap="xs">
						<TextInput label="Name" {...form.getInputProps('organizer.name')} withAsterisk />

						<Select
							label="Type"
							data={enumToSelectData(OrganizerType)}
							{...form.getInputProps('organizer.type')}
							searchable
							withAsterisk
						/>
						<InputWrapper label="Websites / social media pages">
							<FieldList<CreateOrganizerForm, string>
								form={form}
								listFieldKey="organizer.websites"
								renderFunction={(_, index) => (
									<TextInput {...form.getInputProps(`organizer.websites.${index}`)} />
								)}
								newFieldInitialValue=""
								newFieldButtonLabel="Add URL"
								disableNewFieldbutton={
									form.values.organizer.websites?.some(
										(website) => !website || website.trim() === ''
									) ?? true
								}
							/>
						</InputWrapper>
					</Stack>
				</Fieldset>
				{/* TODO: implement using FieldList */}
				<Fieldset legend="Location(s)"></Fieldset>
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
