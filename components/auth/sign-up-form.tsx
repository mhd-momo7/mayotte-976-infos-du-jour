"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PSEUDONYM_HINT, isValidPseudonym } from "@/lib/pseudonym";

function signUpErrorMessage(error: unknown): string {
  const { code, status } = (error ?? {}) as { code?: string; status?: number };
  if (code === "weak_password") return "Choisissez un mot de passe plus robuste.";
  if (code === "email_address_invalid") return "Utilisez une adresse e-mail valide et réelle.";
  if (code === "email_address_not_authorized") {
    return "Impossible d'envoyer l'e-mail de confirmation à cette adresse pour le moment.";
  }
  if (code === "validation_failed") return "Vérifiez les informations saisies.";
  if (code === "over_email_send_rate_limit" || status === 429) {
    return "Trop de tentatives. Patientez quelques minutes avant de réessayer.";
  }
  return "Impossible de finaliser l'inscription. Veuillez réessayer.";
}

export function SignUpForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pseudonym, setPseudonym] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedPseudonym = pseudonym.trim();
    if (!isValidPseudonym(trimmedPseudonym)) {
      setError(`Pseudonyme invalide. ${PSEUDONYM_HINT}`);
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== repeatPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!consent) {
      setError("Vous devez accepter la politique de confidentialité.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    const { data: available, error: rpcError } = await supabase.rpc("is_pseudonym_available", {
      candidate: trimmedPseudonym,
    });
    if (rpcError) {
      setError("Impossible de vérifier le pseudonyme. Veuillez réessayer.");
      setIsLoading(false);
      return;
    }
    if (!available) {
      setError("Ce pseudonyme est déjà utilisé. Choisissez-en un autre.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
        data: {
          public_pseudonym: trimmedPseudonym,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          privacy_consent_at: new Date().toISOString(),
        },
      },
    });

    if (error) {
      setError(signUpErrorMessage(error));
      setIsLoading(false);
      return;
    }

    router.push("/auth/inscription-reussie");
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <fieldset className="fieldset">
        <legend>Identité (privée)</legend>
        <p className="muted small">
          Visible uniquement par vous et, si nécessaire, par l&apos;équipe de modération. Jamais affichée publiquement.
        </p>
        <div className="field-row">
          <div className="field">
            <label htmlFor="first-name">Prénom</label>
            <input
              id="first-name"
              autoComplete="given-name"
              required
              maxLength={80}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="last-name">Nom</label>
            <input
              id="last-name"
              autoComplete="family-name"
              required
              maxLength={80}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="fieldset">
        <legend>Profil public</legend>
        <div className="field">
          <label htmlFor="pseudonym">Pseudonyme</label>
          <input
            id="pseudonym"
            autoComplete="nickname"
            required
            minLength={3}
            maxLength={20}
            aria-describedby="pseudonym-hint"
            value={pseudonym}
            onChange={(e) => setPseudonym(e.target.value)}
          />
          <p id="pseudonym-hint" className="muted small">
            Seul ce nom apparaîtra sur vos signalements. {PSEUDONYM_HINT}
          </p>
        </div>
      </fieldset>

      <fieldset className="fieldset">
        <legend>Connexion</legend>
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
        <div className="field-row">
          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="repeat-password">Confirmation</label>
            <input
              id="repeat-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <label className="checkbox">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
        <span>
          J&apos;accepte la <Link href="/confidentialite">politique de confidentialité</Link> et le traitement de
          mes données pour la gestion de mon compte et la modération des signalements.
        </span>
      </label>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="primary-button" disabled={isLoading}>
        {isLoading ? "Création du compte…" : "Créer mon compte"}
      </button>
      <p className="form-footer">
        Déjà inscrit ? <Link href="/auth/connexion">Se connecter</Link>
      </p>
    </form>
  );
}
