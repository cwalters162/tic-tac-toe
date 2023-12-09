import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { GameStatus, Player, TileType } from "../reducers/appReducer.ts";
import Tile from "./Tile.tsx";

type Message = {
  command: Command;
  payload: any;
};

export interface RemoteGameState {
  id: string;
  board: TileType[][];
  status: GameStatus;
  turn: Player;
  prompt: string;
  clients: Record<string, Player>;
}

enum Command {
  get_game_list = "get_game_list",
  update_game_list = "update_game_list",
  update_user_id = "update_user_id",

  create_game = "create_game",
  join_game = "join_game",
  update_game = "update_game",
  reset_game = "reset_game",

  claim_tile = "claim_tile",
}

export default function RemoteGame() {
  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket("ws://localhost:162");
  const [userId, setUserId] = useState("");
  const [game, setGame] = useState<null | RemoteGameState>(null);
  const [gameToJoin, setGameToJoin] = useState("");

  useEffect(() => {
    switch (readyState) {
      case ReadyState.OPEN: {
        sendJsonMessage({ command: "get_game_list", payload: null });
      }
    }
  }, [readyState]);

  useEffect(() => {
    if (lastJsonMessage !== null) {
      let message = lastJsonMessage as Message;
      console.log(message.command);
      switch (message.command) {
        case Command.update_user_id: {
          setUserId(message.payload);
          break;
        }
        case Command.update_game_list: {
          console.log(
            `Server has sent a game list, ${JSON.stringify(message.payload)}`,
          );
          break;
        }
        case Command.update_game: {
          console.log(
            `Server has sent a game update ${JSON.stringify(message.payload)}`,
          );
          setGame(message.payload);
          break;
        }
      }
    }
  }, [lastJsonMessage]);

  function handleOnClick(x: number, y: number) {
    if (game == null) {
      return;
    }
    if (game.status != GameStatus.PLAYING) {
      return;
    }

    sendJsonMessage({
      command: Command.claim_tile,
      payload: {
        id: game.id,
        location: { x, y },
      },
    });
  }

  function handleResetOnClick() {
    if (!game) {
      return;
    }
    sendJsonMessage({ command: Command.reset_game, payload: game.id });
  }

  function handleInput(e) {
    e.preventDefault();
    console.log(e.currentTarget.value);
    setGameToJoin(e.currentTarget.value);
  }

  if (game === null)
    return (
      <div
        className={
          "flex flex-col justify-center items-center w-screen h-screen bg-custom-bg text-custom-text gap-4"
        }
      >
        Work In Progress
        <input
          className={"text-black p-2"}
          type={"text"}
          onInput={handleInput}
        />
        <button
          className={
            "text-xl p-3 min-w-[16rem] justify-center items-center bg-custom-primary rounded-3xl hover:bg-custom-highlight text-custom-text"
          }
          onClick={() => {
            sendJsonMessage({
              command: Command.join_game,
              payload: gameToJoin,
            });
          }}
        >
          Join Game
        </button>
        <button
          className={
            "text-xl p-3 min-w-[16rem] justify-center items-center bg-custom-primary rounded-3xl hover:bg-custom-highlight text-custom-text"
          }
          onClick={() =>
            sendJsonMessage({ command: Command.create_game, payload: null })
          }
        >
          Create Game
        </button>
      </div>
    );

  if (game) {
    return (
      <div
        className={
          "flex flex-col justify-center items-center w-screen h-screen bg-custom-bg"
        }
      >
        <span className={"text-xl sm:text-5xl pb-5 text-custom-text"}>
          Game ID: {game.id}
        </span>
        <span className={"text-2xl sm:text-5xl pb-5 text-custom-text"}>
          You are: {game.clients[userId]}
        </span>
        <span className={"text-2xl sm:text-5xl pb-5 text-custom-text"}>
          Current Player: {game.turn}
        </span>
        <div className={"flex justify-center border-y-2 border-custom-border"}>
          <Tile
            display={game.board[0][0]}
            handleOnClick={() => handleOnClick(0, 0)}
          />
          <Tile
            display={game.board[0][1]}
            handleOnClick={() => handleOnClick(0, 1)}
          />
          <Tile
            display={game.board[0][2]}
            handleOnClick={() => handleOnClick(0, 2)}
          />
        </div>
        <div className={"flex justify-center border-b-2 border-custom-border"}>
          <Tile
            display={game.board[1][0]}
            handleOnClick={() => handleOnClick(1, 0)}
          />
          <Tile
            display={game.board[1][1]}
            handleOnClick={() => handleOnClick(1, 1)}
          />
          <Tile
            display={game.board[1][2]}
            handleOnClick={() => handleOnClick(1, 2)}
          />
        </div>
        <div className={"flex justify-center border-b-2 border-custom-border"}>
          <Tile
            display={game.board[2][0]}
            handleOnClick={() => handleOnClick(2, 0)}
          />
          <Tile
            display={game.board[2][1]}
            handleOnClick={() => handleOnClick(2, 1)}
          />
          <Tile
            display={game.board[2][2]}
            handleOnClick={() => handleOnClick(2, 2)}
          />
        </div>
        <span className={"pt-5 text-2xl min-h-[4rem] text-custom-text"}>
          {game.prompt}
        </span>
        {!(game.status === GameStatus.PLAYING) ? (
          <button
            className={
              "border-custom-border border-2 text-custom-text px-2 text-2xl bg-custom-primary hover:bg-custom-highlight rounded-lg"
            }
            onClick={handleResetOnClick}
          >
            Play Again?
          </button>
        ) : (
          <div className={"min-h-[2.3rem]"} />
        )}
      </div>
    );
  }
}
