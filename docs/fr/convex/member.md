# Documentation - Gestion des Membres

Le module `member` gère l'ajout, la consultation et la suppression des membres d'un serveur
Cette documentation décrit le fonctionnement de chaque fonction disponible dans le CRUD (Create, Read, Update, Delete) pour la table `member`

## Table `member`

### Structure

| Champ      | Type                | Description                                                |
| ---------- | ------------------- | ---------------------------------------------------------- |
| `serverId` | `id('server')`      | Identifiant du serveur auquel le membre appartient         |
| `userId`   | `id('user')`        | Identifiant de l'utilisateur en tant que membre du serveur |
| `role`     | `id('role')`/`null` | _(optionnel)_ Rôle attribué au membre dans le serveur      |

### Règles de validation

-   **Membre**:
    -   Un membre doit être lié à un serveur existant (`serverId`)
    -   Un membre doit être lié à un utilisateur existant (`userId`)
-   **Rôle**:
    -   Optionnel, mais doit correspondre à un rôle existant si spécifié

---

## Fonctionnalités CRUD

### 1. `c` - Ajout d'un Membre _(Create)_

#### Description

Ajoute un nouvel utilisateur en tant que membre dans un serveur spécifié

#### Arguments

-   `serverId`: `id('server')` - Identifiant du serveur auquel le membre doit être ajouté
-   `userId`: `id('user')` - Identifiant de l'utilisateur qui sera ajouté en tant que membre
-   `role`: `id('role')` _(facultatif)_ - Rôle assigné au membre dans le serveur. Si non spécifié, aucun rôle n'est attribué

#### Comportement

-   **Validation**:
    -   Vérifie que le serveur existe
-   **Insertion**:
    -   Si le serveur existe, insère un nouveau membre dans la table `member` avec les informations fournies

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Member added' }`
-   **Errors**:
    -   `errors.serverNotFound`: Serveur non trouvé

---

### 2. `l` - Consultation des Membres _(List)_

#### Description

Récupère la liste des membres d'un serveur spécifié

#### Arguments

-   `serverId`: `id('server')` - Identifiant du serveur pour lequel les membres doivent être récupérés

#### Comportement

-   **Validation**:
    -   Vérifie que le serveur existe
-   **Récupération**:
    -   Si le serveur existe, récupère tous les membres associés au serveur spécifié

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Members collected', data: members }`
-   **Errors**:
    -   `errors.serverNotFound`: Serveur non trouvé

---

### 3. `d` - Suppression d'un Membre _(Delete)_

#### Description

Supprime un membre d'un serveur spécifié

#### Arguments

-   `serverId`: `id('server')` - Identifiant du serveur
-   `userId`: `string` - Identifiant de l'utilisateur à supprimer en tant que membre

#### Comportement

-   **Validation**:
    -   Vérifie que le serveur existe
    -   Vérifie que le membre existe dans le serveur
-   **Suppression**:
    -   Si le serveur et le membre existent, supprime le membre de la table `member`

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Member deleted' }`
-   **Errors**:
    -   `errors.serverNotFound`: Serveur non trouvé
    -   `errors.memberNotFound`: Membre non trouvé

---

## Gestion des Erreurs

Les fonctions utilisent un objet d'erreurs standardisé pour renvoyer des réponses cohérentes:

| Code d'Erreur           | Statut | Message          | Détails supplémentaires                         |
| ----------------------- | ------ | ---------------- | ----------------------------------------------- |
| `errors.serverNotFound` | 404    | Server not found | Le serveur spécifié n'existe pas                |
| `errors.memberNotFound` | 404    | Member not found | Le membre spécifié n'existe pas dans le serveur |

Les réponses d'erreur incluent toujours un statut HTTP (`code`) et un message d'erreur clair pour faciliter le débogage et la compréhension du problème
