import LocalGame from "./components/LocalGame.tsx";
import { useState } from "react";
import RemoteGame from "./components/RemoteGame.tsx";

enum GameOption {
  PENDING,
  LOCAL,
  REMOTE,
}

interface SelectGameModeProps {
  setGameOption: (
    value: ((prevState: GameOption) => GameOption) | GameOption,
  ) => void;
}

function SelectGameMode({ setGameOption }: SelectGameModeProps) {
  return (
    <div
      className={
        "flex flex-col justify-center items-center w-screen h-screen bg-custom-bg text-custom-text gap-4"
      }
    >
      <h1 className={"pt-4 text-[2rem] text-center"}>
        How do you want to play?
      </h1>
      <button
        className={
          "text-xl p-3 min-w-[16rem] justify-center items-center bg-custom-primary rounded-3xl hover:bg-custom-highlight text-custom-text"
        }
        onClick={() => setGameOption(GameOption.LOCAL)}
      >
        Local
      </button>
      <button
        className={
          "text-xl p-3 min-w-[16rem] justify-center items-center bg-custom-primary rounded-3xl hover:bg-custom-highlight text-custom-text"
        }
        onClick={() => setGameOption(GameOption.REMOTE)}
      >
        Remote
      </button>
    </div>
  );
}

function App() {
  const [gameOption, setGameOption] = useState(GameOption.PENDING);

  switch (gameOption) {
    case GameOption.PENDING: {
      return <SelectGameMode setGameOption={setGameOption} />;
    }
    case GameOption.LOCAL:
      return <LocalGame />;
    case GameOption.REMOTE:
      return <RemoteGame />;
  }
}

export default App;
