import { MarkovChain } from "@wiggly-games/markov-chains";
import { GetDataSet } from "../Helpers";
const express = require("express");

const port = 3000
let app = undefined;

export async function Initialize({ Chain }) {
    // If we already have a server, exit
    if (app !== undefined) {
        return;
    }

    // Otherwise, set up the server and add the routes
    app = express()
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })
    app.get('/generate', async (req, res) => {
        res.send(await Chain.Generate(GetDataSet('WeirdAl')))
    })
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}