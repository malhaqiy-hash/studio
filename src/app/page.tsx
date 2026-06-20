
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Jika sudah login, langsung ke beranda (feed)
        router.push("/feed");
      } else {
        // Jika belum, ke login
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="relative size-16 mb-4">
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-2xl" />
        <div className="absolute inset-0 border-4 border-accent rounded-2xl border-t-transparent animate-spin" />
      </div>
      <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Menghubungkan ke Jaringan...</p>
    </div>
  );
}
