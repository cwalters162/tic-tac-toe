import { useState } from "react";

enum TileType {
  X = "X",
  O = "O",
  Empty = "",
}

const initialGameboardState = [
    [TileType.Empty, TileType.Empty, TileType.Empty],
    [TileType.Empty, TileType.Empty, TileType.Empty],
    [TileType.Empty, TileType.Empty, TileType.Empty],
]

enum Player {
  X = "X",
  O = "O",
}

function App() {
  const [gameBoard, setGameBoard] = useState(initialGameboardState);
  const [turn, setTurn] = useState<Player>(Player.X)
  const [prompt, setPrompt] = useState("")

  function claimedTile() {
    setPrompt("Please click an unclaimed tile")
  }

  function claimTile(turn: Player, x: number, y: number) {
    switch (turn) {
      case Player.X: {
        const newGameBoard = gameBoard
        newGameBoard[x][y] = TileType.X
        setGameBoard(newGameBoard);
        setTurn(Player.O)
        setPrompt("")
        break;
      }
      case Player.O: {
        const newGameBoard = gameBoard
        newGameBoard[x][y] = TileType.O
        setGameBoard(newGameBoard);
        setTurn(Player.X)
        setPrompt("")
        break;
      }
    }
  }

  function handleOnClick(x: number, y: number) {
    switch (gameBoard[x][y]) {
      case TileType.Empty: {
        claimTile(turn, x, y)
        break;
      }
      case TileType.X: {
        claimedTile()
        break;
      }
      case TileType.O: {
        claimedTile()
        break;
      }
    }
  }

  return (
      <div className={"flex flex-col justify-center items-center w-screen h-screen bg-black"}>
        <span className={"text-white text-5xl pb-5"}>Current Player: {turn}</span>
        <div className={"flex justify-center"}>
          <Tile display={gameBoard[0][0]} handleOnClick={() => handleOnClick(0, 0)}/>
          <Tile display={gameBoard[0][1]} handleOnClick={() => handleOnClick(0, 1)}/>
          <Tile display={gameBoard[0][2]} handleOnClick={() => handleOnClick(0, 2)}/>
        </div>
        <div className={"flex justify-center"}>
          <Tile display={gameBoard[1][0]} handleOnClick={() => handleOnClick(1, 0)}/>
          <Tile display={gameBoard[1][1]} handleOnClick={() => handleOnClick(1, 1)}/>
          <Tile display={gameBoard[1][2]} handleOnClick={() => handleOnClick(1, 2)}/>
        </div>
        <div className={"flex justify-center"}>
          <Tile display={gameBoard[2][0]} handleOnClick={() => handleOnClick(2, 0)}/>
          <Tile display={gameBoard[2][1]} handleOnClick={() => handleOnClick(2, 1)}/>
          <Tile display={gameBoard[2][2]} handleOnClick={() => handleOnClick(2, 2)}/>
        </div>
        <span className={"text-white pt-5 text-2xl min-h-[4rem]"}>{prompt}</span>
      </div>
  )
}
interface TileProps {
  display: string,
  handleOnClick: () => void
}

function Tile({display, handleOnClick}: TileProps) {
  return (
      <div
          className={"min-w-[8rem] min-h-[9rem] text-9xl flex justify-center items-center bg-white border-yellow-400 border-2"}
          onClick={() => handleOnClick()}>
        {display}
      </div>
  )
}

export default App
