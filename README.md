# Portfolio — Ephraim Anani

Site multi-pages inspiré du style de lukebaffait.fr (fond sombre, transitions
de page, smooth scroll, terminal animé) adapté à ton profil fullstack.

## Lancer en local

Aucune installation requise (pas de build tool). Depuis ce dossier :

```bash
python3 -m http.server 8080
```

Puis ouvre `http://localhost:8080/` dans le navigateur.

> Important : ouvre toujours via un serveur local (pas en double-cliquant
> sur le fichier), sinon les liens absolus (`/css/...`, `/works/...`) ne
> fonctionneront pas.

## Structure

```
index.html              → page d'accueil
works/index.html         → liste des projets (avec filtres)
works/projet-01/index.html → exemple de page projet (gabarit à dupliquer)
contact/index.html       → page contact
css/style.css            → styles globaux + design system
css/pages.css             → styles spécifiques works/contact/projet
js/main.js                → Lenis (smooth scroll), GSAP (animations),
                             transitions de page maison, terminal animé,
                             preview projet qui suit le curseur
assets/images/            → placeholders SVG (à remplacer par tes captures)
```

## Pour ajouter un vrai projet

1. Duplique le dossier `works/projet-01/` en `works/projet-02/`, etc.
2. Modifie le titre, la stack, le texte de présentation.
3. Remplace le bloc `.cover-frame` par une vraie image :
   ```html
   <img src="/assets/images/projets/mon-projet.jpg" alt="Capture du projet" />
   ```
4. Ajoute une ligne dans `works/index.html` (copie un `.project-row`
   existant) et mets à jour `data-preview` avec ta vraie image.
5. Si tu veux aussi l'afficher en page d'accueil, fais pareil dans `index.html`.

## Personnalisation rapide

- **Couleur d'accent** : variable `--accent` dans `css/style.css` (actuellement `#d98e3d`)
- **Texte du terminal** (hero) : tableau `lines` dans `js/main.js`, fonction `initTerminal()`
- **Liens sociaux** : remplace les `href="https://github.com/"` etc. par tes vrais profils
  dans `index.html`, `works/index.html`, `contact/index.html`

## Notes techniques

- Animations : GSAP + ScrollTrigger (CDN), Lenis pour le smooth scroll (CDN)
- Transitions de page faites maison en vanilla JS (overlay qui glisse, façon Barba.js)
- `prefers-reduced-motion` respecté (animations désactivées si l'utilisateur le demande)
- Formulaire de contact : actuellement juste un retour visuel JS, **pas de
  backend branché**. Pour le rendre fonctionnel, connecte-le à un service
  comme Formspree, Resend, ou une route API que tu héberges.
