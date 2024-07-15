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
     ```sh
     pm2 restart tote-api
     ```

## PM2 Setup

### Initial Setup

If PM2 is not installed on your server, you can install it globally using npm:

```sh
npm install -g pm2
```
