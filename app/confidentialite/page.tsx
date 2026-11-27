import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité – Mayotte 976",
  description: "Comment Mayotte 976 – Infos du jour protège vos données personnelles.",
};

export default function PrivacyPage() {
  return (
    <main className="shell prose">
      <Link href="/" className="secondary-link">
        ← Retour à l&apos;accueil
      </Link>
      <h1>Politique de confidentialité</h1>
      <p className="muted small">Document provisoire, à faire valider avant la mise en production.</p>

      <h2>Données collectées</h2>
      <ul>
        <li>
          <strong>Identité (privée)</strong> : prénom, nom et adresse e-mail, pour vérifier les comptes et lutter
          contre les abus. Ces données ne sont jamais affichées publiquement.
        </li>
        <li>
          <strong>Profil public</strong> : votre pseudonyme, seul nom visible sur vos signalements.
        </li>
        <li>
          <strong>Signalements</strong> : type d&apos;événement, position, commentaire, photos et vidéos, examinés par
          l&apos;équipe de modération avant publication.
        </li>
      </ul>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous pouvez accéder à vos données, les rectifier ou demander leur suppression. La
        suppression du compte efface aussi votre profil et vos signalements.
      </p>

      <h2>Bonnes pratiques</h2>
      <ul>
        <li>Ne publiez pas de visages, de plaques d&apos;immatriculation ou d&apos;informations personnelles.</li>
        <li>Ne prenez jamais de photo ou de vidéo en conduisant.</li>
      </ul>
    </main>
  );
}
