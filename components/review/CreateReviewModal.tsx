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
import { Genre, Organizer, Review } from '@prisma/client';

import { RATINGS_INFO, enumToSelectData, humanizeEnumString } from '@/util';
import { IconCurrencyDollar } from '@tabler/icons-react';

interface CreateReviewModalProps {
	opened: boolean;
	organizer: Organizer;
	onClose: () => void;
	onCreateReview: (review: Review) => Promise<void>;
}

// TODO: reset the form after submitting
export function CreateReviewModal({
	opened,
	organizer,
	onClose,
	onCreateReview,
}: CreateReviewModalProps) {
	const theme = useMantineTheme();

	//TODO: ZOD!
	const form = useForm<Omit<Review, 'id' | 'createdAt' | 'updatedAt'>>({
		initialValues: {
			organizerId: organizer.id,
			description: '',
			genres: [],
			expensiveness: null,
			// TODO: avoid hardcoding all these?
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
			title={<Title order={3}>Add a review of {organizer.name}</Title>}
			centered
			size="xl"
		>
			<form
				onSubmit={form.onSubmit((values) => {
					// TODO: loading state? Things are fast now but after adding image upload it could take a while
					onCreateReview(values as Review);
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
