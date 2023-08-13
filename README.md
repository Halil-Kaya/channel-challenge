# NestJS Channel Socket Example Project

> **Greetings!** 👋
>
> Are you searching for an example of a NestJS socket project? Or are you seeking new strategies for your own project?
>
> You're in the right place. This project serves as an illustrative example of a channel application. Users can create
> channels, join and leave them, send messages to channels, and receive messages. The project also handles the scenario
> of saving messages when a user is offline, and subsequently sending these messages to the user upon reconnection.
>
> In this repository, you will discover:

-   Scaling and broadcasting events using RabbitMQ
-   Socket management
-   Adding middlewares for Socket
-   Encrypt and decrypt server requests and responses
-   An Elasticsearch use case example
-   Service management
-   The concept of internal services
-   Authentication through JWT tokens
-   End-to-End (E2E) testing methods
-   Daily logging utilizing Winston
-   Decorators for event handling
-   An interceptor for response transformation and logging
-   An error handling filter
-   Caching with Redis
-   Handling of race conditions
-   Integration with MongoDB
-   Docker configuration
-   An example of using the `@golevelup/nestjs-discovery` package

### You can find scenarios and code flow in the test folder.

```bash
test
├── api
    ├── auth
        └── sign-in.test.ts
    └── user
        └── user-create.test.ts
├── common
    ├── auth.helper.ts
    ├── channel-message.helper.ts
    ├── channel.helper.ts
    ├── crypto.helper.ts
    ├── db
        ├── elasticsearch.helper.ts
        ├── index.ts
        ├── mongo.helper.ts
        └── redis.helper.ts
    ├── have-users.helper.ts
    ├── helper.ts
    ├── index.ts
    ├── init-socket.ts
    └── user.helper.ts
├── jest-e2e.json
├── socket
  ├── channel
      ├── channel-create.test.ts
      ├── channel-join.test.ts
      ├── channel-leave.test.ts
      └── channel-search.test.ts
  ├── channel-message
      ├── channel-message-read.test.ts
      ├── channel-messages-get.test.ts
      └── channel-send-message.test.ts
  └── user
      └── connection.test.ts
├── test-config.ts
└── test-setup.ts
```

## To Run Project

```bash
$ cd docker
$ docker-compose up
```

The project will be accessible at http://localhost:3050

### To Run Tests

```bash
$ npm run test
```

### To Stop Project

```bash
$ docker-compose down
```

### Contributing

> Contributions to this project are welcome. Feel free to fork this repository, make changes, and submit pull requests.

### License

> There is no any license for this project. You are free to use and modify the code as you see fit.
