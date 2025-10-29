"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PokemonPage from "../component/pokemon";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "admin")
      router.push("/dashboard");
  }, [status, session]);

  if (status === "loading") return <p>Loading...</p>;

  return <PokemonPage />;
}
