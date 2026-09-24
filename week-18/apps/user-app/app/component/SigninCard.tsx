"use client"
import { signIn } from "next-auth/react";
import { useState } from "react";

export function SigninCard() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit() {
    setError("");
    const res = await signIn("credentials", {
      phone,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Invalid phone or password");
    }
  }

  return (
    <div className="flex flex-col gap-3 max-w-sm w-full">
      <input
        className="border rounded px-3 py-2"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        className="border rounded px-3 py-2"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={onSubmit}
      >
        Login
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <div className="flex-1 h-px bg-gray-200" />
        or
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        className="border rounded px-3 py-2"
        onClick={() => signIn("google")}
      >
        Sign in with Google
      </button>
    </div>
  );
}
