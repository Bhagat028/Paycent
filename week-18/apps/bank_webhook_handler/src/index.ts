import express from "express";
import db from "@repo/db/client"
const app = express();

app.use(express.json());

app.post("/hdfcWebhook", async (req, res) => {

    //TODO: Add zod validation here?
    //TODO: Verify the request actually came from HDFC (webhook secret)
    const paymentInformation = {
        token: req.body.token,
        userId: Number(req.body.user_identifier),
        amount: Number(req.body.amount)
    };

    try {
        // Both updates must succeed or neither should, so run them in one transaction
        await db.$transaction([
            db.balance.update({
                where: {
                    userId: paymentInformation.userId
                },
                data: {
                    amount: {
                        increment: paymentInformation.amount
                    }
                }
            }),
            db.onRampTransaction.update({
                where: {
                    token: paymentInformation.token,
                },
                data: {
                    status: "Success"
                }
            })
        ]);

        res.status(200).json({
            message: "captured"
        })
    } catch (e) {
        console.error(e);
        // Non-2xx so the bank retries the webhook
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }
})

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`bank_webhook_handler listening on port ${PORT}`);
});
