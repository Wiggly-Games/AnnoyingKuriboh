import { MarkovChain } from "@wiggly-games/markov-chains";
import { GetStaticData } from "../Helpers";
import { IUtilities } from "../Interfaces";
const express = require("express");

const port = 3000

let chain: MarkovChain;
let app: any;

export async function Initialize(utilities: IUtilities) {
    app = express()

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })
    app.get('/generate', async (req, res) => {
        res.send(await utilities.Chain.Generate(GetStaticData()))
    })
    
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}