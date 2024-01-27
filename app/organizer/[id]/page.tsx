import { Metadata } from 'next';
import {getOrganizer} from '../../../api/organizer';
import {getReviews} from '../../../api/review';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    // TODO this is duplicated code from with the component.
    // Also, it's also just really stupid that I have to fetch this again
    const organizerId  = Number(params.id);
    const organizer = await getOrganizer(organizerId);

    return {
        title: `${organizer?.name} | Rave Radar`,
    }
}

export default async function Organizer({ params }: { params: { id: string } }) {
    const organizerId  = Number(params.id);
    const organizer = await getOrganizer(organizerId);
    const reviews = await getReviews({ organizerId, page: 0, perPage: 10 });

    return <>
        <div>
            <h1>The organizer:</h1>
            {JSON.stringify(organizer)}
        </div>
        <div>
            <h1>Its reviews:</h1>
            {JSON.stringify(reviews)}
        </div>
    </>
}