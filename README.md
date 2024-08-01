## NestJS Tote Backend

This repository contains the NestJS Tote Backend, a starter project built with the
- Nest.JS
- TypeScript (#trendy)

Includes:
- Redis
- Logging
- OpenAPI docs
- JWT-based authentication with refresh and access tokens
- _note: moving auth to Supabase auth_

## Setup

To install the dependencies, run the following command:

```sh
$ bun install
$ bun run start
```

## Docs

Documentation using [scalar](https://github.com/scalar/scalar) is available at `/api-docs` :)

## Deployment

1. Update `.env` file from `.env.example` to prod credentials
2. `npm install`
3. Run pending migrations and seeds:
```sh
bun run migration:run:${environment}
bun run seed:run:${environment}
```
4. Deploy!
```sh
railway link
railway up
```

