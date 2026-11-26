# Session — Sonekeno · Kongo Dibuidi · enrichissement DB

**Mode** : Cédric + Codex
**Statut** : DB enrichie, commit isolé demandé par Founder

## Fait

- Canon distant `origin/main` `a83204a` rapproché de la DB `derniers_leopards`, projet `les-derniers-leopards` (id 2), par transaction idempotente.
- `scenes.content` n'est jamais écrit : les textes de l'auteur restent intacts.
- Jalons contrôlés : Mfuti **juin 1636** ; retrait de Ne Mawungu **octobre 1637** ; rappel **janvier 1638** ; mariage **août 1639**.

## Clarification du comptage

Il n'y avait pas 75 scènes actives en DB avant l'intervention : la lecture pré-transaction en comptait **45**. Le fichier canonique en décrivait **75** : 45 lignes `EXISTING_DB` et 30 lignes `A_CREER_CHAPITRE_EXISTANT`. La transaction a donc inséré les **30** manquantes et réconcilié les **45** déjà présentes, pour atteindre **75** scènes actives. Le rejeu dry-run propose désormais zéro mutation.

## Répartition éditoriale

- Les 75 fiches DB sont rattachées au tome 1, **Kongo Dibuidi**, centré sur Kinuani.
- **Mama I Mama** est le tome 3, centré sur Mutinu. Les éléments communs (dont sa vie intérieure, le Kikumbi, le foyer et la concession) restent des candidats de développement par POV : aucune scène du tome 3 n'est créée ou dupliquée ici.
- Les derniers enrichissements de Mutinu, Ma Ntombo et Kinuani sont conservés dans leurs fiches canoniques et descriptions DB. La parenté Kinuani–Ma Ntombo et les jalons de Mutinu/Kinuani sont rapprochés sans invention de scène.

## Bilan DB

- Scènes : +30 insertions, 45 mises à jour ; personnages : +6, 42 enrichis ; profils : +6, 42 enrichis ; dossiers : +43, 5 enrichis ; parentés : +9, 1 mise à jour ; événements : +29, 9 mis à jour.

## Prochaine étape

- Founder rédige à partir des 75 fiches ; toute synchronisation ultérieure conserve `scenes.content`.


## Réconciliation des preuves — 26 novembre, Infomaniak

- Le bilan APPLY et le dry-run zéro mutation ci-dessus concernent la base locale `derniers_leopards`, pas une livraison distante confirmée. Le commit f88506c conserve le script, pas une preuve de synchronisation production.
- Source structurelle existante à consulter AVANT toute intervention : [DB pack Sonekeno du 31/07](https://github.com/cedricbatina/batina-os/tree/main/executive-cabinet/strategic-council/db-packs/sonekeno/2026-07-31) (INVENTORY, COLUMNS, INDEXES, FOREIGN_KEYS). Export réussi également le 01/09 selon le journal SC, sans présumer que le pack correspondant est publié.
- Preuve Founder phpMyAdmin du 26/11 : base distante `6i695q_lesDerniersLeopards`, 75 scènes actives sur 25 chapitres AVANT synchronisation distante ; 45 résumés « Résumé à écrire ». Livre unique observé : id 1, slug `tome-1-la-desolation`, titre Kongo Dibuidi — Tome 1 : La Désolation. Aucune scène Mama I Mama en DB selon Founder.
- Scènes distantes 52, 55, 60 : anciens objectifs 1638, 1640, 1641 et time_of_day NULL observés avant correction éventuelle ; canon juin 1636, janvier 1638, août 1639. Ne pas présumer que la requête UPDATE proposée a été exécutée.
- Connexion Node distante réussie, mais script interrompu avant transaction : ER_BAD_FIELD_ERROR 1054, `scenes.book_id` absent. Le chemin réel est scenes.chapter_id → chapters.part_id → parts.book_id → books.id. L'API chapters/index.get.js le confirme. Le script privilégie DB_*_LOCAL, même en production : cible explicite obligatoire.
- INFORMATION_SCHEMA.COLUMNS filtré par DATABASE() a retourné zéro ligne via phpMyAdmin ; SHOW CREATE TABLE fonctionne mais l'affichage copié est tronqué. Utiliser le pack existant comme base et SHOW FULL COLUMNS / SHOW CREATE TABLE via Node pour les seuls écarts actuels, sans redemander les données déjà disponibles ni exporter des secrets.
- Prochaine opération : adapter le script existant aux colonnes réelles, conserver scenes.content et les enrichissements distants, vérifier le livre et les slugs existants, dry-run distant puis APPLY autorisé et preuve sur la même connexion. Ne pas modifier le schéma pour satisfaire le script. Quality et production non confirmées.
