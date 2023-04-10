const express = require('express');

const PORT = 8000

const app = express();
app.use(express.json())

const postgres = require("postgres")

const configs = require('./config.json')

app.get('/tournaments', async (_req, res) => {
    const sql = postgres(configs.connection)

    let amount = _req.body.amount
    // console.log(_req.body.amount)

let data = await sql`SELECT * FROM tournaments ORDER BY date DESC LIMIT ${amount}`
console.log(data)

    res.send({
        message: data,
        status: 200
    })

    })


app.post('/tournament', async (req, res) => {
    const sql = postgres(configs.connection)

    let data = req.body
    let auth = data.auth

    console.log(data)

    if (auth === configs.auth) {
        let name = data.name
        let placements = data.placements
        let date = data.date
        let link = data.link
        let hostlink = data.hostlink
        let host = data.host



        await sql`INSERT INTO tournaments (name, placements, date, link, hostlink, host) VALUES (${name}, ${placements}, ${date}, ${link}, ${hostlink}, ${host})`

        res.send({
            message: 'Tournament added',
            status: 200
        })


    } else {
        res.send({
            message: 'Unauthorized',
            status: 401
        })
    }


})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
} );