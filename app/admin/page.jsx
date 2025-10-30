"use client";
import { useSession } from "next-auth/react";  //untuk mengecek status session user
import { useRouter } from "next/navigation"; //untuk navigasi programatik (redirect)
import { useEffect } from "react";  //untuk menjalankan efek samping (side effect)
import PokemonPage from "../component/pokemon";   //komponen yang menampilkan daftar Pokemon

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");  //kalau belum login di arahkan ke page /login
    if (status === "authenticated" && session?.user?.role !== "admin") //login dengan poketwo diarahkan ke /dashboard
      router.push("/dashboard");
  }, [status, session]);

  //loading state
  if (status === "loading") return <p>Loading...</p>;

  return <PokemonPage />;
}
