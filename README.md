# MAYOTTE 976 – Infos du jour

Prototype initial d'une application web progressive (PWA) pour centraliser :
- Trafic routier
- Sécurité et dangers
- Météo
- Perturbations des barges

## Pré-requis
- Node.js 20+
- Un compte Supabase

## Installation locale
```bash
npm install
cp .env.example .env.local
npm run dev
```
Puis ouvrir http://localhost:3000.

## Connexion Supabase
1. Créer un projet Supabase.
2. Copier l'URL du projet et la clé anon dans `.env.local`.
3. Exécuter `supabase/schema.sql` dans le SQL Editor.
4. Mettre en place les politiques RLS avant d'autoriser toute écriture.
5. Configurer la vérification d'adresse e-mail et le flux de création du profil.

## État du prototype
L'interface et le formulaire de démonstration sont présents. Les signalements ne sont pas encore envoyés à un serveur. La carte, l'authentification, les uploads médias, la modération, les notifications et les flux météo/barges restent à connecter.

## Sécurité et confidentialité
- Ne jamais exposer la clé `service_role` dans le navigateur.
- Garder les signalements en attente de modération avant publication.
- Limiter taille, durée et formats des médias.
- Vérifier les contenus et retirer les données personnelles visibles.
- Prévoir une politique de confidentialité et une durée de conservation des données.
