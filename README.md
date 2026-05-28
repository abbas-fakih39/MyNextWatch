# MyNextWatch 🎬

MyNextWatch est une application web moderne de suivi de films et séries (Watchlist), développée dans le cadre du module Application Web B3.

## 🚀 Fonctionnalités
- **Authentification complète** : Inscription, connexion, et gestion de profil utilisateur (Avatar, Bio).
- **Catalogue TMDB** : Exploration des films et séries tendances, recherche en temps réel et détails complets (synopsis, casting, saisons).
- **Watchlist avancée** : Suivi des statuts de visionnage (En cours, Terminé, À voir, En pause, Abandonné) et notation personnelle sur 10.
- **Réactivité Instantanée** : Utilisation des *Universal Reactivity* (Svelte 5 Runes) pour un état global optimisé.

## 🛠️ Stack Technique
- **Framework** : [SvelteKit](https://kit.svelte.dev/)
- **Langage** : [TypeScript](https://www.typescriptlang.org/) (Strict)
- **Style** : [TailwindCSS v4](https://tailwindcss.com/)
- **BaaS (Backend)** : [Supabase](https://supabase.com/) (Auth, PostgreSQL, Row Level Security)
- **API Données** : [TMDB API](https://developer.themoviedb.org/docs)
- **CI / CD** : GitHub Actions & Vercel

## ⚙️ Lancement en local

1. **Cloner le repository**
   ```bash
   git clone <ton-repo-url>
   cd MyNextWatch
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Variables d'environnement**
   Copiez le fichier `.env.example` (à créer) en `.env.local` et remplissez vos clés Supabase et TMDB :
   ```env
   PUBLIC_SUPABASE_URL=your_supabase_url
   PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   TMDB_API_KEY=your_tmdb_api_key
   ```

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

## 📝 Auteur
Abbas (Projet Individuel)
