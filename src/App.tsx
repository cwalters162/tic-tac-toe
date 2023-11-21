import { useState} from "react";

enum TileType {
  X = "X",
  O = "O",
  Empty = "",
}

const initialGameBoardState = [
    [TileType.Empty, TileType.Empty, TileType.Empty],
    [TileType.Empty, TileType.Empty, TileType.Empty],
    [TileType.Empty, TileType.Empty, TileType.Empty],
]

enum Player {
  X = "X",
  O = "O",
}

enum GameState {
  PLAYING,
  DRAW,
  WIN,
  LOSS,
}

function App() {
  const [gameBoard, setGameBoard] = useState(initialGameBoardState);
  const [turn, setTurn] = useState<Player>(Player.X)
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING)
  const [prompt, setPrompt] = useState("")

  function checkWin() {
    if (gameBoard[0][0] == TileType.X && gameBoard[0][1] == TileType.X && gameBoard[0][2] == TileType.X) {
      setGameState(GameState.WIN)
      setPrompt(`Player fillme won!`)
    }
  }

  function claimedTile() {
    setPrompt("Please click an unclaimed tile")
  }

  function claimTile(turn: Player, x: number, y: number) {
    switch (turn) {
      case Player.X: {
        const newGameBoard = gameBoard
        newGameBoard[x][y] = TileType.X
        setGameBoard(newGameBoard);
        checkWin()
        setTurn(Player.O)
        setPrompt("")
        break;
      }
      case Player.O: {
        const newGameBoard = gameBoard
        newGameBoard[x][y] = TileType.O
        setGameBoard(newGameBoard);
        checkWin()
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

  if (gameState == GameState.WIN) {
    return (
        <div className={"flex flex-col justify-center items-center w-screen h-screen bg-black text-custom-text"}>
          <span>Congratulations you won!</span>
          <span>Play again?</span>
          <button className={"border-2 border"}>Yes!</button>
        </div>
    )
  }

  return (
      <div className={"flex flex-col justify-center items-center w-screen h-screen bg-custom-bg"}>
        <span className={"text-5xl pb-5 text-custom-text"}>Current Player: {turn}</span>
        <div className={"flex justify-center border-y-2 border-custom-border"}>
          <Tile display={gameBoard[0][0]} handleOnClick={() => handleOnClick(0, 0)}/>
          <Tile display={gameBoard[0][1]} handleOnClick={() => handleOnClick(0, 1)}/>
          <Tile display={gameBoard[0][2]} handleOnClick={() => handleOnClick(0, 2)}/>
        </div>
        <div className={"flex justify-center border-b-2 border-custom-border"}>
          <Tile display={gameBoard[1][0]} handleOnClick={() => handleOnClick(1, 0)}/>
          <Tile display={gameBoard[1][1]} handleOnClick={() => handleOnClick(1, 1)}/>
          <Tile display={gameBoard[1][2]} handleOnClick={() => handleOnClick(1, 2)}/>
        </div>
        <div className={"flex justify-center border-b-2 border-custom-border"}>
          <Tile display={gameBoard[2][0]} handleOnClick={() => handleOnClick(2, 0)}/>
          <Tile display={gameBoard[2][1]} handleOnClick={() => handleOnClick(2, 1)}/>
          <Tile display={gameBoard[2][2]} handleOnClick={() => handleOnClick(2, 2)}/>
        </div>
        <span className={"pt-5 text-2xl min-h-[4rem] text-custom-text"}>{prompt}</span>
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
          className={"min-w-[9rem] min-h-[9rem] text-9xl flex justify-center items-center bg-custom-primary border-custom-border first:border-l-2 border-r-2 hover:bg-custom-highlight text-custom-text"}
          onClick={() => handleOnClick()}>
        {display}
      </div>
  )
}

export default App
