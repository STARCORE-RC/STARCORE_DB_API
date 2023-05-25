# StarCore DB API Documentation

Welcome to the documentation for the StarCore DB API. This API allows you to interact with the StarCore database by performing CRUD operations (Create, Read, Update, Delete) on the tournaments stored in the database.

## Base URL

The base URL for all API endpoints is: `http://ip-address:7060/api`

## Authentication

Authentication is required to access the API endpoints. Include the following header in your requests:

Authorization: <access_token>


Replace `<access_token>` with a valid access token obtained through the authentication process.

## Endpoints

### 1. Retrieve a Tournament by Name

GET /tournament_by_name?name=<name>



This endpoint retrieves a tournament from the database based on its name. Replace `<name>` with the name of the tournament you want to retrieve. This endpoint returns the details of the specified tournament.

### 2. Retrieve the Last X Tournaments

GET /last_x_tournament?amount=<amount>


This endpoint retrieves the last `X` tournaments from the database, starting with the newest. Replace `<amount>` with the number of tournaments you want to retrieve. This endpoint returns an array of tournament details.

### 3. Add a Tournament

POST /add-tournament


This endpoint adds a new tournament to the database. Include the following parameters in the request body:

- `name` (string): The name of the tournament.
- `placements` (array of strings): The placements of the tournament.
- `date` (string): The date of the tournament.
- `link` (string): The link to the tournament.
- `hostlink` (string): The link to the host of the tournament.
- `host` (string): The host of the tournament.

Make sure to include the `Authorization` header with the access token.

### 4. Edit a Tournament

PUT /edit-tournament


This endpoint edits an existing tournament in the database. Include the following parameters in the request body:

- `name` (string): The name of the tournament to edit.
- `placements` (array of strings): The updated placements of the tournament.
- `date` (string): The updated date of the tournament.
- `link` (string): The updated link to the tournament.
- `hostlink` (string): The updated link to the host of the tournament.
- `host` (string): The updated host of the tournament.

Make sure to include the `Authorization` header with the access token.

For all endpoints, successful responses will have a `200` status code, and error responses will have appropriate status codes along with error messages.

That's it! You can now use the StarCore DB API to interact with the tournaments in the data