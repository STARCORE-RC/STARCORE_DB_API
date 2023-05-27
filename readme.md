# API Documentation

## Introduction
This API provides endpoints for managing tournaments. It allows you to retrieve tournaments, add new tournaments, edit existing tournaments, and delete tournaments.

## Base URL
- Base URL: http://localhost:7060/api

## Authentication
To access the API endpoints, you need to include an `Authorization` header with a valid authentication token. The authentication token should be provided in the `config.json` file.

## Rate Limiting
The API enforces rate limiting to prevent abuse. By default, each IP address is limited to 10 requests per minute.

## Endpoints

### Retrieve Tournament by Name
Retrieves a tournament by its name.

- Endpoint: GET /tournament_by_name
- Parameters:
    - `name` (required): Name of the tournament

### Retrieve Last X Tournaments
Retrieves the last X tournaments, starting with the newest.

- Endpoint: GET /last_x_tournament
- Parameters:
    - `amount` (required): Number of tournaments to retrieve

### Add Tournament
Adds a new tournament to the database.

- Endpoint: POST /add-tournament
- Request Body:
    - `name` (required): Name of the tournament
    - `placements` (required): Array of strings representing the placements
    - `date` (required): Date of the tournament
    - `link`: URL link of the tournament
    - `hostlink`: URL link of the host
    - `host`: Host of the tournament
    - `auth` (required): Authentication token

### Edit Tournament
Edits an existing tournament in the database.

- Endpoint: PUT /edit-tournament
- Request Body:
    - `name` (required): Name of the tournament to be edited
    - `placements`: Array of strings representing the updated placements
    - `date`: Updated date of the tournament
    - `link`: Updated URL link of the tournament
    - `hostlink`: Updated URL link of the host
    - `host`: Updated host of the tournament
    - `auth` (required): Authentication token

### Delete Tournament
Deletes a tournament by its name.

- Endpoint: DELETE /delete-tournament
- Parameters:
    - `name` (required): Name of the tournament to be deleted

## Error Handling
The API returns appropriate HTTP status codes and error messages for different scenarios.

## Development
To run the API locally, follow these steps:
1. Clone the repository: `git clone https://github.com/your-repo.git`
2. Install the dependencies: `npm install`
3. Configure the database connection and authentication token in the `config.json` file.
4. Start the server: `npm start`
5. The API will be accessible at `http://localhost:7060/api`.

## Contribution
Contributions to improve the API are welcome! If you find any issues or have suggestions, please open an issue or submit a pull request.
