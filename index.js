const express = require('express');

const PORT = 8000

const app = express();
app.use(express.json());

const postgres = require("postgres")

const configs = require('./config.json')

app.get('/tournament_by_name', async (_req, res) => {
    const sql = postgres(configs.connection)

    let name = _req.body.name

    let data = await sql`SELECT * FROM tournaments WHERE name = ${name}`

    res.send({
        message: data,
        status: 200
    })

})


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



app.put('/edit-tournament', async (req, res) => {
    const sql = postgres(configs.connection)

    let data = req.body
    let auth = data.auth

    if (auth === configs.auth) {
        const { name, placements, date, link, hostlink, host, auth } = req.body;


        let valid = placements.isArray() && placements.every(x => typeof x === 'string')

        if (!valid) {
            res.send({
                message: 'Invalid placements',
                status: 400
            })
        } else {


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
        res.send({
            message: 'Unauthorized',
            status: 401
        })
    }


})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});