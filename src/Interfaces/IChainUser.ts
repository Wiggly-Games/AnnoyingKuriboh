import { IUtilities } from "./IUtilities";

export interface IChainUser {
    Initialize(utilities: IUtilities): Promise<void>;
}