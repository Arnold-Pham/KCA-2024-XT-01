# Gestion des Channels

Le module `channel` gère la création, la lecture, la mise à jour et la suppression des salons (channels) dans un serveur
Voici une description de chaque fonction disponible et de son fonctionnement

## Table

| Champ         | Type               | Description                                      |
| ------------- | ------------------ | ------------------------------------------------ |
| `serverId`    | `id` ('server')    | ID du serveur auquel le salon appartient         |
| `name`        | `string`           | Nom du salon                                     |
| `type`        | `string`           | Type du salon (text, voice, etc.)                |
| `permissions` | `string` ou `null` | Permissions spécifiques du salon, au format JSON |

## Fonctionnalités

### 1. `c` - Création d'un Channel (Create)

#### Description

Crée un nouveau salon dans un serveur spécifié

#### Arguments

`serverId`: Identifiant du serveur auquel le salon doit être ajouté
`userId`: Identifiant de l'utilisateur créant le salon
`name`: Nom du salon (doit être une chaîne de caractères non vide et ne dépassant pas 32 caractères)
`type`: Type du salon (text par défaut, peut être voice ou autres)
`permissions`: (Optionnel) Permissions spécifiques du salon, au format JSON

#### Comportement

-   Vérifie si le nom du salon est valide (non vide et longueur maximale de 32 caractères)
-   Vérifie si le serveur et le membre existent
-   Vérifie le nombre de salons existants dans le serveur (limité à 32 salons)
-   Si toutes les conditions sont remplies, le salon est inséré dans la base de données avec les informations suivantes:
    -   `serverId`, `name`, `type`, `permissions`: Informations fournies par le frontend
    -   `type`: Par défaut, text si non spécifié

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Channel created' }`
-   **Errors**:
    -   `errors.empty`: Le nom du salon est vide
    -   `errors.tooLong`: Le nom du salon dépasse 32 caractères
    -   `errors.serverNotFound`: Le serveur spécifié n'existe pas
    -   `errors.memberNotFound`: Le membre spécifié n'existe pas
    -   `errors.tooMany`: Le serveur contient déjà le nombre maximal de salons

### 2. `l` - Lecture des Channels (List)

#### Description

Récupère la liste des salons d'un serveur spécifié

#### Arguments

-   `serverId`: Identifiant du serveur
-   `userId`: Identifiant de l'utilisateur demandant les salons

#### Comportement

-   Vérifie si le serveur et le membre existent
-   Récupère tous les salons du serveur
-   Retourne la liste des salons

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Channels collected', data: channels }`
-   **Errors**:
    -   `errors.serverNotFound`: Le serveur spécifié n'existe pas
    -   `errors.memberNotFound`: Le membre spécifié n'existe pas

### 3. `u` - Mise à Jour d'un Channel (Update)

#### Description

Met à jour les informations d'un salon existant

#### Arguments

-   `channelId`: Identifiant du salon à mettre à jour
-   `serverId`: Identifiant du serveur
-   `userId`: Identifiant de l'utilisateur
-   `name`: Nouveau nom du salon (facultatif, doit être une chaîne de caractères valide)
-   `type`: Nouveau type du salon (facultatif)
-   `permissions`: Nouvelles permissions du salon (facultatif)

#### Comportement

-   Vérifie si le nom du salon est valide (non vide et longueur maximale de 32 caractères)
-   Vérifie si le serveur, le salon et le membre existent
-   Vérifie si l'utilisateur est le créateur du serveur ou possède les permissions nécessaires
-   Si toutes les conditions sont remplies, le salon est mis à jour avec les nouvelles informations:
    -   `name`, `type`, `permissions`: Informations mises à jour fournies
-   Si aucun changement n'est détecté, retourne une erreur

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Channel updated' }`
-   **Errors**:
    -   `errors.empty`: Le nom du salon est vide
    -   `errors.tooLong`: Le nom du salon dépasse 32 caractères
    -   `errors.serverNotFound`: Le serveur spécifié n'existe pas
    -   `errors.channelNotFound`: Le salon spécifié n'existe pas
    -   `errors.notAuthorized`: L'utilisateur n'a pas les permissions nécessaires
    -   `errors.unchanged`: Aucun changement détecté par rapport à l'original

### 4. `d` - Suppression d'un Channel (Delete)

#### Description

Supprime (définitivement) un salon existant

#### Arguments

`channelId`: Identifiant du salon à supprimer
`serverId`: Identifiant du serveur
`userId`: Identifiant de l'utilisateur

#### Comportement

-   Vérifie si le serveur, le salon, et le membre existent
-   Vérifie si l'utilisateur est le créateur du serveur ou possède les permissions nécessaires
-   Si toutes les conditions sont remplies, le salon et tous ses messages associés sont supprimés

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: "Channel deleted and all its messages too" }`
-   **Errors**:
    -   `errors.serverNotFound`: Le serveur spécifié n'existe pas
    -   `errors.channelNotFound`: Le salon spécifié n'existe pas
    -   `errors.notAuthorized`: L'utilisateur n'a pas les permissions nécessaires

## Gestion des Erreurs

Les fonctions utilisent un objet d'erreurs standardisé pour renvoyer des réponses cohérentes:

| Code d'Erreur            | Statut | Message                    | Détails supplémentaires                                 |
| ------------------------ | ------ | -------------------------- | ------------------------------------------------------- |
| `errors.empty`           | 400    | "Message creation refused" | Le nom du salon est vide ou ne contient que des espaces |
| `errors.tooLong`         | 400    | "Message too long"         | Le nom du salon dépasse les 32 caractères               |
| `errors.unchanged`       | 400    | "Message unchanged"        | Aucun changement détecté par rapport à l'original       |
| `errors.tooMany`         | 400    | "Too many channels"        | Le serveur contient déjà le nombre maximal de salons    |
| `errors.notAuthorized`   | 403    | "Action refused"           | L'utilisateur n'a pas les permissions nécessaires       |
| `errors.serverNotFound`  | 404    | "Server not found"         | Le serveur spécifié n'existe pas                        |
| `errors.memberNotFound`  | 404    | "Member not found"         | Le membre spécifié n'existe pas                         |
| `errors.channelNotFound` | 404    | "Channel not found"        | Le salon spécifié n'existe pas                          |

Les réponses d'erreur incluent toujours un statut HTTP (`code`) et un message d'erreur clair pour faciliter le débogage et la compréhension du problème
