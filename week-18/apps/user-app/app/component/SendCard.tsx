"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../lib/actions/p2pTransfer";

export default function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    return <div className="flex justify-center pt-16">
        <div className="w-full max-w-md">
            <Card title="Send Money">
                <TextInput placeholder={"Phone number"} label="Number" onChange={(value) => {
                    setNumber(value.trim())
                }} />
                <TextInput placeholder={"Amount (INR)"} label="Amount" onChange={(value) => {
                    setAmount(value)
                }} />
                <div className="flex justify-center pt-4">
                    <Button
                        className="text-white bg-brand hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer disabled:opacity-50"
                        onClick={async () => {
                            const rupees = Number(amount);
                            if (!number || !rupees || rupees <= 0) {
                                setStatus({ success: false, message: "Please enter a valid number and amount" });
                                return;
                            }
                            setLoading(true);
                            setStatus(await p2pTransfer(number, Math.round(rupees * 100)));
                            setLoading(false);
                        }}
                    >
                        {loading ? "Sending..." : "Send"}
                    </Button>
                </div>
                {status && (
                    <div className={`pt-4 text-center text-sm ${status.success ? "text-green-600" : "text-red-600"}`}>
                        {status.message}
                    </div>
                )}
            </Card>
        </div>
    </div>
}
 