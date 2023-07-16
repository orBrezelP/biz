# TODO Application

The TODO application is a full-stack TypeScript application that uses Node.js, React, and PostgreSQL. It is designed to be run in a Docker environment.

## Requirements

- Node.js
- Docker
- npm

## Installation

1. Clone the repository:

git clone https://github.com/orBrezelP/biz.git

2. Install the Node.js dependencies:

npm install

## Running the Application

1. Start the Node.js and React development servers:

npm run dev


2. In a separate terminal window, start the PostgreSQL database:

docker-compose up -d


## Test User

The test user credentials are:

- Username: `test`
- Password: `bizcuit`

## Architecture

The TODO application is organized into a client-server architecture:

- The **client-side** code is written in TypeScript and React, and is located in the `src/client` directory. It includes several React components, such as `App.tsx`, `Home.tsx`, `Login.tsx`, and `TodoListPage.tsx`.

- The **server-side** code is written in Node.js and TypeScript, and is located in the `src/server` directory. It includes modules for authentication (`auth.ts`), database operations (`db.ts`), and routing (`routes.ts`).

The application uses a PostgreSQL database for persistent storage, which is initialized with the SQL script in the `postgresql/init.sql` file. The database is run in a Docker container, as specified in the `docker-compose.yml` file.

The `public` directory contains static files that are served by the application, including HTML, JavaScript, and favicon files. The `dist` directory contains the compiled JavaScript code that is run on the server.

The application is configured for development with the `tsconfig.client.json` and `tsconfig.server.json` files, and is built with the `webpack.config.js` file.
