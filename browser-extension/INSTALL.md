# Salt BO Capture Beta

Version 0.1.29 watches the ALO form after autofill. Submit the ticket yourself: the extension reads the resulting Incident Id and Salt BO tools saves a generated External ID with `FLL Ticket`, partner `ALO`, and that incident number. It does not copy the External ID. Existing LED information is preserved; an unknown LED stays empty and can be edited later.

Reload the updated extension and Salt BO tools before starting a new ALO fill. The `storage` permission keeps the pending operation in `chrome.storage.session` across page reloads and background-worker suspension. Tracking expires after 24 hours or a browser/extension restart. Only the prepared ALO tab is accepted, after a manual submission and matching OTO, external reference, and recent creation time. A completed result is retained until the app acknowledges it. If the active client or SO ticket changed, reopen the original case to apply its pending result.

The browser regression page is `tests/browser/aloTicketCompletion.html`, served by Vite on a fresh `http://127.0.0.1:5180` origin. It refuses to run if any IndexedDB database already exists and never clears existing databases. It verifies real DOM extraction, atomic persistence, duplicate delivery, the app listener, and clipboard isolation using synthetic tickets. Live Swisscom submission still requires an authenticated manual check.

1. Décompresse le ZIP téléchargé depuis Salt BO tools.
2. Ouvre `edge://extensions` ou `chrome://extensions`.
3. Active le mode développeur.
4. Clique sur **Charger l’extension non empaquetée**.
5. Sélectionne ce dossier, celui qui contient `manifest.json`.
6. Recharge Salt BO tools une fois l’extension installée.

La capture bêta demande le numéro du ticket SuperOffice, charge ce ticket dans l’unique onglet SuperOffice déjà ouvert, puis capture ses données. Lorsqu’un contractor est disponible, elle le recherche dans VTI et récupère son `recordId`.

Version 0.1.28 temporarily activates VTI during search and capture so Chrome cannot suspend its execution. The Offer Management and HealthCheck helper tab is active only while its dynamic content is loading, then the previously active tab is restored even when capture fails. The authenticated session and expected `recordId` are still validated before capture.

Si aucun contractor n’est trouvé dans SuperOffice, l’extension ne touche pas à VTI. Le popup de l’application demande obligatoirement le contractor avant de lancer la recherche et la capture VTI.

La capture SuperOffice récupère le contractor depuis l’External ID lorsqu’il est valide. Sinon, elle ouvre tous les posts encore pliés avec leurs contrôles natifs, attend brièvement le chargement de leurs données, puis parcourt `HtmlMessages2_data` à la recherche de `MSISDN:` suivi d’exactement huit chiffres dans le contenu HTML normalisé.

La version 0.1.17 n’appelle plus `HtmlMessages2_buildHtml` après le chargement initial de la page, car cette fonction reconstruit le bloc complet et peut dupliquer les posts. Elle conserve les posts déjà ouverts et clique une seule fois sur chaque post réellement fermé, y compris lorsque toutes les flèches utilisent la même image.

Depuis Salt BO tools, l’extension peut aussi ouvrir et préremplir le formulaire ALO sans jamais le valider. Pour créer un ticket ALEX, elle applique d’abord le contexte partenaire, puis recharge ALEX directement sur la recherche SEP filtrée par l’OTO ID capturé dans VTI. `saltAlexRefresh` est un timestamp renouvelé à chaque ouverture pour forcer ALEX à relire ce contexte. L’ouverture d’un ticket ALEX existant reste inchangée.

La version 0.1.22 conserve désormais une action ALO ou ALEX en attente lorsqu’une page de connexion s’affiche. Il suffit de se connecter dans l’onglet ouvert : l’extension retrouve ensuite la page cible et poursuit automatiquement le préremplissage ou l’ouverture demandée. L’action expire après dix minutes si la connexion n’est pas terminée.

La version 0.1.23 extrait en priorité le contractor depuis un External ID SuperOffice exploitable. La recherche classique de `MSISDN:` dans les données des posts n’est exécutée que si l’External ID est absent ou ne fournit pas de contractor valide.

Version 0.1.24 normalizes ALO contact phone numbers to the Swiss local format and leaves the second phone field empty when both numbers are identical.
