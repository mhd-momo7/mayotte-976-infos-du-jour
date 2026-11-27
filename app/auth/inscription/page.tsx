import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = { title: "Créer un compte – Mayotte 976" };

export default function SignUpPage() {
  return (
    <AuthCard
      eyebrow="REJOINDRE LA COMMUNAUTÉ"
      title="Créer un compte"
      description="Votre identité reste privée. Seul votre pseudonyme est visible des autres utilisateurs."
    >
      <SignUpForm />
    </AuthCard>
  );
}
