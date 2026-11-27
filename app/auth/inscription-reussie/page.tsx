import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = { title: "Vérifiez votre e-mail – Mayotte 976" };

export default function SignUpSuccessPage() {
  return (
    <AuthCard eyebrow="DERNIÈRE ÉTAPE" title="Vérifiez votre adresse e-mail">
      <div className="notice">
        <MailCheck aria-hidden="true" />
        <p>
          Un lien de confirmation vient de vous être envoyé. Cliquez dessus pour activer votre compte : vous pourrez
          ensuite publier des signalements.
        </p>
      </div>
      <p className="muted small">Pensez à vérifier vos courriers indésirables si vous ne le voyez pas.</p>
      <Link href="/auth/connexion" className="secondary-link">
        Aller à la connexion
      </Link>
    </AuthCard>
  );
}
