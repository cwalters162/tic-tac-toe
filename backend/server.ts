import WebSocket from 'ws';
import crypto from "node:crypto";
import {Game} from "./Models/Game";
const port = 162
const wss = new WebSocket.Server({ port });

export type Message = {
    command: Command,
    payload: any
}

export enum Command {
    get_game_list = "get_game_list",
    update_game_list = "update_game_list",

    update_user_id = "update_user_id",

    create_game = "create_game",
    join_game = "join_game",
    update_game = "update_game",
    reset_game = "reset_game",

    claim_tile = "claim_tile",
    not_your_turn = "not_your_turn"
}

console.log(`Server listening on port: ${port}`)

const connections: Record<string, WebSocket> = {};
const games: Record<string, Game> = {}

wss.on('connection', (ws: WebSocket) => {

    console.log('New client connected - generating UUID and sending it to the client');
    let uuid: string = crypto.randomUUID();
    connections[uuid] = ws

    ws.send(JSON.stringify({
        command: Command.update_user_id,
        payload: uuid
    }))

    ws.on('message', (data: string) => {
        console.log(`Received message: ${data}`);
        try {
            let parsed: Message = JSON.parse(data);
            handleMessage(parsed, uuid, ws)
        } catch (e) {
            console.log(`An error has occurred: ${e}`)
            ws.send(JSON.stringify({command: "error", payload: e}))
        }
    })

    ws.on('close', () => {
        console.log('Client disconnected');
        clean(uuid)
    });
});

function handleMessage(message: Message, uuid: string, ws: WebSocket) {
    switch (message.command) {
        case Command.get_game_list: {
            console.log('Sending current game list')
            ws.send(JSON.stringify({command: Command.update_game_list, payload: Object.keys(games)}))
            break;
        }
        case Command.create_game: {
            const gameId = crypto.randomUUID()
            console.log(`User: ${uuid} created game ${gameId}.`)
            games[gameId] = new Game(gameId);
            games[gameId].addClient(uuid);
            ws.send(JSON.stringify({command: "update_game", payload: games[gameId]}))
            break;
        }
        case Command.join_game: {
            console.log(`User ${uuid} joined game ${message.payload}`)
            const gameId = message.payload
            games[gameId].addClient(uuid);

            for (const client in games[gameId].clients) {
                const clientWS = connections[client];
                clientWS.send(JSON.stringify({command: Command.update_game, payload: games[gameId]}))
            }
            break;
        }
        case Command.claim_tile: {
            const gameId = message.payload.id;
            const {x, y} = message.payload.location
            const resultingCommand = games[gameId].claimTile(uuid, x, y);

            switch (resultingCommand) {
                case Command.not_your_turn: {
                    ws.send(JSON.stringify({command: Command.update_game, payload: games[gameId]}))
                    break;
                }
                case Command.update_game: {
                    for (const client in games[gameId].clients) {
                        const clientWS = connections[client];
                        clientWS.send(JSON.stringify({command: Command.update_game, payload: games[gameId]}))
                    }
                    break;
                }
            }
            break;
        }
        case Command.reset_game: {
            const gameId = message.payload
            games[gameId].reset()
            for (const client in games[gameId].clients) {
                const clientWS = connections[client];
                clientWS.send(JSON.stringify({command: Command.update_game, payload: games[gameId]}))
            }
            break;
        }
    }
}

function clean(uuid: string) {
    console.log(`Cleaning client: ${uuid}`)
    delete connections[uuid]

    for (const gameId in games) {
        let game = games[gameId];
        if (game.clients[uuid] == null) {
            return
        }
        console.log(`Removing client: ${uuid} from game: ${JSON.stringify(game.id)}`)
        game.removeClient(uuid)
        console.log(`Client removed. Remaining clients in game: ${JSON.stringify(Object.values(game.clients))}`)
        for (const client in game.clients) {
            console.log(`Connections:${JSON.stringify(Object.keys(connections))}`)
            let clientWS = connections[client]
            if (clientWS == null) {
                console.log(`client ${client} websocket not found...skipping`)
                continue
            }
            console.log(`Updating game for client: ${client}`)
            clientWS.send(JSON.stringify({ command: Command.update_game, payload: game }))
        }
    }
}