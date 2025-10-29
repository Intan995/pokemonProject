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
        style={{
          backgroundImage: "url('/pokeball.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh'
        }}
    >
    
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-3 p-6 shadow-xl/20 w-80 bg-white rounded"
      >
        <h1 className="text-3xl font-medium mb-4 text-center text-yellow">Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border bg-white border-yellow-300 p-2 rounded"
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
          className="bg-yellow-500 text-white py-2 rounded hover:bg-orange-600 cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  );
}
