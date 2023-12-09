import { useContext, useEffect } from "react";
import { SocketContext } from "../contexts/SocketContext.tsx";

export default function RemoteGame() {
  const ws = useContext(SocketContext);
  useEffect(() => {
    ws.send(JSON.stringify({ command: "get_game_list", payload: null }));
    ws.addEventListener("message", (e) => {
      let data = JSON.parse(e.data);
      console.log("You got a message");
      switch (data.command) {
        case "get_game_list": {
          console.log("Server has sent a game list");
        }
      }
    });
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div
      className={
        "flex flex-col justify-center items-center w-screen h-screen bg-custom-bg text-custom-text gap-4"
      }
    >
      To Be Implemented
    </div>
  );
}
