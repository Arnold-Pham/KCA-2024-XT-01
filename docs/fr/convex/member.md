# Gestion des Membres

Le module `member` gère l'ajout, la lecture et la suppression des membres dans un serveur
Voici une description de chaque fonction disponible et de son fonctionnement

## Table

| Champ      | Type                   | Description                                     |
| ---------- | ---------------------- | ----------------------------------------------- |
| `serverId` | `id('server') `        | ID du serveur auquel le membre appartient       |
| `userId`   | `string  `             | ID de l'utilisateur                             |
| `user`     | `string`               | Nom de l'utilisateur                            |
| `role`     | `id('role')` ou `null` | ID du rôle attribué au membre, peut être `null` |

## Fonctionnalités

### 1. `c` - Création d'un Membre (Create)

#### Description

Ajoute un nouveau membre à un serveur spécifié

#### Arguments

`serverId`: Identifiant du serveur auquel le membre doit être ajouté
`userId`: Identifiant de l'utilisateur qui devient membre
`user`: Nom de l'utilisateur
`role`: Identifiant optionnel d'un rôle attribué au membre (peut être `null`)

#### Comportement

-   Vérifie si le serveur spécifié existe
-   Si le serveur existe, le membre est ajouté à la base de données avec les informations suivantes:
    -   `serverId`, `userId`, `user`: Informations fournies par le frontend
    -   `role`: Rôle optionnel, sinon `null`

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Member added' }`
-   **Errors**:
    -   `errors.serverNotFound`: Le serveur spécifié n'existe pas

### 2. `l` - Lecture des Membres (List)

#### Description

Récupère une liste de tous les membres d'un serveur spécifique

#### Arguments

`serverId`: Identifiant du serveur

#### Comportement

-   Vérifie si le serveur spécifié existe
-   Si le serveur existe, récupère la liste des membres associés au serveur

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Members collected', data: members }`
-   **Errors**:
    -   `errors.serverNotFound`: Le serveur spécifié n'existe pas

### 3. `d` - Suppression d'un Membre (Delete)

#### Description

Supprime un membre d'un serveur

#### Arguments

`serverId`: Identifiant du serveur
`userId`: Identifiant de l'utilisateur à supprimer

#### Comportement

-   Vérifie si le serveur spécifié existe
-   Vérifie si le membre spécifié existe dans le serveur
-   Si toutes les conditions sont remplies, le membre est supprimé de la base de données

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Member deleted' }`
-   **Errors**:
    -   `errors.serverNotFound`: Le serveur spécifié n'existe pas
    -   `errors.memberNotFound`: Le membre spécifié n'existe pas dans le serveur

## Gestion des Erreurs

Les fonctions utilisent un objet d'erreurs standardisé pour renvoyer des réponses cohérentes:

| Code d'Erreur           | Statut | Message            | Détails supplémentaires                         |
| ----------------------- | ------ | ------------------ | ----------------------------------------------- |
| `errors.serverNotFound` | 404    | "Server not found" | Le serveur spécifié n'existe pas                |
| `errors.memberNotFound` | 404    | "Member not found" | Le membre spécifié n'existe pas dans le serveur |

Les réponses d'erreur incluent toujours un statut HTTP (`code`) et un message d'erreur clair pour faciliter le débogage et la compréhension du problème
