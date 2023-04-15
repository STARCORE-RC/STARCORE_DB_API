const express = require('express');

const PORT = 8000

const app = express();
app.use(express.json());

const postgres = require("postgres")

const configs = require('./config.json')

// @PARAMS: name
// Returns a tournament by name
app.get('/tournament_by_name', async (req, res) => {
    const sql = postgres(configs.connection)

    let name = req.body.name

    if (!name) {
        res.status(400).send({
            message: 'Missing required parameter `name`',
            status: 400
        })
        return
    }

    let data = await sql`SELECT * FROM tournaments WHERE name = ${name}`

    if (data.length === 0) {
        res.status(404).send({
            message: 'Tournament not found',
            status: 404
        })
        return
    }

    res.send({
        message: data,
        status: 200
    })

})


// @PARAMS: amount
// Returns the last x tournaments, starting with the newest
app.get('/last_x_tournament', async (req, res) => {
    const sql = postgres(configs.connection)

    console.log(req.body)

    // Check if `amount` is provided in the request body
    if (!req.body.amount) {
        res.status(400).send({
            message: 'Missing required parameter `amount`',
            status: 400
        })
        return
    }

    let amount = req.body.amount
    console.log(amount)

    let data = await sql`SELECT * FROM tournaments ORDER BY date DESC LIMIT ${amount}`
    // console.log(data)

    res.send({
        message: data,
        status: 200
    })

})


// @PARAMS: name, placements, date, link, hostlink, host, auth
// Adds a tournament to the database, placements must be an array of strings
// Auth is the auth token from the config file
app.post('/add-tournament', async (req, res) => {
    const sql = postgres(configs.connection)

    const { name, placements, date, link, hostlink, host, auth } = req.body

    if (auth !== configs.auth) {
        res.status(401).send({
            message: 'Unauthorized',
            status: 401
        })
        return
    }

    if (!Array.isArray(placements) || !placements.every(x => typeof x === 'string')) {
        res.status(400).send({
            message: 'Invalid placements',
            status: 400
        })
        return
    }

    try {
        await sql`INSERT INTO tournaments (name, placements, date, link, hostlink, host) VALUES (${name}, ${placements}, ${date}, ${link}, ${hostlink}, ${host})`
        res.status(200).send({
            message: 'Tournament added',
            status: 200
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: 'Error adding tournament',
            status: 500
        })
    }
})


// @PARAMS: name, placements, date, link, hostlink, host, auth
// Edits a tournament in the database, placements must be an array of strings
// Auth is the auth token from the config file
app.put('/edit-tournament', async (req, res) => {
    const sql = postgres(configs.connection);

    let data = req.body;
    let auth = data.auth;

    if (auth === configs.auth) {
        const { name, placements, date, link, hostlink, host, auth } = req.body;

        // Fetch existing data from the database
        let existingData = await sql`SELECT * FROM tournaments WHERE name = ${name}`;

        if (existingData.length === 0) {
            // If no data was found, send a 404 Not Found response
            res.send({
                message: 'Tournament not found',
                status: 404
            });
            return;
        }

        // Check if the placements property is an array and all its elements are strings
        let valid = Array.isArray(existingData[0].placements) && existingData[0].placements.every(x => typeof x === 'string');

        if (!valid) {
            // If placements is not a valid array, send a 400 Bad Request response
            res.send({
                message: 'Invalid placements',
                status: 400
            });
        } else {
            // Otherwise, update the tournament in the database
            try {
                await sql`UPDATE tournaments SET placements = ${placements}, date = ${date}, link = ${link}, hostlink = ${hostlink}, host = ${host} WHERE name = ${name}`;
                res.send({
                    message: 'Tournament updated',
                    status: 200
                });
            } catch (error) {
                console.log(error);
                res.status(500).send({
                    message: 'Server error',
                    status: 500
                });
            }
        }
    } else {
        // If the authentication token is invalid, send a 401 Unauthorized response
        res.send({
            message: 'Unauthorized',
            status: 401
        });
    }
});




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});