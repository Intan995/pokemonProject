"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PokemonPage from "../component/pokemon";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  //untuk membatasi akses laman dashboard hanya untuk poketwo
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "user") //session untuk menindetifikasi jika login user masuk ke /dashboard kalau admin ke /admin
      router.push("/admin");
  }, [status, session]);

  if (status === "loading") return <p>Loading...</p>;

  return <PokemonPage />;
}
