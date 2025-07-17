import { initDB } from "@service/mongodb_service.js";
import { createPriority } from "@service/priorityService.js";
import { createStatus } from "@service/statusService.js";
import { getEnv } from "@configuration/index.js";

console.log("Starting installation...");
try {
    console.log('env', getEnv());
    await initDB();
} catch (e) {
    console.log(e)
    console.log("make sure that mongodb container started")
}


export const install = async (): Promise<void> => {
    try {
        console.log("Starting installation...");
        await createPriority("Extreme", "#F21E1E");
        await createPriority("Low", "#05A301");
        await createPriority("Moderate", "#3ABEFF");
        console.log("Priorities configured.");
        await createStatus("Not Started", "#F21E1E");
        await createStatus("In Progress", "#0225FF");
        await createStatus("Done", "#05A301");
        console.log("Statuses configured.");
        console.log("Installation complete.");
    }catch (e) {
        console.log(e)
    }

}

await install()
