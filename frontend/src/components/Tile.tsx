interface TileProps {
  display: string;
  handleOnClick: () => void;
}

export default function Tile({ display, handleOnClick }: TileProps) {
  return (
    <div
      className={
        " min-h-[5rem] min-w-[5rem] sm:min-w-[9rem] sm:min-h-[9rem] text-5xl sm:text-9xl flex justify-center items-center bg-custom-primary border-custom-border first:border-l-2 border-r-2 hover:bg-custom-highlight text-custom-text"
      }
      onClick={() => handleOnClick()}
    >
      {display}
    </div>
  );
}
