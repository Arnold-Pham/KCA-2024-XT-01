# Member Management

The `member` module manages the addition, retrieval, and deletion of members in a server
Below is a description of each available function and its operation

## Table

| Field      | Type                    | Description                                          |
| ---------- | ----------------------- | ---------------------------------------------------- |
| `serverId` | `id` ('server')         | ID of the server to which the member belongs         |
| `userId`   | `string`                | ID of the user                                       |
| `user`     | `string`                | Username of the user                                 |
| `role`     | `id` ('role') or `null` | ID of the role assigned to the member, can be `null` |

## Features

### 1. `c` - Create a Member

#### Description

Adds a new member to a specified server

#### Arguments

`serverId`: Identifier of the server to which the member should be added
`userId`: Identifier of the user becoming a member
`user`: Username of the user
`role`: Optional identifier of a role assigned to the member (can be `null`)

#### Behavior

-   Checks if the specified server exists
-   If the server exists, the member is added to the database with the following information:
    -   `serverId`, `userId`, `user`: Information provided by the frontend
    -   `role`: Optional role; otherwise, it is set to `null`

#### Responses

-   **Success**: `{ status: 'success', code: 200, message: 'Member added' }`
-   **Errors**:
    -   `errors.serverNotFound`: The specified server does not exist

### 2. `l` - List Members

#### Description

Retrieves a list of all members of a specific server

#### Arguments

`serverId`: Identifier of the server

#### Behavior

-   Checks if the specified server exists
-   If the server exists, retrieves the list of members associated with the server

#### Responses

-   **Success**: `{ status: 'success', code: 200, message: 'Members collected', data: members }`
-   **Errors**:
    -   `errors.serverNotFound`: The specified server does not exist

### 3. `d` - Delete a Member

#### Description

Deletes a member from a server

#### Arguments

-   `serverId`: Identifier of the server
-   `userId`: Identifier of the user to delete

#### Behavior

-   Checks if the specified server exists
-   Checks if the specified member exists in the server
-   If all conditions are met, the member is removed from the database

#### Responses

-   **Success**: `{ status: 'success', code: 200, message: 'Member deleted' }`
-   **Errors**:
    -   `errors.serverNotFound`: The specified server does not exist
    -   `errors.memberNotFound`: The specified member does not exist in the server

## Error Handling

The functions use a standardized error object to return consistent responses:

| Error Code              | Status | Message            | Additional Details                                |
| ----------------------- | ------ | ------------------ | ------------------------------------------------- |
| `errors.serverNotFound` | 404    | "Server not found" | The specified server does not exist               |
| `errors.memberNotFound` | 404    | "Member not found" | The specified member does not exist in the server |

Error responses always include an HTTP status (`code`) and a clear error message to facilitate debugging and understanding of the issue
