# TodoList Management System

## Overview

Ce système permet de gérer des tâches (todos) pour votre travail d'écriture. Les todos peuvent être :
- **Globaux** : non liés à un projet spécifique
- **Liés à un projet** : associés à un projet particulier
- **Liés à un personnage** : pour gérer le développement d'un personnage
- **Liés à une scène** : pour les tâches de rédaction spécifiques

## Installation

### 1. Créer la table en base de données

Exécutez le SQL suivant dans votre base MySQL :

```bash
mysql -u your_user -p your_database < server/database/todos-schema.sql
```

Ou copiez-collez le contenu du fichier `server/database/todos-schema.sql` dans votre client MySQL.

### 2. Vérifier la création

```sql
SHOW COLUMNS FROM todos;
SELECT * FROM todos LIMIT 5;
```

## API Endpoints

### Global Todos

- `GET /api/todos` - Liste tous les todos de l'utilisateur
  - Query params: `q` (recherche), `status` (pending/in-progress/completed), `completed` (0/1)
- `POST /api/todos` - Créer un todo global
  - Body: `{ title, description?, priority?, due_date?, project_id?, character_id?, scene_id? }`
- `GET /api/todos/:todoId` - Détail d'un todo
- `PUT /api/todos/:todoId` - Mettre à jour un todo
  - Body: `{ title?, description?, status?, priority?, due_date? }`
- `DELETE /api/todos/:todoId` - Supprimer un todo (soft delete)
- `POST /api/todos/:todoId/complete` - Toggle completion (completed ↔ pending)

### Project Todos

- `GET /api/projects/:projectSlug/todos` - Liste les todos d'un projet
  - Query params: `q`, `status`, `completed`
- `POST /api/projects/:projectSlug/todos` - Créer un todo pour le projet
  - Body: `{ title, description?, priority?, due_date?, character_id?, scene_id? }`

## Interface utilisateur

### Page globale des todos

URL: `/studio/todos`

Affiche tous les todos de l'utilisateur avec :
- Création rapide de todo
- Filtres (recherche, statut, complété)
- Colonne "Project" pour voir le projet associé
- Actions : toggle completion, changer statut/priorité, supprimer

### Page todos d'un projet

URL: `/studio/projects/:slug/todos`

Affiche les todos spécifiques au projet avec :
- Même interface que la page globale
- Contexte automatique du projet
- Peut lier des personnages/scènes du projet

## Utilisation du composant

```vue
<template>
  <TodoList
    apiBase="/api/todos"
    contextLabel="Mes tâches"
    :showProject="true"
    backTo="/studio"
    backLabel="Retour"
  />
</template>
```

### Props du composant TodoList

- `apiBase` (required): URL de l'API (`/api/todos` ou `/api/projects/:slug/todos`)
- `contextLabel`: Titre de la page (default: 'Todos')
- `showProject`: Afficher colonne "Project" (default: false)
- `backTo`: Lien de retour
- `backLabel`: Texte du lien de retour

## Fonctionnalités

### Priorités

- 🔴 **High** : Tâches urgentes
- 🟡 **Medium** : Tâches normales
- ⚪ **Low** : Tâches à faible priorité

### Statuts

- **Pending** : À faire
- **In Progress** : En cours
- **Completed** : Terminé

### Date d'échéance

- Affichage en rouge si la date est dépassée et le todo non complété
- Format : jj mois aaaa (ex: 15 mars 2026)

### Liens contextuels

Les todos peuvent être liés à :
- Un projet (obligatoire pour `/api/projects/:slug/todos`)
- Un personnage (optionnel)
- Une scène (optionnelle)

Ces liens s'affichent sous le titre du todo avec des icônes :
- 👤 pour les personnages
- 🎬 pour les scènes

## Exemples d'utilisation

### Créer un todo global

```javascript
await $fetch('/api/todos', {
  method: 'POST',
  body: {
    title: 'Réviser le chapitre 5',
    description: 'Corriger les dialogues de Kinuani',
    priority: 'high',
    due_date: '2026-03-15'
  }
})
```

### Créer un todo pour un projet

```javascript
await $fetch('/api/projects/les-derniers-leopards/todos', {
  method: 'POST',
  body: {
    title: 'Développer personnage Kilala',
    character_id: 12,
    priority: 'medium',
    status: 'in-progress'
  }
})
```

### Marquer un todo comme complété

```javascript
await $fetch('/api/todos/42/complete', {
  method: 'POST'
})
```

## Intégration avec les autres pages

Vous pouvez ajouter des liens vers les todos dans vos pages studio :

```vue
<NuxtLink :to="`/studio/projects/${projectSlug}/todos`">
  <Icon name="mdi:checkbox-marked-outline" />
  Todos du projet
</NuxtLink>
```

## Permissions

- Tous les endpoints nécessitent une authentification (JWT)
- Un utilisateur ne peut voir/modifier que ses propres todos
- Pour les todos liés à un projet, l'utilisateur doit être owner du projet
