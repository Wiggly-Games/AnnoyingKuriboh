import { MarkovChain } from "@wiggly-games/markov-chains";
import { IUtilities } from "../Interfaces";

export class Utilities implements IUtilities {
    private _chain: MarkovChain;

    constructor(chain: MarkovChain) {
        this._chain = chain;
    }

    get Chain(): MarkovChain {
        return this._chain;
    }
}