import { IDatabase } from "../Interfaces";
import { MarkovChain } from "@wiggly-games/markov-chains";

export type TDependencyInjections = {
    Database: IDatabase,
    Chain: MarkovChain
};
