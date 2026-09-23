# COR-TECH — refonte du site public

Refonte du portail de l'association, basée sur la maquette et sur les pages fournies. Le même menu et le même pied de page relient l'accueil, les activités, les événements, Révisions Ludik, l'accès au club, le Labo Ludik, Le Labo pour adultes, les actualités, le bénévolat et les mentions légales.

## Mettre en ligne

Le projet est un site statique. Déposez le contenu de ce dossier à la racine de votre hébergement (GitHub Pages, Netlify, etc.). Pour un aperçu local, lancez `python3 -m http.server 8000` et ouvrez `http://localhost:8000`.

Sur Netlify, utilisez `npm run build` avec le dossier de publication `dist`. Cette commande copie tous les jeux et pages annexes.

## Événements

Les prochains événements sont lus dans `events.json`. Le site cache automatiquement ceux dont la date est passée. La date doit être au format `AAAA-MM-JJ`. Exemple :

```json
{
  "id": "ia-1-2026-10-16",
  "date": "2026-10-16",
  "title": "Atelier IA niveau 1",
  "time": "20h30–22h00",
  "price": 5,
  "capacity": 10,
  "link": "inscriptions.html?event=ia-1-2026-10-16",
  "linkText": "S’inscrire →"
}
```

Les neuf événements de la programmation 2026–2027 sont renseignés dans `events.json`. Les champs `price` (euros) et `capacity` (jauge maximale) sont affichés sur les cartes et dans le formulaire. La page `evenements.html` offre une vue calendrier mensuelle, dont les dates ouvrent le détail et un lien vers l’inscription. Le formulaire prépare uniquement une demande par e-mail ; il ne suit pas les places restantes et ne collecte pas de paiement. Les champs `description` et `place` sont facultatifs. L’accueil et la page Événements contiennent également une liste de secours pour une ouverture hors ligne ; si le programme est modifié, synchroniser ces listes et le sélecteur d’inscription avec `events.json`.

## Actualités et jeux

La page d'accueil lit les premiers articles de `news.html` : continuez à les ajouter en haut de `.news-container`. La page Actualités met en avant les activités actuelles : Labo Ludik et projet BallBot. Les articles peuvent y être ouverts ou refermés. Les jeux restent des pages HTML autonomes et se chargent uniquement après un clic. Depuis l'accueil et `labo-ludik.html`, ils s'ouvrent dans un lecteur avec retour et fermeture ; la fermeture décharge le jeu.

Les applications autonomes (mini-jeux, gestionnaires de tournoi, générateur de prompts et éditeur d'actualités) conservent leur propre interface de travail. Leur code de jeu ou d'édition n'a pas été réécrit par la refonte graphique du portail.

## Bénévolat

Le bouton « Voir nos missions » ouvre les annonces COR-TECH sur JeVeuxAider.gouv.fr : https://www.jeveuxaider.gouv.fr/organisations/33995-cor-tech. La liste des missions actives est tenue à jour sur cette page extérieure.

## Visuels

Le logo officiel est une conversion WebP sans changement de dessin du fichier `images/Logo_Cor-Tech.png`. Le visuel d'accueil avec des personnes et celui du bénévolat sont illustratifs : ils ne représentent pas des membres réels de COR-TECH. La photo de la salle est fournie par l'association.

## Saison en cours

Le Club YouTube ne fait plus partie des activités affichées. Le Labo Ludik reste en place ; le vendredi soir, Le Labo adultes se retrouve deux heures par semaine autour d’un projet collectif. Le premier défi proposé est le BallBot, d’après https://techknowtone.co.uk/Projects/P/BallBot/ballbot.html. Le créneau du vendredi 21h00–23h00 est affiché sur le site. L’ancienne URL `club-youtube.html` redirige vers `le-labo.html` pour éviter une page introuvable.

## Révisions Ludik et accès au club

Deux pages présentent désormais les Révisions Ludik et l’accès aux PC, consoles et simulateur de conduite. La photo des locaux fournie par COR-TECH est conservée telle quelle dans `assets/local-club.jpg` ; le cadrage est fait dans la mise en page. Les tarifs 2026 communiqués par l’association figurent sur les pages ; pour les créneaux et modalités d’accès, les pages orientent vers son contact.

## Tarifs et bureau 2026

Les tarifs fournis pour 2026 et les quatre membres du bureau sont affichés dans `acces-club.html`. Une modification future doit être répercutée sur les rappels de tarifs présents dans les pages des activités et sur l’accueil.

## Inscriptions aux événements

La page `inscriptions.html` lit les futurs événements de `events.json` et accepte `?event=identifiant` pour pré-sélectionner un événement (par exemple `?event=ia-1-2026-10-16`). Chaque événement doit avoir un `id` distinct. Elle prépare un e-mail à `contact@cor-tech.fr` à partir du formulaire. Le visiteur doit ensuite envoyer le message dans sa messagerie ; aucune inscription n’est enregistrée dans le navigateur ni confirmée automatiquement. En cas d’absence de messagerie configurée, un bouton permet de copier la demande.

## Horaires du club et des ateliers

Les horaires d’ouverture du club (période scolaire et vacances scolaires) figurent dans `acces-club.html#horaires`. Les horaires hebdomadaires de Labo Ludik, Révisions Ludiques et Le Labo figurent sur leurs pages et sur `activites.html`. La page d’accueil renvoie vers le tableau détaillé. En cas de changement, mettre ces rappels à jour ensemble.
