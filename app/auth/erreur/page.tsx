import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = { title: "Erreur de connexion – Mayotte 976" };

export default function AuthErrorPage() {
  return (
    <AuthCard
      eyebrow="OUPS"
      title="Lien invalide ou expiré"
      description="Ce lien de confirmation n'est plus valable. Reconnectez-vous ou recommencez l'inscription."
    >
      <Link href="/auth/connexion" className="secondary-link">
        Retour à la connexion
      </Link>
    </AuthCard>
  );
}
