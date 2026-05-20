# TikSave — Téléchargeur de vidéos TikTok

Application web React + Vite pour télécharger des vidéos TikTok.

## Stack

- **React 18** + **TypeScript**
- **Vite** (bundler)
- **TailwindCSS** (design)
- **tikwm.com** (API de téléchargement)
- **localStorage** (bibliothèque locale)

## Installation

```bash
cd tiksave
npm install
npm run dev
```

## Fonctionnalités

- Coller un lien TikTok → récupérer la vidéo
- Aperçu : miniature, titre, auteur, likes, vues, durée
- Téléchargement MP4 sans watermark
- Bibliothèque locale (localStorage)
- Recherche et tri dans la bibliothèque
- Dark mode / Light mode
- Responsive (mobile + desktop)

## Structure

```
src/
├── components/
│   ├── Navbar.tsx        # Navigation bas (mobile) / haut (desktop)
│   └── VideoCard.tsx     # Carte vidéo bibliothèque
├── pages/
│   ├── DownloadPage.tsx  # Page principale téléchargement
│   ├── LibraryPage.tsx   # Bibliothèque des vidéos
│   └── SettingsPage.tsx  # Paramètres (dark mode, cache)
├── services/
│   ├── api.ts            # Appel tikwm.com + utilitaires
│   └── storage.ts        # CRUD localStorage
├── context/
│   └── ThemeContext.tsx  # Gestion dark/light mode
└── types/
    └── index.ts          # Types TypeScript
```

## Déploiement

```bash
npm run build
# Le dossier dist/ est prêt pour Netlify / Vercel / GitHub Pages
```
