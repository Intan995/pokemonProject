"use client";

import Link from "next/link";
import 'antd/dist/reset.css'; // untuk Ant Design versi 5 ke atas


export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen"
    style={{
      backgroundImage: "url('/pokemon.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh'
    }}
    
    >
      <h1 className="text-8xl font-bold mb-4">Welcome to Pokedex</h1>
      <Link
        href="/login"
        className="bg-yellow-500 text-white text-2xl w-96 text-center py-4 rounded-full hover:bg-yellow-600"
      >
        Login
      </Link>
    </div>
  );
}

