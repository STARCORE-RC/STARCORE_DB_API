const express = require('express');
const rateLimit = require('express-rate-limit')


const PORT = 7060

const app = express();

const postgres = require("postgres")

const configs = require('./config.json')

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10 // limit each IP to 10 requests per windowMs
})




const authCheck = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || authHeader !== configs.auth) {
        res.status(401).send({
            message: 'Unauthorized',
            status: 401
        })
        return
    }
    next()
}

app.use("/api", express.json(), limiter, authCheck)

// @PARAMS: name
// Returns a tournament by name
// ip:port/api/tournament_by_name?name=NAME
app.get('/api/tournament_by_name', async (req, res) => {
    const sql = postgres(configs.connection);

    const name = req.query.name;

    if (!name) {
        res.status(400).send({
            message: 'Missing required parameter `name`',
            status: 400
        });
        return;
    }

    let data = await sql`SELECT * FROM tournaments WHERE name = ${name}`;

    if (data.length === 0) {
        res.status(404).send({
            message: 'Tournament not found',
            status: 404
        });
        return;
    }

    res.send({
        message: data,
        status: 200
    });
});

// @PARAMS: amount
// Returns the last x tournaments, starting with the newest
app.get('/api/last_x_tournament', async (req, res) => {
    const sql = postgres(configs.connection);

    const amount = req.query.amount;

    if (!amount) {
        res.status(400).send({
            message: 'Missing required parameter `amount`',
            status: 400
        });
        return;
    }

    let data = await sql`SELECT * FROM tournaments ORDER BY date DESC LIMIT ${amount}`;

    res.send({
        message: data,
        status: 200
    });
});



// @PARAMS: name, placements, date, link, hostlink, host, auth
// Adds a tournament to the database, placements must be an array of strings
// Auth is the auth token from the config file
app.post('/api/add-tournament', async (req, res) => {
    const sql = postgres(configs.connection)

    const {name, placements, date, link, hostlink, host, auth} = req.body

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
app.put('/api/edit-tournament', async (req, res) => {
  console.log("AKHDAJSDH")

    const sql = postgres(configs.connection);

        // object with body data
        let data = {
            name: req.body.name,
            placements: req.body.placements,
            date: req.body.date,
            link: req.body.link,
            hostlink: req.body.hostlink,
            host: req.body.host
        }

        // object with data of the tournament that is being edited
        let existingTournament = await sql`SELECT * FROM tournaments WHERE name = ${data.name}`

        if (existingTournament.length === 0) {
            res.status(404).send({
                message: 'Tournament not found',
                status: 404
            })
            return
        }

        let finalData = {
            name: data.name,
            placements: data.placements,
            date: data.date,
            link: data.link,
            hostlink: data.hostlink,
            host: data.host

        }


        let keysToCheck = ["placements", "date", "link", "hostlink", "host"]

        for (let i = 0; i < keysToCheck.length; i++) {
            if (data[keysToCheck[i]]) {
                finalData[keysToCheck[i]] = data[keysToCheck[i]]
            } else {
                finalData[keysToCheck[i]] = existingTournament[0][keysToCheck[i]]
            }
        }

        try {
            await sql`UPDATE tournaments SET name = ${data.name}, placements = ${finalData.placements}, date = ${finalData.date}, link = ${finalData.link}, hostlink = ${finalData.hostlink}, host = ${finalData.host} WHERE name = ${finalData.name}`
            res.status(200).send({
                message: 'Tournament updated',
                status: 200
            })
        } catch (error) {
            console.error(error)
            res.status(500).send({
                message: 'Error updating tournament',
                status: 500
            })
        }



});

// DELETE /api/delete-tournament?name=<name>
// Deletes a tournament by its name
app.delete('/api/delete-tournament', async (req, res) => {
    const sql = postgres(configs.connection);

    const name = req.query.name;

    if (!name) {
        res.status(400).send({
            message: 'Missing required parameter `name`',
            status: 400
        });
        return;
    }

    try {
        // Check if the tournament exists
        const existingTournament = await sql`SELECT * FROM tournaments WHERE name = ${name}`;

        if (existingTournament.length === 0) {
            res.status(404).send({
                message: 'Tournament not found',
                status: 404
            });
            return;
        }

        // Delete the tournament
        await sql`DELETE FROM tournaments WHERE name = ${name}`;

        res.status(200).send({
            message: 'Tournament deleted',
            status: 200
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Error deleting tournament',
            status: 500
        });
    }
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});