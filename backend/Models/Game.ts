import {GameStatus, Player, TileType} from "./types";
import {Command} from "../server";

export interface IGame  {
    id: string,
    board: TileType[][];
    status: GameStatus;
    turn: Player;
    prompt: string;
    clients: Record<string, Player>;
}

export class Game implements IGame {
    id: string;
    board = [
        [TileType.Empty, TileType.Empty, TileType.Empty],
        [TileType.Empty, TileType.Empty, TileType.Empty],
        [TileType.Empty, TileType.Empty, TileType.Empty],
    ];
    status = GameStatus.PLAYING;
    prompt = "";
    turn = Player.X;
    clients: Record<string, Player> = {};

    constructor(id: string) {
        this.id = id
    }

    claimTile(clientId: string, x: number, y: number): Command {
        let player_type = this.clients[clientId];
        this.prompt = "";

        if (player_type != this.turn) {
            this.prompt = "It's not your turn"
            return Command.not_your_turn;
        }

        if (this.board[x][y] !== TileType.Empty) {
            this.prompt = "Please select an unclaimed tile"
            return Command.not_your_turn
        }

        switch (player_type) {
            case Player.X: {
                this.board[x][y] = TileType.X;
                const result = this.checkWin();
                this.turn = Player.O;
                return result;
            }
            case Player.O: {
                this.board[x][y] = TileType.O;
                const result = this.checkWin();
                this.turn = Player.X;
                return result;
            }
        }
    }

    addClient(clientId: string) {
        if (Object.keys(this.clients).length == 2) {
            return
        }
            let hasX = false;
            let hasO = false;
            for (const playerType of Object.values(this.clients)) {
                if (playerType == Player.X) {
                    hasX = true
                } else if (playerType == Player.O) {
                    hasO = true
                }
            }

            if (hasX && !hasO) {
                this.clients[clientId] = Player.O
                return
            } else if (hasO && !hasX) {
                this.clients[clientId] = Player.X
                return
            } else if (hasX && hasO) {
                return
            } else {
                this.clients[clientId] = Player.X
                return
            }
    }

    checkWin() {
        const emptyTiles = this.board.flatMap((row) => {
            return row.filter((tile) => {
                return tile == TileType.Empty;
            });
        });

        if (this.checkForThreeInARow(TileType.X)) {
            this.status = GameStatus.WIN;
            this.prompt = "Player X won!";
            return Command.update_game
        } else if (this.checkForThreeInARow(TileType.O)) {
            this.status = GameStatus.WIN;
            this.prompt = "Player O won!";
            return Command.update_game
        } else if (emptyTiles.length === 0) {
            this.status = GameStatus.DRAW;
            this.prompt = "Draw!";
            return Command.update_game
        } else {
           return Command.update_game
        }
    }

    checkForThreeInARow(tileType: TileType) {
        for (let i = 0; i < 3; i++) {
            if (
                this.board[i][0] === tileType &&
                this.board[i][1] === tileType &&
                this.board[i][2] === tileType
            ) {
                return true;
            }
            if (
                this.board[0][i] === tileType &&
                this.board[1][i] === tileType &&
                this.board[2][i] === tileType
            ) {
                return true;
            }
        }

        if (
            this.board[0][0] === tileType &&
            this.board[1][1] === tileType &&
            this.board[2][2] === tileType
        ) {
            return true;
        }

        return (
            this.board[0][2] === tileType &&
            this.board[1][1] === tileType &&
            this.board[2][0] === tileType
        );
    }



    removeClient(clientId: string) {
        this.prompt = `Player ${clientId} has left the game`;
        delete this.clients[clientId]
    }

    reset() {
        this.board = [
            [TileType.Empty, TileType.Empty, TileType.Empty],
            [TileType.Empty, TileType.Empty, TileType.Empty],
            [TileType.Empty, TileType.Empty, TileType.Empty],
        ];
        this.status = GameStatus.PLAYING;
        this.prompt = "";
        this.turn = Player.X;
    }
}