"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PSEUDONYM_HINT, isValidPseudonym } from "@/lib/pseudonym";

export function PseudonymForm({ initialPseudonym }: { initialPseudonym: string }) {
  const router = useRouter();
  const [pseudonym, setPseudonym] = useState(initialPseudonym);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const value = pseudonym.trim();
    if (value === initialPseudonym) return;
    if (!isValidPseudonym(value)) {
      setMessage({ type: "error", text: `Pseudonyme invalide. ${PSEUDONYM_HINT}` });
      return;
    }

    setIsSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/connexion");
      return;
    }

    const { error } = await supabase.from("profiles").update({ public_pseudonym: value }).eq("id", user.id);
    setIsSaving(false);

    if (error) {
      setMessage({
        type: "error",
        text: error.code === "23505" ? "Ce pseudonyme est déjà utilisé." : "Impossible d'enregistrer le pseudonyme.",
      });
      return;
    }

    setMessage({ type: "success", text: "Pseudonyme mis à jour." });
    router.refresh();
  }

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="pseudonym">Pseudonyme</label>
        <input
          id="pseudonym"
          required
          minLength={3}
          maxLength={20}
          value={pseudonym}
          onChange={(e) => setPseudonym(e.target.value)}
        />
      </div>
      <button type="submit" className="primary-button" disabled={isSaving || pseudonym.trim() === initialPseudonym}>
        {isSaving ? "Enregistrement…" : "Enregistrer"}
      </button>
      {message && (
        <p className={message.type === "error" ? "form-error" : "form-success"} role="status">
          {message.text}
        </p>
      )}
    </form>
  );
}
