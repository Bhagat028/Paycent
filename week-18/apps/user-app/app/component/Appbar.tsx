"use client"
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function Appbar() {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between items-center border-b px-8 py-4">
      <div className="text-2xl font-bold">PayTM</div>
      <div>
        {session ? (
          <button
            onClick={() => signOut()}
            className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none"
          >
            logo 
          </button>
        ) : (
          <Link
            href="/signin"
            className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
