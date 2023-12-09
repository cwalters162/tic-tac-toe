import { useEffect } from "react";

export default function RemoteGame() {
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:162");
    ws.addEventListener("open", () => {
      console.log("Connected to server.");
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
