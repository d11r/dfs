# dfs - Naming Server - Distributed File System

This is a course project of the Distributed System course at Innopolis University.

## Instructions

First, you will need to setup the environment variables.
You can do so by creating a .env file in the project root and adding the following properties

```
DB_HOST=localhost
DB_NAME=dfs
DB_PORT=27017
APP_HOST=localhost
APP_PORT=4000
```

Alternatively, specify `DB_PROD_PATH` that equals to the URL of mLab cloud-hosted mongodb.

Secondly, for installation of dependencies, run: `yarn`

Then, to start the web server, run: `yarn start`

After doing so, when that everything is working by sending a GET request to `http://localhost:4000/api/ping`. You should receive a `pong` message. Note that the host (localhost), and the port (400) could change depending on your environment file.

## Description

The system consists of two types of entities:

- Naming server (this repo)
- Storage servers

### Naming server

Naming server is a server that is responsible for indexing the files, and indicating while file is stored in which storage server. It communicates with the client, i.e. it should handle various user requests. These requests will be described below. The naming server should then redirect the request to the responsible storage server that's hosting the file.

Naming server should track the entire file system of all storage servers. It should associate every file in the FS to the corresponding storage server. It acts as a proxy from client to storage servers.

It should also allow storage servers to register their presence.

### Storage servers

They should provide clients with access to file data. Also, storage servers should respond to redirects from naming server.

## Functionality

File system's users should be able to perform these operations on files:

- read files
- write files
- delete files
- copy files
- move files
- get info about files

And these on directories:

- listing
- creation
- changing
- deletion

## Additional Requirements

All of these files operations should be replicated on multiple storage servers. DFS will be fault-tolerant, i.e. data will be accessible even if some of the network nodes are offline.

## Team

- Vladislav Smirnov (storage node, client app, deployment)
- Dragos Strugar (naming node)
- Peter Zakharkin (storage node, containerization, deployment)
