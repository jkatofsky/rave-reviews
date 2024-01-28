import { Metadata } from 'next';
import { cache } from 'react';
import { revalidatePath } from 'next/cache';

import {getOrganizer} from '../../../api/organizer';
import {getReviews, createReview} from '../../../api/review';

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
    const reviews = await getReviews({ organizerId, page: 0, perPage: 100 });

    async function handleReviewCreation(formData: FormData) {
        'use server'
        await createReview(formData);
        revalidatePath("/organizer/[id]/page", "page");
    }

    return <>
        <div>
            <h1>The organizer:</h1>
            {JSON.stringify(organizer)}
        </div>
        <div>
            <h1>Its reviews:</h1>
            {JSON.stringify(reviews)}
            {/* TODO: client-side pagination of reviews (infinite scroll?) */}
        </div>
        <form action={handleReviewCreation}>
            {/* TODO: implement the form */}
        </form>
    </>
}