# Fin-Sync

## Overview
Fin-Sync is a project that provides a shared OpenAPI specification and generated code for both client and server. This repository contains the necessary scripts and configurations to generate TypeScript Axios client and Node.js Express server code from the OpenAPI specification.

## Structure
- `openapi/`: Contains the OpenAPI specification file (`api.yaml`).
- `generated/`: Contains the generated client and server code.
  - `client/`: Generated TypeScript Axios client code.
  - `server/`: Generated Node.js Express server code.

## Scripts
The following npm scripts are available:

- `generate:client`: Generates the TypeScript Axios client code from the OpenAPI specification.
- `generate:server`: Generates the Node.js Express server code from the OpenAPI specification.
- `postinstall`: Runs the `generate:api` script after installing dependencies.

## Usage
1. Clone the repository:
   ```sh
   git clone https://github.com/samuelj90/fin-sync.git
   cd fin-sync
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Generate the client and server code:
   ```sh
   npm run generate:client
   npm run generate:server
   ```

## License
This project is licensed under the ISC License.
