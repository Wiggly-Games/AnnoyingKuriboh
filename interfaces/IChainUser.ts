import { MarkovChain } from "@wiggly-games/markov-chains";

export interface IChainUser {
    Initialize(chain: MarkovChain): Promise<void>;
}