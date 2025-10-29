"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    await signIn("credentials", {
      username,
      password,
      callbackUrl: "/dashboard", // default redirect user
    });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center"
    >
     
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-3 p-6 shadow-xl/20 w-80"
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border-yellow-300 p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-yellow-300 p-2 rounded"
        />
        <button
          type="submit"
          className="bg-yellow-500 text-white py-2 rounded hover:bg-orange-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
