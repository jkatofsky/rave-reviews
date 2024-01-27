import prisma from "../db";
import type { Organizer } from "@prisma/client";

const getOrganizer = async (id: number): Promise<Organizer | null> => {
    return await prisma.organizer.findUnique({
        where: {
            id
        }
    })
}

export default getOrganizer;