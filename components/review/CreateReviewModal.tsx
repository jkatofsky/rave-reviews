import {
	Button,
	Fieldset,
	Group,
	InputWrapper,
	Modal,
	MultiSelect,
	Rating,
	Space,
	Textarea,
	Title,
	useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Genre, Organizer, Prisma } from '@prisma/client';
import { IconCurrencyDollar } from '@tabler/icons-react';

import { CreateReview } from '@/shared/types';
import { RATINGS_INFO } from '@/shared/constants';

import { enumToSelectData, humanizeEnumString } from '../util';

interface CreateReviewModalProps {
	opened: boolean;
	organizer: Organizer;
	onClose: () => void;
	onCreateReview: (review: CreateReview) => Promise<void>;
}

export function CreateReviewModal({
	opened,
	organizer,
	onClose,
	onCreateReview,
}: CreateReviewModalProps) {
	const theme = useMantineTheme();

	const form = useForm<CreateReview>({
		initialValues: {
			organizer: {
				connect: {
					id: organizer.id,
				},
			},
			description: '',
			genres: [],
			expensiveness: null,
			soundSystemRating: 0,
			djAndMusicRating: 0,
			crowdPlurRating: 0,
			safetyAndComfortRating: 0,
			venueRating: 0,
			valueForMoneyRating: 0,
			visualsRating: null,
			staffRating: null,
			foodAndDrinkRating: null,
		},
	});

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={`Add a review of ${organizer.name}`}
			centered
			size="xl"
		>
			<form
				onSubmit={form.onSubmit((values) => {
					onCreateReview(values);
					onClose();
				})}
			>
				<Fieldset legend="Basic information">
					<Textarea
						{...form.getInputProps('description')}
						label="Description"
						description={`Describe your experience at ${organizer.name}`}
						withAsterisk
					/>
					<Space h="sm" />
					{/* TODO: somehow find a way to style the options/pills? */}
					<MultiSelect
						{...form.getInputProps('genres')}
						label="Genres"
						description={`Which genres were played at ${organizer.name}?`}
						data={enumToSelectData(Genre)}
						searchable
						clearable
						withAsterisk
					/>
					<Space h="sm" />
					<InputWrapper
						label="Expensiveness"
						description={
							<>
								Relative to other organizers of the type{' '}
								<b>{humanizeEnumString(organizer.type, false)}</b>, how expensive was your
								experience at {organizer.name}?
							</>
						}
					>
						<Rating
							{...form.getInputProps('expensiveness')}
							count={4}
							mt="xs"
							emptySymbol={<IconCurrencyDollar color={theme.colors.gray[3]} size={40} stroke={3} />}
							fullSymbol={
								<IconCurrencyDollar color={theme.colors.yellow[6]} size={40} stroke={3} />
							}
						/>
					</InputWrapper>
				</Fieldset>
				<Space h="md" />
				<Fieldset legend="Rating categories">
					<Group align="top" justify="space-between">
						{[...RATINGS_INFO.entries()].map((ratingInfo, index) => (
							<InputWrapper
								w={200}
								key={index}
								label={ratingInfo[1].title}
								description={
									typeof ratingInfo[1].creationDescription === 'function'
										? ratingInfo[1].creationDescription(organizer)
										: ratingInfo[1].creationDescription
								}
								withAsterisk={ratingInfo[1].required}
							>
								<Rating {...form.getInputProps(ratingInfo[0])} count={5} size="xl" mt="xs" />
							</InputWrapper>
						))}
					</Group>
				</Fieldset>
				<Space h="sm" />
				<Button
					type="submit"
					fullWidth
					variant="gradient"
					gradient={{ from: 'blue', to: 'purple' }}
				>
					Submit review
				</Button>
			</form>
		</Modal>
	);
}
