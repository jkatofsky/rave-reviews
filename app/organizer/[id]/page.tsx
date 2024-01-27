import { Metadata } from 'next';
import { cache } from 'react';

import {getOrganizer} from '../../../api/organizer';
import {getReviews} from '../../../api/review';

const cachedGetOrganizer = cache(async (organizerId: number) => await getOrganizer(organizerId));

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const organizerId  = Number(params.id);
    const organizer = await cachedGetOrganizer(organizerId);

    return {
        title: `${organizer?.name} | Rave Radar`,
    }
}

export default async function Organizer({ params }: { params: { id: string } }) {
    const organizerId  = Number(params.id);
    const organizer = await cachedGetOrganizer(organizerId);
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