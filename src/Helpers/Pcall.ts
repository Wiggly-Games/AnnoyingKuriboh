// Runs a function, catching errors. Returns a boolean indicating success.
// Should only be used in catch blocks, so that we don't throw errors within errors.
export async function pcall(f: ()=>Promise<void>): Promise<boolean> {
    try {
      await f();
      return true;
    } catch {
      return false;
    }
  }
  