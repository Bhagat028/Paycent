"use client"
import { Provider } from "jotai";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

export const Providers = ({children, session}: {children: React.ReactNode, session: Session | null}) => {
    return <SessionProvider session={session}>
        <Provider>
            {children}
        </Provider>
    </SessionProvider>
}
