## NestJS Tote Backend

This repository contains the NestJS Tote Backend, a starter project built with the Nest framework and TypeScript. This backend includes common features such as Redis, logging, JWT-based authentication with refresh and access tokens and login google.

## Installation

To install the dependencies, run the following command:

```bash
$ npm install
```

## Running the App

You can run the app in different modes as needed:

# Development Mode

```bash
$ npm run start
```

# Watch Mode

```bash
$ npm run start:dev
```

# Production Mode

```bash
$ npm run start:prod
```

## Database Migrations

The project includes several $ npm scripts to manage database migrations for different environments (development, UAT, production).

# Create Migration

To create a new migration:

- For development:

```bash
$ npm run migration:create:dev --name=MigrationName
```

- For UAT:

```bash
$ npm run migration:create:uat --name=MigrationName
```

- For production:

```bash
$ npm run migration:create:prod --name=MigrationName
```

# Generate Migration

To generate a new migration based on your current schema:

- For development:

```bash
$ npm run migration:generate:dev --name=MigrationName
```

- For UAT:

```bash
$ npm run migration:generate:uat --name=MigrationName
```

- For production:

```bash
$ npm run migration:generate:prod --name=MigrationName
```

# Run Migration

To run the pending migrations:

- For development:

```bash
$ npm run migration:run:dev
```

- For UAT:

```bash
$ npm run migration:run:uat
```

- For production:

```bash
$ npm run migration:run:prod
```

## Revert Migration

To revert the last executed migration:

- For development:

```bash
$ npm run migration:revert:dev
```

- For UAT:

```bash
$ npm run migration:revert:uat
```

- For production:

```bash
$ npm run migration:revert:prod
```

## Database Seeding

The project also supports database seeding, which allows you to populate your database with initial data.

# Create Seed

To create a new seed:

- For development:

```bash
$ npm run seed:create:dev --name=SeedName
```

- For UAT:

```bash
$ npm run seed:create:uat --name=SeedName
```

- For production:

```bash
$ npm run seed:create:prod --name=SeedName
```

# Run Seed

To run the seeds:

- For development:

```bash
$ npm run seed:run:dev
```

- For UAT:

```bash
$ npm run seed:run:uat
```

- For production:

```bash
$ npm run seed:run:prod
```

# Revert Seed

To create a new seed:

- For development:

```bash
$ npm run seed:revert:dev
```

- For UAT:

```bash
$ npm run seed:revert:uat
```

- For production:

```bash
$ npm run seed:revert:prod
```

## Postman Collection
You can use the Postman collection to test the API endpoints. Click the link below to access the collection:

[Postman Collection for Tote Backend](https://www.postman.com/tote-backend/workspace/totebe/collection/35358825-3ce0b910-112d-4b43-8723-044763626b12?action=share&creator=35358825&active-environment=35358825-309ede22-3e2b-4002-a1e0-85457b7487a0)

