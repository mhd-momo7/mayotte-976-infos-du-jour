import Link from "next/link";

type AuthCardProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function AuthCard({ eyebrow, title, description, children }: AuthCardProps) {
  return (
    <main className="auth-shell">
      <Link href="/" className="auth-brand" aria-label="Retour à l'accueil">
        <span className="brand-mark" aria-hidden="true">976</span>
        <span>
          <span className="eyebrow">MAYOTTE 976</span>
          <strong>INFOS DU JOUR</strong>
        </span>
      </Link>
      <section className="auth-card">
        <p className="eyebrow eyebrow-dark">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="muted auth-description">{description}</p>}
        {children}
      </section>
    </main>
  );
}
