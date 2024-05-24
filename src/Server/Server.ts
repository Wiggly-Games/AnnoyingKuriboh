import { MarkovChain } from "@wiggly-games/markov-chains";
const express = require("express");

const port = 3000

let chain: MarkovChain;
let app: any;

export async function Initialize(_chain: MarkovChain) {
    app = express()
    chain = _chain;

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })
    app.get('/generate', async (req, res) => {
        res.send(await chain.Generate())
    })
    
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}