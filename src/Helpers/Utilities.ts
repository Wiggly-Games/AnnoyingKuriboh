import { MarkovChain } from "@wiggly-games/markov-chains";
import { IUtilities } from "../Interfaces";
import { IDatabase } from "../Interfaces/IDatabase";

export class Utilities implements IUtilities {
    private _chain: MarkovChain;
    private _database: IDatabase;

    constructor(chain: MarkovChain, database: IDatabase) {
        this._chain = chain;
        this._database = database;
    }

    get Chain(): MarkovChain {
        return this._chain;
    }
    get Database(): IDatabase {
        return this._database;
    }
}