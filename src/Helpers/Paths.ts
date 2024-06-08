import { CreateDirectory, ROOT, ReadDirectoryFiles } from "@wiggly-games/files";

export const Paths = {
    Commands: ROOT + "/Discord/Commands",
    Static: ROOT + "/Static",
    Logs: `${ROOT}/Logs`,
    Data: `${ROOT}/Data`,
    Database: `${ROOT}/Database`
}

// Sets up directories to make sure they exist.
export async function Initialize(){
    for (const path of Object.values(Paths)) {
        await CreateDirectory(path);
    }
}

// Returns the name of all chains.
export async function GetChainPaths(): Promise<string[]> {
    return await ReadDirectoryFiles(Paths.Data);
}

// Returns a data set with the given name.
export function GetDataSet(name: string) {
    return `${Paths.Data}/${name}`;
}