# Salt BO Capture Beta

1. Décompresse le ZIP téléchargé depuis Salt BO tools.
2. Ouvre `edge://extensions` ou `chrome://extensions`.
3. Active le mode développeur.
4. Clique sur **Charger l’extension non empaquetée**.
5. Sélectionne ce dossier, celui qui contient `manifest.json`.
6. Recharge Salt BO tools une fois l’extension installée.

La capture bêta demande le numéro du ticket SuperOffice, charge ce ticket dans l’unique onglet SuperOffice déjà ouvert, puis capture ses données. Lorsqu’un contractor est disponible, elle le recherche dans VTI, ouvre sa fiche à partir du `recordId`, puis lance la capture dans l’unique onglet VTI déjà ouvert.

Si aucun contractor n’est trouvé dans SuperOffice, l’extension ne touche pas à VTI. Le popup de l’application demande obligatoirement le contractor avant de lancer la recherche et la capture VTI.

La capture SuperOffice récupère le contractor depuis l’External ID lorsqu’il est valide. Sinon, elle ouvre les posts une seule fois, les trie par date, attend que le plus ancien soit chargé, puis cherche `MSISDN: <numéro>` dans son contenu, y compris lorsque le message est affiché dans un iframe.

La version 0.1.12 accélère ce parcours sans retirer les sécurités existantes : SuperOffice utilise directement ses contrôles de posts connus, VTI recherche le `recordId` par une requête authentifiée en arrière-plan et tente la même chose pour Healthcheck. Si une de ces lectures rapides n’est pas exploitable, l’extension reprend automatiquement le chargement par onglet utilisé jusque-là.

Depuis Salt BO tools, l’extension peut aussi ouvrir et préremplir le formulaire ALO sans jamais le valider, ainsi qu’ouvrir un ticket ALEX après avoir appliqué le contexte partenaire.
