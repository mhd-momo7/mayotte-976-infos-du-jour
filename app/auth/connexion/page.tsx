import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Connexion – Mayotte 976" };

export default function LoginPage() {
  return (
    <AuthCard eyebrow="BON RETOUR" title="Se connecter" description="Connectez-vous pour signaler un événement.">
      <LoginForm />
    </AuthCard>
  );
}
