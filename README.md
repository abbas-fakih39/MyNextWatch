# MyNextWatch

Application web de suivi de films et séries, développée dans le cadre du module Application Web B3.

![CI](https://github.com/abbas-fakih39/MyNextWatch/actions/workflows/ci.yml/badge.svg)


## Fonctionnalités

- **Authentification** : Inscription, connexion, déconnexion via Supabase Auth
- **Profil utilisateur** : Avatar (initiales), bio, stats de watchlist
- **Catalogue TMDB** : Films et séries tendances, populaires, recherche globale
- **Pages de détail** : Synopsis, casting, note, genres, saisons (séries), films/séries similaires
- **Watchlist personnelle** : 5 statuts : En cours, Vu, À voir, En pause, Abandonné
- **Notation** : Note personnelle /10 par titre
- **Carousels** : Navigation horizontale style Netflix sur la page d'accueil et les pages de détail
- **Recherche dans la watchlist** : Filtre en temps réel sur tous les titres
- **Interface réactive** : Mises à jour optimistes (UI avant confirmation serveur)


## Stack technique

| Couche | Technologie |
|---|---|
| Framework | SvelteKit 2 + Svelte 5 (Runes) |
| Langage | TypeScript strict |
| Style | Tailwind CSS v4 |
| Auth + BDD | Supabase (PostgreSQL + RLS) |
| Données | TMDB API v3 |
| CI/CD | GitHub Actions + Vercel |


## Architecture

```
src/
├── lib/
│   ├── components/       # MediaCard, MediaGrid, Hero, Navbar, Toast
│   ├── server/           # tmdb.ts : client TMDB (server-only)
│   ├── stores/           # auth.svelte.ts, watchlist.svelte.ts, toast.svelte.ts
│   ├── types/            # tmdb.ts, watchlist.ts, profile.ts
│   └── utils/            # media.ts, authErrors.ts
├── routes/
│   ├── +layout.svelte    # Layout global + Navbar
│   ├── +page.svelte      # Accueil (hero + carousels)
│   ├── movie/[id]/       # Détail film
│   ├── tv/[id]/          # Détail série
│   ├── movies/           # Browse films
│   ├── tv/               # Browse séries
│   ├── search/           # Recherche globale
│   ├── watchlist/        # Watchlist utilisateur
│   ├── profile/          # Profil utilisateur
│   └── auth/             # Login / inscription
└── hooks.server.ts       # Middleware Supabase SSR + protection des routes
```

**Convention** : les mutations (ajout/suppression/mise à jour watchlist) passent toujours par des `+page.server.ts` actions, jamais en direct depuis le client.


## Base de données (Supabase)

**Table `profiles`** : créée automatiquement à l'inscription via trigger

**Table `watchlist`**
| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | Clé primaire |
| `user_id` | uuid | Référence `profiles.id` |
| `tmdb_id` | integer | ID TMDB du titre |
| `media_type` | text | `movie` ou `tv` |
| `title` | text | Titre (cache local) |
| `poster_path` | text | Chemin poster TMDB |
| `status` | text | Statut de visionnage |
| `rating` | integer | Note /10 (nullable) |
| `added_at` | timestamptz | Date d'ajout |

RLS activée : chaque utilisateur ne voit et ne modifie que ses propres entrées.


## Lancement en local

**Prérequis** : Node.js 22+, un projet Supabase, une clé TMDB

```bash
# 1. Cloner
git clone https://github.com/abbas-fakih39/MyNextWatch.git
cd MyNextWatch

# 2. Installer les dépendances
npm install

# 3. Variables d'environnement
cp .env.example .env.local
# Remplir les 3 valeurs dans .env.local

# 4. Lancer
npm run dev
```

**.env.local**
```env
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
TMDB_API_KEY=abc123...
```


## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualiser le build |
| `npm run check` | Vérification TypeScript |
| `npm run lint` | ESLint + Prettier |
| `npm run format` | Formater le code |


## CI/CD

Chaque push sur `main` déclenche le pipeline GitHub Actions :
1. Lint (ESLint + Prettier)
2. Type check (svelte-check)
3. Build

Le déploiement est automatique sur **Vercel** à chaque push sur `main`.


## Auteur

Abbas Fakih : Projet individuel B3
