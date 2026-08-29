# Salt BO Capture Beta

1. Décompresse le ZIP téléchargé depuis Salt BO tools.
2. Ouvre `edge://extensions` ou `chrome://extensions`.
3. Active le mode développeur.
4. Clique sur **Charger l’extension non empaquetée**.
5. Sélectionne ce dossier, celui qui contient `manifest.json`.
6. Recharge Salt BO tools une fois l’extension installée.

La capture bêta demande le numéro du ticket SuperOffice, charge ce ticket dans l’unique onglet SuperOffice déjà ouvert, puis capture ses données. Lorsqu’un contractor est disponible, elle le recherche dans VTI et récupère son `recordId`.

La version 0.1.19 utilise ce `recordId` pour charger immédiatement le contractor dans l’onglet VTI principal. En parallèle, Billing Account Information, Billing Information et Contact Details sont récupérés par des requêtes VTI authentifiées depuis un onglet inactif temporaire. Offer Management s’y exécute aussi afin de laisser le JavaScript VTI construire le lien HealthCheck, puis cet onglet est fermé. À la fin, l’onglet VTI principal reste ouvert sur le contractor actuel. Si ce chemin rapide n’est pas utilisable, l’extension revient automatiquement à l’ancienne capture compatible.

Si aucun contractor n’est trouvé dans SuperOffice, l’extension ne touche pas à VTI. Le popup de l’application demande obligatoirement le contractor avant de lancer la recherche et la capture VTI.

La capture SuperOffice récupère le contractor depuis l’External ID lorsqu’il est valide. Sinon, elle ouvre tous les posts encore pliés avec leurs contrôles natifs, attend brièvement le chargement de leurs données, puis parcourt `HtmlMessages2_data` à la recherche de `MSISDN:` suivi d’exactement huit chiffres dans le contenu HTML normalisé.

La version 0.1.17 n’appelle plus `HtmlMessages2_buildHtml` après le chargement initial de la page, car cette fonction reconstruit le bloc complet et peut dupliquer les posts. Elle conserve les posts déjà ouverts et clique une seule fois sur chaque post réellement fermé, y compris lorsque toutes les flèches utilisent la même image.

Depuis Salt BO tools, l’extension peut aussi ouvrir et préremplir le formulaire ALO sans jamais le valider, ainsi qu’ouvrir un ticket ALEX après avoir appliqué le contexte partenaire.
