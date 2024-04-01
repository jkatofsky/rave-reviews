import { Button, Modal, Select, Space, TextInput, Textarea, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Organizer, OrganizerType } from '@prisma/client';

import { enumToSelectData } from '../util';

interface CreateOrganizerModalProps {
	opened: boolean;
	onClose: () => void;
	onCreateOrganizer: (organizer: Organizer) => Promise<void>;
}

interface CreateOrganizerForm {
	name: string;
	type: OrganizerType | null;
	websites: string; // TODO: make not based on newlines?
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
			size="lg"
		>
			<form
				onSubmit={form.onSubmit((values) => {
					// TODO: loading state?
					const websitesArray =
						values.websites.length > 0 ? values.websites.split(/\r?\n|\r|\n/g) : [];
					onCreateOrganizer({
						name: values.name,
						type: values.type,
						websites: websitesArray,
					} as Organizer);
					onClose();
				})}
			>
				<TextInput label="Name" {...form.getInputProps('name')} withAsterisk />
				<Space h="sm" />

				<Select
					label="Type"
					data={enumToSelectData(OrganizerType)}
					{...form.getInputProps('type')}
					searchable
					withAsterisk
				/>
				<Space h="sm" />
				<Textarea label="Websites (one per line)" {...form.getInputProps('websites')} />
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
