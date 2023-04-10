const express = require('express');

const PORT = 8000

const app = express();
app.use(express.json())

const postgres = require("postgres")

const configs = require('./config.json')

app.get('/tournament', async (_req, res) => {
    const sql = postgres(configs.connection)

    let amount = res.body.amount

let data = await sql`SELECT * FROM tournaments ORDER BY date DESC LIMIT ${amount}`

    res.send({
        message: data,
        status: 200
    })

    })

app.post('/tournament', async (req, res) => {
    const sql = postgres(configs.connection)

    let data = req.body
    let auth = data.auth

    if (auth === configs.auth) {
        let name = data.name
        let placements = data.placements
        let date = data.date
        let link = data.link
        let hostlink = data.hostlink
        let host = data.host

        // Regex to check if placements is an array of strings
        const regex = /^(Array)\s*\(\s*((".*")\s*,\s*)*(".*")\s*\)$/;
        if(regex.test(placements.toString())) {
            console.log('regex matched')
        } else {
            res.send({
              message: 'placements is not an array',
                status: 400
            })
        }

        await sql`INSERT INTO tournaments (name, placements, date, link, hostlink, host) VALUES (${name}, ${placements}, ${date}, ${link}, ${hostlink}, ${host})`

    } else {
        res.send({
            message: 'Unauthorized',
            status: 401
        })
    }


})