# Salt BO Capture Beta

1. Décompresse le ZIP téléchargé depuis Salt BO tools.
2. Ouvre `edge://extensions` ou `chrome://extensions`.
3. Active le mode développeur.
4. Clique sur **Charger l’extension non empaquetée**.
5. Sélectionne ce dossier, celui qui contient `manifest.json`.
6. Recharge Salt BO tools une fois l’extension installée.

La capture bêta demande le numéro du ticket SuperOffice, charge ce ticket dans l’unique onglet SuperOffice déjà ouvert, puis capture ses données. Elle n’effectue encore aucune recherche de client VTI à partir du contractor : elle exige aussi exactement un onglet VTI déjà ouvert sur le bon client.

La capture SuperOffice récupère le contractor depuis l’External ID lorsqu’il est valide. Sinon, elle cherche `MSISDN: <numéro>` dans le premier post du ticket.

Depuis Salt BO tools, l’extension peut aussi ouvrir et préremplir le formulaire ALO sans jamais le valider, ainsi qu’ouvrir un ticket ALEX après avoir appliqué le contexte partenaire.
