# Invitation Code Management

The `invitCode` module manages the creation and usage of invitation codes for servers
It allows for the generation of unique codes that can be used to join a server

## Table

| Field       | Type               | Description                                             |
| ----------- | ------------------ | ------------------------------------------------------- |
| `serverId`  | `id` ('server')    | ID of the server to which the invitation code is linked |
| `creatorId` | `string`           | ID of the creator of the invitation code                |
| `code`      | `string`           | Unique invitation code                                  |
| `uses`      | `number`           | Number of times the code has been used                  |
| `maxUses`   | `number` or `null` | Maximum usage limit of the code (can be `null`)         |
| `expiresAt` | `number` or `null` | Expiration timestamp of the code (can be `null`)        |

## Features

### 1. `c` - Create an Invitation Code

#### Description

Generates a new invitation code for a specified server

#### Arguments

`serverId`: Identifier of the server for which the invitation code is generated
`creatorId`: Identifier of the user creating the code
`maxUses`: (Optional) Limit on the number of uses for the code. Defaults to no limit
`expiresAt`: (Optional) Expiration timestamp for the code. Defaults to no expiration date

#### Behavior

-   **Code Generation**:
    -   Uses the `generateCode` function to create a unique 12-character code (default)
        -   The code is checked to ensure it does not already exist in the database
-   **Database Insertion**:
    -   The generated code is stored in the `invitCode` table with the provided information:
    -   `serverId`, `creatorId`: Data provided by the frontend - `code`: Uniquely generated code - `uses`: Initialized to 0 - `maxUses`: Can be `null` or the maximum number of uses
    -   `expiresAt`: Can be `null` or the expiration timestamp

#### Responses

-   **Success**: `{ status: 'success', code: 200, message: 'Code created', data: codeGen }`
-   **Errors**:
    -   `errors.serverNotFound`: The specified server does not exist

### 2. `use` - Use an Invitation Code

#### Description

Allows a user to use an invitation code to join a server

#### Arguments

`code`: Invitation code to use
`userId`: Identifier of the user using the code
`user`: Username of the user

#### Behavior

-   **Code Verification**:
    -   The invitation code is searched for in the `invitCode` table
    -   If the code does not exist, returns the error `errors.invalid`
    -   If the code has expired, returns the error `errors.expired`
    -   If the maximum usage limit is reached, returns the error `errors.maxUsed`
-   **Server Verification**:
    -   Checks that the server associated with the code exists
    -   If the server does not exist, returns the error `errors.serverNotFound`
-   **Member Addition**:
    -   The user is added as a member of the server in the `member` table
    -   The `uses` counter of the invitation code is incremented by 1
-   **Code Update**:
    -   Increments the `uses` field of the invitation code

#### Responses

-   **Success**: `{ status: 'success', code: 200, message: 'Code used' }`
-   **Errors**:
    -   `errors.invalid`: The invitation code is invalid
        -   `errors.maxUsed`: The usage limit of the code has been reached
        -   `errors.serverNotFound`: The specified server does not exist
        -   `errors.expired`: The code has expired

## Error Handling

The functions use a standardized error object to return consistent responses:

| Error Code              | Status | Message                    | Additional Details                           |
| ----------------------- | ------ | -------------------------- | -------------------------------------------- |
| `errors.invalid`        | 404    | "Unknown code"             | The invitation code is unknown               |
| `errors.maxUsed`        | 400    | "Code usage limit reached" | The usage limit of the code has been reached |
| `errors.serverNotFound` | 404    | "Server not found"         | The specified server does not exist          |
| `errors.expired`        | 400    | "Code expired"             | The code has expired                         |

Error responses always include an HTTP status (`code`) and a clear error message to facilitate debugging and understanding of the issue
