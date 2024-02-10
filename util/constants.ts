import { Organizer } from '@prisma/client';

type RatingInfo = {
	title: string;
	creationDescription?: string | ((organizer: Organizer) => string);
	required: boolean; //TODO: is there a way to get this info from Prisma?
};

const RATINGS_INFO: Map<string, RatingInfo> = new Map();
RATINGS_INFO.set('djAndMusicRating', {
	title: 'DJ and music',
	creationDescription:
		'Was the DJ good at mixing and song selection? Was the music to your expectations?',
	required: true,
});
RATINGS_INFO.set('soundSystemRating', {
	title: 'Sound system',
	creationDescription:
		'How did the speakers sound? Were they at a good volume, clear, and have quality bass?',
	required: true,
});
RATINGS_INFO.set('crowdPlurRating', {
	title: 'Crowd PLUR',
	creationDescription: (organizer) =>
		`Did the other ravers at ${organizer.name} embody PLUR (peace, love, respect, and unity)?`,
	required: true,
});
RATINGS_INFO.set('safetyAndComfortRating', {
	title: 'Safety and comfort',
	creationDescription: (organizer) =>
		`Did you feel safe at ${organizer.name}? Were there ample safe-partying resources and security personnel?`,
	required: true,
});
RATINGS_INFO.set('venueRating', {
	title: 'Venue',
	creationDescription:
		'How did you find the physical space? Was it clean, aesthetically pleasing, and well-thought-out?',
	required: true,
});
RATINGS_INFO.set('valueForMoneyRating', {
	title: 'Value for money',
	creationDescription: (organizer) =>
		`Was your experience at ${organizer.name} worth the money you paid?`,
	required: true,
});
RATINGS_INFO.set('visualsRating', {
	title: 'Visuals',
	creationDescription:
		'How did you find the visuals - for example, lighting, projections, smoke, or stage design?',
	required: false,
});
RATINGS_INFO.set('staffRating', {
	title: 'Staff',
	creationDescription: 'Were the staff friendly and respectful?',
	required: false,
});
RATINGS_INFO.set('foodAndDrinkRating', {
	title: 'Food and drink',
	creationDescription: 'How were the food and/or drinks?',
	required: false,
});

const NUMBER_OF_TOP_REVIEWS_PER_ORGANIZER = 5;

export { RATINGS_INFO, NUMBER_OF_TOP_REVIEWS_PER_ORGANIZER };
