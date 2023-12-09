import { useReducer } from "react";
import {
  AppState,
  Command,
  GameStatus,
  Player,
  reducer,
  TileType,
} from "../reducers/appReducer.ts";
import Tile from "./Tile.tsx";

const initialGameBoardState = [
  [TileType.Empty, TileType.Empty, TileType.Empty],
  [TileType.Empty, TileType.Empty, TileType.Empty],
  [TileType.Empty, TileType.Empty, TileType.Empty],
];

const initialState: AppState = {
  gameBoard: initialGameBoardState,
  gameStatus: GameStatus.PLAYING,
  prompt: "",
  turn: Player.X,
};

export default function LocalGame() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { prompt, turn, gameStatus, gameBoard } = state;

  function handleResetOnClick() {
    dispatch({ command: Command.Reset, payload: null });
  }

  function handleOnClick(x: number, y: number) {
    if (gameStatus != GameStatus.PLAYING) {
      return;
    }
    switch (gameBoard[x][y]) {
      case TileType.Empty: {
        dispatch({ command: Command.ClaimTile, payload: { x: x, y: y } });
        break;
      }
      case TileType.X: {
        dispatch({ command: Command.ClaimedTile, payload: null });
        break;
      }
      case TileType.O: {
        dispatch({ command: Command.ClaimedTile, payload: null });
        break;
      }
    }
  }

  return (
    <div
      className={
        "flex flex-col justify-center items-center w-screen h-screen bg-custom-bg"
      }
    >
      <span className={"text-3xl sm:text-5xl pb-5 text-custom-text"}>
        Current Player: {turn}
      </span>
      <div className={"flex justify-center border-y-2 border-custom-border"}>
        <Tile
          display={gameBoard[0][0]}
          handleOnClick={() => handleOnClick(0, 0)}
        />
        <Tile
          display={gameBoard[0][1]}
          handleOnClick={() => handleOnClick(0, 1)}
        />
        <Tile
          display={gameBoard[0][2]}
          handleOnClick={() => handleOnClick(0, 2)}
        />
      </div>
      <div className={"flex justify-center border-b-2 border-custom-border"}>
        <Tile
          display={gameBoard[1][0]}
          handleOnClick={() => handleOnClick(1, 0)}
        />
        <Tile
          display={gameBoard[1][1]}
          handleOnClick={() => handleOnClick(1, 1)}
        />
        <Tile
          display={gameBoard[1][2]}
          handleOnClick={() => handleOnClick(1, 2)}
        />
      </div>
      <div className={"flex justify-center border-b-2 border-custom-border"}>
        <Tile
          display={gameBoard[2][0]}
          handleOnClick={() => handleOnClick(2, 0)}
        />
        <Tile
          display={gameBoard[2][1]}
          handleOnClick={() => handleOnClick(2, 1)}
        />
        <Tile
          display={gameBoard[2][2]}
          handleOnClick={() => handleOnClick(2, 2)}
        />
      </div>
      <span className={"pt-5 text-2xl min-h-[4rem] text-custom-text"}>
        {prompt}
      </span>
      {!(gameStatus === GameStatus.PLAYING) ? (
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
