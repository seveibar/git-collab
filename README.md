# Git Collab Specification

## Abstract

Git Collab is a system of libraries, utilities and protocols for implementing collaborative sessions between integrated development environments and is intended to be used alongside the git version control system.

## Overview of Functionality

After Git Collab has an established connection with it's clients, it should implement the following features on an enable/disable basis.

### Repository / Filesystem Sync

Enforces that every client has maintains the same filesystem. Any time a client changes a file that is part of the repository, the patch will be set to all connected clients.

### Selective File Sync

When a file is selected for selected file sync, it will be synced across all clients whenever an edit is done and the file is saved. The file will not be update on the version control system.

### Ghost Viewing

This allows a local client to view the progress of another client on a file without actually having the file on their local system. This allows the local client to view the file as it changes, but still use the old file until the changes are complete.

### Real-Time Collaborative Coding

Clients can edit and sync a file at the same time. This should support multiple  selection, so each client can have multiple carets.

### Synchronized Compilation

Allows commands to be executed on all clients when a single client triggers a compilation.

### Done Mode (instantaneus file push and sync)

This mode will allow a user to mark a changed file "done" and push it to the server instantly. All clients who are on the same branch will instantly update their version of the "doned" file.

## Terminology

**Git Collab Client**: The Git Collab Client is run by anyone actively editing code on a project. The client can connect to any other client within their project and enter a collaborative coding session, at which point the code on both client's computers is identical. All clients in the session can edit the code together in collaborative sessions.

**Git Collab Server**: The Git Collab Server runs for a project and controls the redirecting of client messages. Clients connect to the server when first beginning work on a project. Git Collab does not require a server if clients choose to connect directly.

**Session**: A session is created by each client when they join the server. A session has a version of code associated with it and the clients can join a session to obtain the code within a session.

## Client

### Program Flow

1. On initialization, the client connects to the current project's server. This server may have to be set up in the client settings. The client creates a session on the server.
2. The client can view all the sessions on the server. They can then select a session to join at any time if they choose.
3. Upon joining a session the local client's working copy becomes the same as the remote client's working copy. The old local working copy is backed up.
4. The client's can now edit the working copy on both computers together. To the local client, this should feel as though they are editing the remote client's session and can switch back to their session at any time.
5. Upon switching out of the remote client's session, the working copy returns to the exact state it was when the client left. Other clients can edit the local client's session while they are away.

## Server

1. The server runs remotely from a site and is associated with a project via each client's configuration settings.
2. The server accepts and redirects client connections to other clients.

## Protocol


### Client connecting to server

1. Client sends a request to get a session

`GET http://{server}/join`

2. Server returns the client's session id and connection details for a socket connection.

### Client connecting to a session

1. Local client requests a patch for the session
2. Remote client sends patch for the session
3. Local client indicates that it has entered the session

### Socket Protocol

The socket protocol can be used once a client is connected to the server and has received their socket connection.

`ping`: Sent to clients to verify that they're active.

`ack`: Return for `ping`, verifies that client is active.

`patch SESSION PATCHDATA`: Patch data for any client that wants to enter the session and get the version of the working copy that's on the session.

`req patch SESSION`: Request a patch for a session

`enter SESSION`: Indicate that the client is entering the session

`exit SESSION`: Indicate that the client is leaving the session

`req sessions`: Requests all active sessions and meta information regarding sessions

`info session SESSION`: Returns session data for a session request

## Scenarios

### Quick fix connection

Client `A` has a problem and asks Client `B` for help.

`A` and `B` connect to server and gets socket connection details.  Then connect to sockets.

Both clients run `req sessions` to get all active sessions (and discover eachother)

After coding for some time, `A` has a problem and asks `B` for help (this is not done within Git Collab).

`B` uses UI to join `A`'s session. To do this, `B` sends a `req patch SESSION_A`.

`A` returns `patch SESSION_A PATCHDATA_A` to `B`

`B` uses `PATCHDATA_A` to adjust it's working copy.

`B` sends `enter SESSION_A` to indicate that it is entering the session.

`B` and `A` enter a collaborative editting session.

`B` sends `exit SESSION_A` to indicate that it's leaving the session.

`B`'s local copy reverts
