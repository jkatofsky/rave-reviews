import { Button, Group, Modal, Select, Space, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Organizer, OrganizerType } from '@prisma/client';

import { enumToSelectData } from '../../util';

interface CreateOrganizerModalProps {
	opened: boolean;
	onClose: () => void;
	onCreateOrganizer: (organizer: Organizer) => Promise<void>;
}

interface CreateOrganizerForm {
	name: string;
	type: OrganizerType | null;
	websites: string; // TODO: make not comma sepereated
}

export function CreateOrganizerModal({
	opened,
	onClose,
	onCreateOrganizer,
}: CreateOrganizerModalProps) {
	//TODO: ZOD!
	const form = useForm<CreateOrganizerForm>({
		initialValues: {
			name: '',
			type: null,
			websites: '',
		},
	});

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={<Title order={3}>Create an organizer</Title>}
			centered
			size="xl"
		>
			<form
				onSubmit={form.onSubmit((values) => {
					// TODO: loading state?
					const websitesArray = values.websites.replace(/\s/g, '').split(',');
					onCreateOrganizer({
						name: values.name,
						type: values.type,
						websites: websitesArray,
					} as Organizer);
					onClose();
				})}
			>
				<Group grow>
					<TextInput label="Name" {...form.getInputProps('name')} withAsterisk />
					<Select
						label="Type"
						data={enumToSelectData(OrganizerType)}
						{...form.getInputProps('type')}
						searchable
						withAsterisk
					/>
				</Group>
				<Space h="sm" />
				<TextInput label="Websites (comma separated)" {...form.getInputProps('websites')} />
				<Button type="submit" fullWidth mt="lg">
					Create organizer
				</Button>
			</form>
		</Modal>
	);
}
