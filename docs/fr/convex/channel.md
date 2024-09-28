# Documentation - Gestion des Channels

Le module `channel` gère la création, la lecture, la mise à jour et la suppression des salons (channels) dans un serveur
Cette documentation décrit le fonctionnement de chaque fonction disponible dans le CRUD (Create, Read, Update, Delete) pour la table `channel`

## Table `channel`

### Structure

| Champ         | Type            | Description                                                   |
| ------------- | --------------- | ------------------------------------------------------------- |
| `serverId`    | `id('server')`  | Identifiant du serveur auquel le salon appartient             |
| `name`        | `string`        | Nom du salon _(32 caractères max)_                            |
| `type`        | `string`        | _(optionnel)_ Type du salon _(ex: text, voice, etc.)_         |
| `permissions` | `string`/`null` | _(optionnel)_ Permissions spécifiques du salon au format JSON |

### Règles de validation

-   **Nom**:
    -   Doit être une chaîne de caractères non vide
    -   Ne doit pas dépasser 32 caractères
-   **Type**:
    -   Optionnel, par défaut `text` si non spécifié
-   **Permissions**:
    -   Optionnel, doit être une chaîne de caractères au format JSON si fourni

---

## Fonctionnalités CRUD

### 1. `c` - Création d'un Channel _(Create)_

#### Description

Crée un nouveau salon dans un serveur spécifié

#### Arguments

-   `serverId`: `id('server')` - Identifiant du serveur auquel le salon doit être ajouté
-   `userId`: `string` - Identifiant de l'utilisateur créant le salon
-   `name`: `string` - Nom du salon _(non vide et 32 caractères max)_
-   `type`: `string` _(facultatif)_ - Type du salon _(ex: text, voice)_
-   `permissions`: `string` _(facultatif)_ - Permissions spécifiques du salon, au format JSON

#### Comportement

-   **Validation**:
    -   Vérifie que le nom du salon est non vide et valide _(32 caractères max)_
    -   Vérifie que le serveur et le membre existent
    -   Vérifie que le nombre de salons dans le serveur ne dépasse pas 32
-   **Insertion**:
    -   Si toutes les validations passent, insère un nouveau salon avec les informations fournies, le type par défaut est `text`

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Channel created' }`
-   **Errors**:
    -   `errors.empty`: Nom du salon vide
    -   `errors.tooLong`: Nom du salon trop long
    -   `errors.serverNotFound`: Serveur non trouvé
    -   `errors.memberNotFound`: Membre non trouvé
    -   `errors.tooMany`: Trop de salons dans le serveur

---

### 2. `l` - Lecture des Channels _(List)_

#### Description

Récupère la liste des salons d'un serveur spécifié

#### Arguments

-   `serverId`: `id('server')` - Identifiant du serveur
-   `userId`: `string` - Identifiant de l'utilisateur demandant les salons

#### Comportement

-   **Validation**:
    -   Vérifie que le serveur et le membre existent
-   **Récupération**:
    -   Récupère tous les salons associés au serveur spécifié

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Channels collected', data: channels }`
-   **Errors**:
    -   `errors.serverNotFound`: Serveur non trouvé
    -   `errors.memberNotFound`: Membre non trouvé

---

### 3. `u` - Mise à Jour d'un Channel _(Update)_

#### Description

Met à jour les informations d'un salon existant

#### Arguments

-   `channelId`: `id('channel')` - Identifiant du salon à mettre à jour
-   `serverId`: `id('server')` - Identifiant du serveur
-   `userId`: `string` - Identifiant de l'utilisateur
-   `name`: `string` _(facultatif)_ - Nouveau nom du salon
-   `type`: `string` _(facultatif)_ - Nouveau type du salon
-   `permissions`: `string` _(facultatif)_ - Nouvelles permissions du salon

#### Comportement

-   **Validation**:
    -   Vérifie que le nom du salon est valide _(non vide et 32 caractères max)_
    -   Vérifie que le serveur, le salon et le membre existent
    -   Vérifie que l'utilisateur est le créateur du serveur ou possède les permissions nécessaires
-   **Mise à jour**:
    -   Si des changements sont détectés, met à jour les informations du salon avec les nouvelles valeurs fournies

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Channel updated' }`
-   **Errors**:
    -   `errors.empty`: Nom du salon vide
    -   `errors.tooLong`: Nom du salon trop long
    -   `errors.serverNotFound`: Serveur non trouvé
    -   `errors.channelNotFound`: Salon non trouvé
    -   `errors.notAuthorized`: Utilisateur non autorisé
    -   `errors.unchanged`: Aucun changement détecté

---

### 4. `d` - Suppression d'un Channel (Delete)

#### Description

Supprime définitivement un salon existant

#### Arguments

-   `channelId`: `id('channel')` - Identifiant du salon à supprimer
-   `serverId`: `id('server')` - Identifiant du serveur
-   `userId`: `string` - Identifiant de l'utilisateur

#### Comportement

-   **Validation**:
    -   Vérifie que le serveur, le salon et le membre existent
    -   Vérifie que l'utilisateur est le créateur du serveur ou possède les permissions nécessaires
-   **Suppression**:
    -   Supprime le salon et tous les messages associés dans la base de données

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: "Channel deleted and all its messages too" }`
-   **Errors**:
    -   `errors.serverNotFound`: Serveur non trouvé
    -   `errors.channelNotFound`: Salon non trouvé
    -   `errors.notAuthorized`: Utilisateur non autorisé

---

## Gestion des Erreurs

Les fonctions utilisent un objet d'erreurs standardisé pour renvoyer des réponses cohérentes:

| Code d'Erreur            | Statut | Message                  | Détails supplémentaires                                 |
| ------------------------ | ------ | ------------------------ | ------------------------------------------------------- |
| `errors.empty`           | 400    | Message creation refused | Le nom du salon est vide ou ne contient que des espaces |
| `errors.tooLong`         | 400    | Message too long         | Le nom du salon dépasse les 32 caractères               |
| `errors.unchanged`       | 400    | Message unchanged        | Aucun changement détecté par rapport à l'original       |
| `errors.tooMany`         | 400    | Too many channels        | Le serveur contient déjà le nombre maximal de salons    |
| `errors.notAuthorized`   | 403    | Action refused           | L'utilisateur n'a pas les permissions nécessaires       |
| `errors.serverNotFound`  | 404    | Server not found         | Le serveur spécifié n'existe pas                        |
| `errors.memberNotFound`  | 404    | Member not found         | Le membre spécifié n'existe pas                         |
| `errors.channelNotFound` | 404    | Channel not found        | Le salon spécifié n'existe pas                          |

Les réponses d'erreur incluent toujours un statut HTTP (`code`) et un message d'erreur clair pour faciliter le débogage et la compréhension du problème
