import { InstallGlobalCommands } from "./src/utils.js";

const TEST_COMMAND = {
    name: 'test',
    description: 'Basic command to check connection',
    type: 1,
};

// // Host a new event
// const HOST_COMMAND = {
//     name: 'host',
//     description: 'Host a run',
//     type: 1,
// };

const ALL_COMMANDS = [TEST_COMMAND];

await InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);