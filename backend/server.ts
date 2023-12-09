import WebSocket from 'ws';
const port = 162
const wss = new WebSocket.Server({ port });

export type Message = {
    command: Command,
    payload: any
}

export enum Command {
    increment_count = "increment_count",
    get_game_list = "get_game_list"
}

console.log(`Server listening on port: ${port}`)
wss.on('connection', (ws: WebSocket) => {
    let count = 0;
    console.log('New client connected');

    ws.on('message', (data: string) => {
        console.log(`Received message: ${data}`);


        try {
            let parsed: Message = JSON.parse(data);
            switch (parsed.command) {
                case Command.increment_count: {
                    console.log("incrementing count")
                    count += 1
                    console.log(`new count: ${count}`)
                    ws.send(JSON.stringify({ command: "update_count", payload: count}));
                }
                case Command.get_game_list: {
                    console.log('sending current game list')
                    ws.send(JSON.stringify({command: "update_game_list", payload: [{id: 123, createdAt: "fish"}]}))
                }
            }
        } catch (e) {
            console.log(`An error has occurred: ${e}`)
            ws.send(JSON.stringify({command: "error", payload: e}))
        }
    })

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});