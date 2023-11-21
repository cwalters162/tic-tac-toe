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
}

function App() {
  const [gameBoard, setGameBoard] = useState(initialGameBoardState);
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING)
  const [turn, setTurn] = useState<Player>(Player.X)
  const [prompt, setPrompt] = useState("")

  function checkForThreeInARow(tileType: TileType) {
    for (let i = 0; i < 3; i++) {
      if (gameBoard[i][0] === tileType && gameBoard[i][1] === tileType && gameBoard[i][2] === tileType) {
        return true
      }
      if (gameBoard[0][i] === tileType && gameBoard[1][i] === tileType && gameBoard[2][i] === tileType) {
        return true
      }
    }

    if (gameBoard[0][0] === tileType && gameBoard[1][1] === tileType && gameBoard[2][2] === tileType) {
      return true
    }

    return gameBoard[0][2] === tileType && gameBoard[1][1] === tileType && gameBoard[2][0] === tileType;
  }

  function checkWin() {
    if (checkForThreeInARow(TileType.X)) {
      setGameState(GameState.WIN)
      setPrompt(`Player X won!`)
    }
    if (checkForThreeInARow(TileType.O)) {
      setGameState(GameState.WIN)
      setPrompt(`Player O won!`)
    }


    const emptyTiles = gameBoard.flatMap((row) => {
        return row.filter((tile)=> {
          return tile == TileType.Empty;
        })
      })

    if (emptyTiles.length === 0) {
      setGameState(GameState.DRAW);
      setPrompt("Draw!")
    }
  }

  function claimedTile() {
    setPrompt("Please click an unclaimed tile")
  }

  function claimTile(turn: Player, x: number, y: number) {
    setPrompt("")
    switch (turn) {
      case Player.X: {
        const newGameBoard = gameBoard
        newGameBoard[x][y] = TileType.X
        setGameBoard(newGameBoard);
        checkWin()
        setTurn(Player.O)
        break;
      }
      case Player.O: {
        const newGameBoard = gameBoard
        newGameBoard[x][y] = TileType.O
        setGameBoard(newGameBoard);
        checkWin()
        setTurn(Player.X)
        break;
      }
    }
  }

  function resetGame() {
    const board = [
      [TileType.Empty, TileType.Empty, TileType.Empty],
      [TileType.Empty, TileType.Empty, TileType.Empty],
      [TileType.Empty, TileType.Empty, TileType.Empty],
    ]
    setPrompt("");
    setGameState(GameState.PLAYING);
    setGameBoard(board);
    setTurn(Player.X);
  }

  function handleOnClick(x: number, y: number) {
    if (gameState != GameState.PLAYING) {
      return
    }

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
        {!(gameState === GameState.PLAYING) ?
            <button className={"border-custom-border border-2 text-custom-text px-2 text-2xl bg-custom-primary hover:bg-custom-highlight rounded-lg"} onClick={resetGame}>Play Again?</button>
            :
            <div className={"min-h-[2.3rem]"}/>
        }
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
