import { TDependencyInjections } from "../Types/TDependencyInjections";

export interface IChainUser {
    Initialize(data: TDependencyInjections): Promise<void>;
}