"use server";
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client"

// TEMP: race-condition experiment. Set the delay back to 0 when done.
const SIMULATE_DELAY_MS = 4000;
const USE_ROW_LOCK = true;

// `amount` is in paise
export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions)
    const from = Number(session?.user?.id)
    if (!from) {
        return { success: false, message: "Unauthorized" };
    }

    if (!Number.isInteger(amount) || amount <= 0) {
        return { success: false, message: "Enter a valid amount" };
    }

    const toUser = await prisma.user.findFirst({
        where: {
            number: to,
        },
    });

    if (!toUser) {
        return { success: false, message: "User not found" };
    }

    if (toUser.id === from) {
        return { success: false, message: "You can't send money to yourself" };
    }

    try {
        await prisma.$transaction(async (tx) => {
            // Lock the sender's balance row so concurrent transfers can't both pass the check
            if (USE_ROW_LOCK) {
                await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${from} FOR UPDATE`;
            }

            const fromBalance = await tx.balance.findUnique({
                where: {
                    userId: from,
                },
            });

            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error("Insufficient balance");
            }

            if (SIMULATE_DELAY_MS) {
                await new Promise(r => setTimeout(r, SIMULATE_DELAY_MS));
            }

            await tx.balance.update({
                where: {
                    userId: from,
                },
                data: { amount: { decrement: amount } },
            });

            await tx.balance.upsert({
                where: {
                    userId: toUser.id,
                },
                update: { amount: { increment: amount } },
                create: { userId: toUser.id, amount, locked: 0 },
            });
        }, { timeout: 15000 });
    } catch (e) {
        return { success: false, message: e instanceof Error ? e.message : "Transfer failed" };
    }

    return { success: true, message: "Money sent" };
}
