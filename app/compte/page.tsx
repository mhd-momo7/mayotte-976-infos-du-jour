import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, Lock, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PseudonymForm } from "@/components/account/pseudonym-form";
import { SignOutButton } from "@/components/account/sign-out-button";

export const metadata: Metadata = { title: "Mon compte – Mayotte 976" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/connexion");

  const [{ data: profile }, { data: identity }] = await Promise.all([
    supabase.from("profiles").select("public_pseudonym, created_at").eq("id", user.id).maybeSingle(),
    supabase.from("profile_identity").select("first_name, last_name").eq("user_id", user.id).maybeSingle(),
  ]);

  const isVerified = Boolean(user.email_confirmed_at);
  const memberSince = profile?.created_at
    ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(profile.created_at))
    : null;

  return (
    <main className="shell">
      <header className="top">
        <Link href="/" className="brand-mark" aria-label="Retour à l'accueil">
          976
        </Link>
        <div>
          <p className="eyebrow">MON COMPTE</p>
          <h1>{profile?.public_pseudonym ?? "Membre"}</h1>
        </div>
      </header>

      <section className="account-grid">
        <article className="panel">
          <div className="section-heading">
            <h2>Profil public</h2>
            <span className="tag">Visible par tous</span>
          </div>
          <p className="muted small">C&apos;est le seul nom affiché sur vos signalements.</p>
          <PseudonymForm initialPseudonym={profile?.public_pseudonym ?? ""} />
          {memberSince && <p className="muted small">Membre depuis le {memberSince}</p>}
        </article>

        <article className="panel">
          <div className="section-heading">
            <h2>Identité</h2>
            <span className="tag tag-private">
              <Lock size={12} aria-hidden="true" /> Privé
            </span>
          </div>
          <dl className="details">
            <div>
              <dt>Prénom</dt>
              <dd>{identity?.first_name ?? "–"}</dd>
            </div>
            <div>
              <dt>Nom</dt>
              <dd>{identity?.last_name ?? "–"}</dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>{user.email}</dd>
            </div>
          </dl>
          <p className={isVerified ? "status status-ok" : "status status-warn"}>
            {isVerified ? <BadgeCheck size={18} aria-hidden="true" /> : <ShieldAlert size={18} aria-hidden="true" />}
            {isVerified ? "Adresse e-mail vérifiée" : "Adresse e-mail non vérifiée"}
          </p>
        </article>
      </section>

      <section className="panel">
        <h2>Vos données</h2>
        <p className="muted small">
          Vos nom, prénom et e-mail ne sont jamais publiés. Consultez la{" "}
          <Link href="/confidentialite">politique de confidentialité</Link> pour savoir comment exercer vos droits
          (accès, rectification, suppression).
        </p>
        <SignOutButton />
      </section>
    </main>
  );
}
