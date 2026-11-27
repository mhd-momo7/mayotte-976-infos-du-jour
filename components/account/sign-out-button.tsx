"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignOut() {
    setIsLoading(true);
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" className="secondary-button" onClick={handleSignOut} disabled={isLoading}>
      <LogOut size={17} aria-hidden="true" /> {isLoading ? "Déconnexion…" : "Se déconnecter"}
    </button>
  );
}
