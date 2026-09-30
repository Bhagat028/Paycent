"use server"

import { randomUUID } from "crypto"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client"

export async function createOnRamptxn(amount: number, provider: string) {
    const session = await getServerSession(authOptions)
    const userId = session.user.id
    if (!userId) {
        throw new Error("Unauthorized")
    }

    // Ideally this token comes from the bank's API; generate one until that's wired up
    const token = randomUUID()

    await prisma.onRampTransaction.create({
        data: {
            userId: Number(userId),
            amount: amount,
            status: "Processing",
            provider,
            token,
            startTime: new Date(),
        }
    })

    return {
       message: "On Ramp Transaction created successfully",
    }
}
