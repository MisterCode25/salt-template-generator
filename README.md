# Template Generator (React + Vite)

Migration du générateur de templates vers React avec Vite. Les données (templates, tokens) sont stockées dans `localStorage`.

## Démarrage
```bash
npm install
npm run dev   # http://localhost:5173
```

## Scripts
- `npm run dev` : dev server Vite
- `npm run build` : build production
- `npm run preview` : preview du build
- `npm test` : tests tokenEngine (remplacement de tokens)

## Structure
- `src/pages/ManageTemplates.jsx` : CRUD templates + variantes (onglets) + aperçus par langue.
- `src/pages/ManageTokens.jsx` : CRUD tokens.
- `src/pages/Home.jsx` : accueil (placeholder).
- `src/services` : stockage, templates, tokens, clipboard (layer data/services).
- `src/core` : token engine (pure functions).
- `src/components` : en-têtes communs.
- `css` : styles existants réutilisés.
- `images` : assets statiques conservés.

## Notes
- Les anciens fichiers statiques (dossier `html/` et `js/`) ont été retirés après migration.
- Les données sont persistées localement (`models`, `tokens` dans localStorage).
