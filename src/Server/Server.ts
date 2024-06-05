import * as Files from "@wiggly-games/files";
import { Paths } from "../Helpers";
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
        const filePaths = await Files.GetDescendants(Paths.Data, (x) => x !== Paths.Data && !x.endsWith(".json"));
        if (filePaths.length === 0) {
            res.send("Could not find any training data :(")
            return
        }

        const path = filePaths[Math.floor(Math.random() * filePaths.length)];
        res.send(await Chain.Generate(path))
    })
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}