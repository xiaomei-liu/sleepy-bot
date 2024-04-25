import { InstallGlobalCommands } from "./src/utils.js";

const TEST_COMMAND = {
    name: 'test',
    description: 'Basic command to check connection',
    type: 1,
};

const ABYSS_INFO_COMMAND = {
    name: 'abyss_info',
    description: 'Check floor info of abyss',
    type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND, ABYSS_INFO_COMMAND];

await InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);