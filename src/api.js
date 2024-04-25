import fetch from "node-fetch";
export async function FetchAbyssInfo() {
    const url = 'https://api.ambr.top';
    const endpoint = '/v2/en/tower';
    return fetch(url + endpoint, {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
    });
}

export async function FetchMonsterIcon(monsterName) {
    const url = 'https://api.ambr.top';
    const endpoint = '/assets/UI/monster/';
    return fetch(`${url}${endpoint}${monsterName}.png`);
}
