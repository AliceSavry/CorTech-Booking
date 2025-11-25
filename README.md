# Outil de Gestion Association (Cor-Tech)

Cet outil permet de gérer les évènements et les inscriptions via une simple page Web hébergée sur GitHub.

## 🚀 Installation Rapide

1.  Créez un dépôt sur GitHub (ex: `asso-resa`).
2.  Ajoutez le fichier `index.html` que vous avez créé.
3.  Allez dans **Settings** > **Pages**.
4.  Dans "Branch", choisissez `main` et sauvegardez.
5.  Votre site est en ligne !

## 📧 Configuration des Emails (EmailJS)

Pour que les emails fonctionnent, vous devez créer un compte gratuit sur [EmailJS](https://www.emailjs.com/).

1.  **Service :** Connectez votre Gmail (créez un service, notez l'ID, ex: `service_gmail`).
2.  **Template :** Créez un modèle d'email.
    * Dans le sujet mettez : `Inscription : {{event_title}}`
    * Dans le contenu mettez :
        ```text
        Bonjour {{user_name}},
        
        Votre inscription pour {{event_title}} est bien notée.
        Statut : {{user_status}}
        
        Cordialement,
        L'équipe
        ```
    * Notez l'ID du template (ex: `template_123`).
3.  **Code :** Ouvrez votre fichier `index.html`, cherchez les lignes au tout début (lignes 14-16) et remplacez les valeurs :
    ```javascript
    const EMAILJS_PUBLIC_KEY = "VOTRE_CLE_ICI";
    const EMAILJS_SERVICE_ID = "VOTRE_SERVICE_ID";
    const EMAILJS_TEMPLATE_ID = "VOTRE_TEMPLATE_ID";
    ```

## ⚠️ IMPORTANT : Comment sauvegarder vos modifications ?

Comme c'est un "Site Statique" (sans serveur de base de données), si vous ajoutez un événement via le panneau Admin, **il n'est visible que sur VOTRE ordinateur** (via les cookies/localStorage).

**Pour rendre les changements visibles à TOUT LE MONDE :**
1.  Faites vos modifs dans l'interface Admin (Ajout événements, changement logo, changement mot de passe, etc.).
2.  Allez dans l'onglet **Paramètres Généraux** de l'admin.
3.  Cliquez sur le bouton jaune **"Copier ma configuration actuelle"**.
4.  Copiez le code qui s'affiche.
5.  Ouvrez votre fichier `index.html` sur votre ordinateur (ou directement sur GitHub.com en mode édition).
6.  Cherchez la ligne qui commence par `this.defaultData = { ...`.
7.  Remplacez ce bloc par le code que vous avez copié.
8.  Sauvegardez le fichier `index.html`.

C'est la seule façon de mettre à jour la base de données pour tous les visiteurs.
