import { NextResponse } from "next/server";
import { PrismaClient } from "@repo/db/client";

const clint = new PrismaClient()

export const GET = async() => {
    await clint.user.create({
         data:{
            age: 12 ,
            name:"test",
            number: `test-${Date.now()}`,
            password:"test-placeholder"
        }
    })
    return NextResponse.json({
 message: "hi there"

    })
}