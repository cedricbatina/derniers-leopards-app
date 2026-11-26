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
