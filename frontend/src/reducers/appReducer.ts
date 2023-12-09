export enum TileType {
  X = "X",
  O = "O",
  Empty = "",
}

export enum Player {
  X = "X",
  O = "O",
}

export enum GameStatus {
  PLAYING,
  DRAW,
  WIN,
}

export interface LocalGameState {
  gameBoard: TileType[][];
  gameStatus: GameStatus;
  turn: Player;
  prompt: string;
}
export interface Action {
  command: Command;
  // eslint-disable-next-line
  payload: any;
}

export enum Command {
  ClaimTile = "claimTile",
  ClaimedTile = "claimedTile",
  Reset = "reset",
}

export function reducer(state: LocalGameState, action: Action) {
  const { turn } = state;

  switch (action.command) {
    case Command.ClaimTile: {
      const { x, y } = action.payload;
      return claimTile(turn, x, y);
    }
    case Command.ClaimedTile: {
      return claimedTile();
    }
    case Command.Reset: {
      return resetGame();
    }
  }

  function checkForThreeInARow(tileType: TileType, checkState: LocalGameState) {
    for (let i = 0; i < 3; i++) {
      if (
        checkState.gameBoard[i][0] === tileType &&
        checkState.gameBoard[i][1] === tileType &&
        checkState.gameBoard[i][2] === tileType
      ) {
        return true;
      }
      if (
        checkState.gameBoard[0][i] === tileType &&
        checkState.gameBoard[1][i] === tileType &&
        checkState.gameBoard[2][i] === tileType
      ) {
        return true;
      }
    }

    if (
      checkState.gameBoard[0][0] === tileType &&
      checkState.gameBoard[1][1] === tileType &&
      checkState.gameBoard[2][2] === tileType
    ) {
      return true;
    }

    return (
      checkState.gameBoard[0][2] === tileType &&
      checkState.gameBoard[1][1] === tileType &&
      checkState.gameBoard[2][0] === tileType
    );
  }

  function checkWin(checkState: LocalGameState) {
    const emptyTiles = checkState.gameBoard.flatMap((row) => {
      return row.filter((tile) => {
        return tile == TileType.Empty;
      });
    });
    if (checkForThreeInARow(TileType.X, checkState)) {
      return {
        ...checkState,
        gameStatus: GameStatus.WIN,
        prompt: "Player X won!",
      };
    } else if (checkForThreeInARow(TileType.O, checkState)) {
      return {
        ...checkState,
        gameStatus: GameStatus.WIN,
        prompt: "Player O won!",
      };
    } else if (emptyTiles.length === 0) {
      return {
        ...checkState,
        gameStatus: GameStatus.DRAW,
        prompt: "Draw!",
      };
    } else {
      return {
        ...checkState,
      };
    }
  }
  function claimedTile() {
    return {
      ...state,
      prompt: "Please click an unclaimed tile",
    };
  }

  function claimTile(turn: Player, x: number, y: number) {
    state.prompt = "";
    switch (turn) {
      case Player.X: {
        let newState = {
          ...state,
        };

        newState.gameBoard[x][y] = TileType.X;
        newState = checkWin(newState);
        newState.turn = Player.O;
        return newState;
      }
      case Player.O: {
        let newState = {
          ...state,
        };

        newState.gameBoard[x][y] = TileType.O;
        newState = checkWin(newState);
        newState.turn = Player.X;
        return newState;
      }
    }
  }

  function resetGame() {
    const board = [
      [TileType.Empty, TileType.Empty, TileType.Empty],
      [TileType.Empty, TileType.Empty, TileType.Empty],
      [TileType.Empty, TileType.Empty, TileType.Empty],
    ];
    return {
      gameBoard: board,
      gameStatus: GameStatus.PLAYING,
      prompt: "",
      turn: Player.X,
    };
  }
}
