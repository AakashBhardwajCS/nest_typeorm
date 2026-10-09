# NestJS TypeORM Demo

A small NestJS app that walks through the main topics from the NestJS docs, using TypeORM and PostgreSQL.

## 1. Database

The app uses the existing `qdeck-demo` Postgres container on port `5435`:

| Setting  | Value        |
| -------- | ------------ |
| Host     | `127.0.0.1`  |
| Port     | `5435`       |
| Database | `qdeck_demo` |
| User     | `postgres`   |
| Password | `postgres`   |

The database is shared with the qdeck-demo project, so TypeORM `synchronize` is **off** by default.
Set `DB_SYNC=true` only if you want TypeORM to create or alter the `posts` table for you.

## 2. Install and run

```bash
npm install
npm run start:dev
```

The API runs on `http://localhost:3000`. Settings can be changed with env vars:
`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_SYNC`, `PORT`.

## 3. Try it

There is no real login. The middleware reads a fake user from the `x-user-role` header.

```bash
# create
curl -X POST localhost:3000/posts -H 'Content-Type: application/json' \
  -d '{"title":"My first post","content":"Hello from TypeORM"}'

# list / read one
curl localhost:3000/posts
curl localhost:3000/posts/1

# update and delete need the admin role (otherwise 403)
curl -X PUT localhost:3000/posts/1 -H 'Content-Type: application/json' \
  -H 'x-user-role: admin' -d '{"title":"Updated title"}'
curl -X DELETE localhost:3000/posts/1 -H 'x-user-role: admin'

# other examples
curl localhost:3000/examples
curl localhost:3000/examples/me -H 'x-user-role: editor'
curl localhost:3000/examples/circular
curl localhost:3000/examples/handlers
curl localhost:3000/examples/lazy
```

## 4. Where each topic lives

| Topic                  | File                                                         |
| ---------------------- | ------------------------------------------------------------ |
| Controllers            | `posts/posts.controller.ts`, `examples/example.controller.ts` |
| Providers              | `posts/post.service.ts`                                      |
| Modules                | `posts/posts.module.ts`, `examples/feature.module.ts`        |
| Middleware             | `common/request-logger.middleware.ts` (applied in `app.module.ts`) |
| Exception filters      | `common/not-found.filter.ts` turns TypeORM `EntityNotFoundError` into a 404 |
| Pipes                  | global `ValidationPipe` + `common/post.pipe.ts` trims the title |
| Guards                 | `common/roles.guard.ts` with the `@Roles()` decorator        |
| Interceptors           | `common/request-id.interceptor.ts` adds `x-request-id` and `x-response-time` |
| Custom decorators      | `common/user.decorator.ts` (`@GetUser()`), `common/roles.decorator.ts` |
| Custom providers       | `API_URL` value provider in `examples/feature.module.ts`     |
| Asynchronous providers | `DB_VERSION` factory in `examples/feature.module.ts` waits for a DB query |
| Dynamic modules        | `database/database.module.ts` (`DatabaseModule.forRoot()`)  |
| Injection scopes       | `examples/request-user.service.ts` is request scoped         |
| Circular dependency    | `examples/circular-a.service.ts` and `circular-b.service.ts` use `forwardRef()` |
| Module reference       | `ModuleRef` in `examples/example.controller.ts`              |
| Lazy-loading modules   | `examples/lazy.module.ts`, loaded by `GET /examples/lazy`    |
| Execution context      | the guard reads route metadata with `context.getHandler()`   |
| Lifecycle events       | `examples/lifecycle.service.ts` (logs each hook)             |
| Discovery service      | `examples/discovery.service.ts` lists all controller handlers |

TypeORM pieces used: `TypeOrmModule.forRoot` / `forFeature`, `autoLoadEntities`, an entity with
`@CreateDateColumn` / `@UpdateDateColumn`, `@InjectRepository`, `Repository` methods
(`find`, `findOneByOrFail`, `merge`, `save`, `remove`, `count`) and the `DataSource`.

## 5. Tests

```bash
npm test          # unit tests, no database needed
npm run test:e2e  # needs the database running
npm run build
```
