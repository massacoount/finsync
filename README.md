# Fin-Sync

## Overview
Fin-Sync is a project that provides shared models for both frontend and backend. This repository contains the necessary scripts and configurations to generate TypeScript models from an OpenAPI specification that can be reused across the frontend and backend.

## Structure
- `openapi/`: Contains the OpenAPI specification file (`api.yaml`).
- `generated/`: Contains the generated models.
  - `models/`: Generated TypeScript models.

## Scripts
The following npm script is available:

- `generate:models`: Generates the TypeScript models from the OpenAPI specification.

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

3. Generate the models:
   ```sh
   npm run generate:models
   ```

## License
This project is licensed under the ISC License.
