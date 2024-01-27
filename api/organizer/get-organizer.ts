import prisma from "../db";
import type { Organizer } from "@prisma/client";

const getOrganizer = async (id: number): Promise<Organizer | null> => {
    // TODO: also average the reviews for the organizer and return them alongside
    // then make the return type Organizer combined with other fields
    return await prisma.organizer.findUnique({
        where: {
            id
        }
    })
}

export default getOrganizer;