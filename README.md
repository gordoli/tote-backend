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

## Deployment

1. **Update env following your deployment environment**

   - Check `.env.example` and update your `.env` file following the example.

2. **Install Dependencies**:

   - Run the following command to install any new dependencies.

     ```sh
     npm install
     ```

3. **Run pending migrations and seeds**:

   - Run the run the command above for run pending migrations and seeds.

   ```sh
   npm run migration:run:${environment}
   ```

   ```sh
   npm run seed:run:${environment}
   ```

4. **Restart the Server**:

   - Use the provided shell script to restart the server using PM2. This ensures that the server picks up the latest changes:

     ```sh
     sh deploy.sh
     ```

   - If you don't have the shell script, you can manually restart the server using PM2 with the following commands:

     ```sh
     pm2 restart tote-api
     ```

## PM2 Setup

### Initial Setup

If PM2 is not installed on your server, you can install it globally using npm:

```sh
npm install -g pm2
```

### Explanation

- **Deployment Section**:

  - **Update env following your deployment environment**: This step ensures that the environment variables are correctly set up by updating the `.env` file based on the example provided in `.env.example`.
  - **Install Dependencies**: This step instructs users to install any new dependencies using `npm install`.
  - **Run pending migrations and seeds**: Run migrations and seeds before deploying to update your database schema and populate it with initial data.
  - **Restart the Server**: This step provides instructions on how to restart the server using the `deploy.sh` script or manually with PM2.

- **PM2 Setup Section**:
  - **Initial Setup**: Instructions for installing PM2 globally if it's not already installed.
  - **Start/Restart Server**: Instructions for starting the server for the first time using PM2 and restarting it after deploying new code.
  - **Save PM2 Process List**: Instructions for saving the PM2 process list to ensure the application restarts on system boot.
