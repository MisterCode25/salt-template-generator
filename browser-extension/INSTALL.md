# Salt BO Capture Beta

1. Décompresse le ZIP téléchargé depuis Salt BO tools.
2. Ouvre `edge://extensions` ou `chrome://extensions`.
3. Active le mode développeur.
4. Clique sur **Charger l’extension non empaquetée**.
5. Sélectionne ce dossier, celui qui contient `manifest.json`.
6. Recharge Salt BO tools une fois l’extension installée.

La capture bêta demande le numéro du ticket SuperOffice, charge ce ticket dans l’unique onglet SuperOffice déjà ouvert, puis capture ses données. Lorsqu’un contractor est disponible, elle le recherche dans VTI et récupère son `recordId`.

La version 0.1.20 charge d’abord la recherche puis la fiche du contractor dans l’onglet VTI principal. Elle vérifie que la session est authentifiée et que le bon `recordId` est affiché avant de démarrer les captures parallèles. Billing Account Information, Billing Information et Contact Details sont alors récupérés depuis le contexte authentifié de cet onglet. Offer Management et HealthCheck s’exécutent dans un onglet inactif temporaire, ensuite fermé. Une session réellement expirée arrête immédiatement la capture en laissant VTI ouvert pour la reconnexion ; les autres incompatibilités conservent l’ancienne capture comme fallback.

Si aucun contractor n’est trouvé dans SuperOffice, l’extension ne touche pas à VTI. Le popup de l’application demande obligatoirement le contractor avant de lancer la recherche et la capture VTI.

La capture SuperOffice récupère le contractor depuis l’External ID lorsqu’il est valide. Sinon, elle ouvre tous les posts encore pliés avec leurs contrôles natifs, attend brièvement le chargement de leurs données, puis parcourt `HtmlMessages2_data` à la recherche de `MSISDN:` suivi d’exactement huit chiffres dans le contenu HTML normalisé.

La version 0.1.17 n’appelle plus `HtmlMessages2_buildHtml` après le chargement initial de la page, car cette fonction reconstruit le bloc complet et peut dupliquer les posts. Elle conserve les posts déjà ouverts et clique une seule fois sur chaque post réellement fermé, y compris lorsque toutes les flèches utilisent la même image.

Depuis Salt BO tools, l’extension peut aussi ouvrir et préremplir le formulaire ALO sans jamais le valider. Pour créer un ticket ALEX, elle applique d’abord le contexte partenaire, puis recharge ALEX directement sur la recherche SEP filtrée par l’OTO ID capturé dans VTI. `saltAlexRefresh` est un timestamp renouvelé à chaque ouverture pour forcer ALEX à relire ce contexte. L’ouverture d’un ticket ALEX existant reste inchangée.

La version 0.1.22 conserve désormais une action ALO ou ALEX en attente lorsqu’une page de connexion s’affiche. Il suffit de se connecter dans l’onglet ouvert : l’extension retrouve ensuite la page cible et poursuit automatiquement le préremplissage ou l’ouverture demandée. L’action expire après dix minutes si la connexion n’est pas terminée.
