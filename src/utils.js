import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';
import { createCanvas, loadImage} from 'canvas';
import dotenv from 'dotenv';
import {FetchAbyssInfo, FetchMonsterIcon} from "./api.js";

dotenv.config()

export function VerifyDiscordRequest(clientKey) {
    return function (req, res, buf, encoding) {
        const signature = req.get('X-Signature-Ed25519');
        const timestamp = req.get('X-Signature-Timestamp');

        const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
        if (!isValidRequest) {
            res.status(401).send('Bad request signature');
            throw new Error('Bad request signature');
        }
    };
}
export async function DiscordRequest(endpoint, options) {
    // append endpoint to root API URL
    const url = 'https://discord.com/api/v10/' + endpoint;
    // Stringify payloads
    if (options.body) options.body = JSON.stringify(options.body);
    // Use node-fetch to make requests
    const res = await fetch(url, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
        },
        ...options
    });

    // throw API errors
    if (!res.ok) {
        const data = await res.json();
        console.log(res.status);
        throw new Error(JSON.stringify(data));
    }
    // return original response
    return res;
}

export async function InstallGlobalCommands(appId, commands) {
    // API endpoint to overwrite global commands
    const endpoint = `applications/${appId}/commands`;

    try {
        // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
        await DiscordRequest(endpoint, { method: 'PUT', body: commands });
    } catch (err) {
        console.error(err);
    }
}

export async function GenerateChamberImage(listOfMonsters) {
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');
    const icon = await FetchMonsterIcon(listOfMonsters[0]);
    const arrayBuffer = await icon.arrayBuffer();
    const image = await loadImage(Buffer.from(arrayBuffer));

    ctx.drawImage(image, 0,0,200,200);
    return canvas.toDataURL('image/png');
}

export async function GetAbyssInfo() {
    const abyssInfo = await FetchAbyssInfo();
    const response = await abyssInfo.json();
    if (response.response !== 200) {
        throw new Error('');
    }
    const { monsterList, items } = response.data;
}
