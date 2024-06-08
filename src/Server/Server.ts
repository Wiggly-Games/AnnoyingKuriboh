import * as Files from "@wiggly-games/files";
import { Paths } from "../Helpers";
import { Defaults } from "../Configuration.json";
const express = require("express");

const port = 3000
let app = undefined;

export async function Initialize({ Chains }) {
    // If we already have a server, exit
    if (app !== undefined) {
        return;
    }

    // Otherwise, set up the server and add the routes
    app = express()
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })
    app.get('/generate/:DataSet', async (req, res) => {
        const filePaths = await Files.GetDescendants(Paths.Data, (x) => x !== Paths.Data && !x.endsWith(".json"));
        if (filePaths.length === 0) {
            res.send("Could not find any training data :(")
            return
        }

        const path = filePaths[Math.floor(Math.random() * filePaths.length)];
        res.send(await Chains.get(req.params.DataSet).Generate(path))
    })
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}