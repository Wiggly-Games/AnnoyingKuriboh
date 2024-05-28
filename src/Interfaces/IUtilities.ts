/*
    Utilities is used as a reference to retrieve the external modules that may be needed for execution.
    This will include things like:
        - The Database
        - The Markov Chain
        etc.
*/

import { MarkovChain } from "@wiggly-games/markov-chains";

export interface IUtilities {
    get Chain(): MarkovChain;
}