import React, {useState} from "react";

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
  X,
  O,
}

function setTile(turn: Player) {
  switch (turn) {
    case Player.X: return TileType.X;
    case Player.O: return TileType.O;
  }
}

function App() {
  const [gameboard, setGameboard] = useState(initialGameboardState);
  const [turn, setTurn] = useState<Player>(Player.X)


  function handleOnClick(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    const target = event.target as HTMLDivElement;
    const id = target.id
    const location = id.split("-");
    const x = parseInt(location[0]);
    const y = parseInt(location[1]);
    console.log(gameboard[x][y])
    console.log(TileType.Empty)

    if (gameboard[x][y] == TileType.Empty) {
      setGameboard((prevState) => {
        const new_state = prevState
        new_state[x][y] = setTile(turn);
        return new_state
      })
    }
    console.log(`Clicked on: ${id}`)
    console.log(`Location at: X:${x} Y: ${y}`)
  }

  return (
      <div className={"flex flex-col justify-center items-center w-screen h-screen bg-black"}>
        {gameboard.map((row, index) => {
          let rowId = "";

          switch (index) {
            case 0: rowId = "top-row"; break;
            case 1: rowId = "mid-row"; break;
            case 2: rowId = "bottom-row"; break;
          }

          return (
              <div id={rowId} key={rowId} className={"flex justify-center"}>
                {row.map((tile, y) => {
                  let prefix = "";
                  let divId = ""
                  switch (index) {
                    case 0: prefix = "0-"; break;
                    case 1: prefix = "1-"; break;
                    case 2: prefix = "2-"; break;
                  }

                  switch (y) {
                    case 0: divId = prefix + "0"; break;
                    case 1: divId = prefix + "1"; break;
                    case 2: divId = prefix + "2"; break;
                  }

                  return (<div id={divId} key={divId} className={"min-w-[8rem] min-h-[8rem] text-9xl flex justify-center items-center bg-white border-yellow-400 border-2"} onClick={handleOnClick}>{tile}</div>)
                })
                }
              </div>
          )
        })}
      </div>

  )
}

export default App
