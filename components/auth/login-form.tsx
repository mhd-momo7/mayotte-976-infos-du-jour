"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function loginErrorMessage(error: unknown): string {
  const { code, status } = (error ?? {}) as { code?: string; status?: number };
  if (code === "email_not_confirmed") {
    return "Veuillez d'abord confirmer votre adresse e-mail grâce au lien reçu.";
  }
  if (code === "over_request_rate_limit" || status === 429) {
    return "Trop de tentatives. Patientez un instant avant de réessayer.";
  }
  if (code === "invalid_credentials") {
    return "Adresse e-mail ou mot de passe incorrect.";
  }
  return "Une erreur inattendue est survenue. Veuillez réessayer.";
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(loginErrorMessage(error));
      setIsLoading(false);
      return;
    }

    router.push("/compte");
    router.refresh();
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate={false}>
      <div className="field">
        <label htmlFor="email">Adresse e-mail</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="primary-button" disabled={isLoading}>
        {isLoading ? "Connexion…" : "Se connecter"}
      </button>
      <p className="form-footer">
        Pas encore de compte ? <Link href="/auth/inscription">Créer un compte</Link>
      </p>
    </form>
  );
}
