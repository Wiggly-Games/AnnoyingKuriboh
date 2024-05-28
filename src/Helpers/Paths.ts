import { ROOT } from "@wiggly-games/files";

export const CommandFiles = ROOT + "\\src\\Discord\\Commands\\Utility";
export const Static = ROOT + "\\Static";

export function GetStaticData(name?: string | undefined) {
    if (!name) {
        name = "Data";
    }

    return `${Static}\\${name}`;
}