# Create a local Dockerized PG DB

> In case if you don't have a Docker download it from [here](https://www.docker.com/)

From the terminal run the following command

```shell
$ docker run --name <name-of-the-container> -p 5432:5432 -e POSTGRES_PASSWORD=<your-password-here> -d postgres
```

When it is done and the db server is running create a database `genesys`.

# Prerequisites

Must be installed on your system:

Git

NodeJS

# Web Server

Install the necessary npm packages with the following command executed from the backend's root directory:

```shell
$ npm ci
```

After this is done run the application with

```shell
$ npm run start:dev
```

This will execute the application in a so-called watch mode, which means there is no need to re-start the application manually when new changes are applied. When saving the files the application will restart automatically.

To build the application run the

```shell
$ npm run build
```

This will create a `build` folder and the transpiled JavaScript files will be placed there. Run the application with

```shell
$ node dist/app.js
```

The application's backend by default is running on `localhost:3000` port, but you can provide any other port in the .env file by setting the `WEBSITES_PORT` variable. If it is not set the the 3000's port will be in use.

To seed the database with dummy data use

```shell
$ npm run db:seed
```

Also make sure that there is no other active connection to the database otherwise seed will fail to connect.

> Every user's password is "password" in hashed format.

# Scale Node.js application

1. Scale Node.js horizontally - duplicate the application instance to manage a larger number of incoming connections. This can be performed on a single multi-core machine or across different machines.

2. Scale database - depends on the database system we can scale horizontally and vertically too by adding more servers or improve the existing server's with more power.

3. Run multiple processes on same machine - one way to increase the throughput of the application is to spawn one process for each core of the server machine.

4. Multiple machines with network load balancing - this is similar to scaling on multiple cores, but in this case there are multiple machines, each one running one or more processes, and a balancer to redirect traffic to each machine.

5. Use Throttling - limit access to the services to prevent them from being overwhelmed by too many requests.

6. Use microservices - services can communicate between each other and every service can be deployed on different virtual machine and it'll be only called when there is a need for it.
