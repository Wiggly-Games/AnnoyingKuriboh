import { CreateDirectory, ROOT } from "@wiggly-games/files";

export const Paths = {
    Commands: ROOT + "/src/Discord/Commands",
    Static: ROOT + "/Static",
    Logs: `${ROOT}/Logs`,
    Data: `${ROOT}/Data`
}

// Sets up directories to make sure they exist.
export async function Initialize(){
    for (const path of Object.values(Paths)) {
        await CreateDirectory(path);
    }
}

// Returns a data set with the given name.
export function GetDataSet(name: string) {
    return `${Paths.Data}\\${name}`;
}