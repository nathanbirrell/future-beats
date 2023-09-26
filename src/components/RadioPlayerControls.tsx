import Image from "next/image";

type Props = {
  playing?: boolean;
  continuousPlaying?: boolean;
  onPlayClick?: React.DOMAttributes<HTMLButtonElement>["onClick"];
  onContinuousPlayClick?: React.DOMAttributes<HTMLButtonElement>["onClick"];
  onRewindClick?: React.DOMAttributes<HTMLButtonElement>["onClick"];
  onFastForwardClick?: React.DOMAttributes<HTMLButtonElement>["onClick"];
  onShuffleClick?: React.DOMAttributes<HTMLButtonElement>["onClick"];
  loading?: boolean;
};

const baseBtnClassNames =
  "transition duration-100 ease-in-out transform hover:scale-105 px-2";

export const RadioPlayerControls = (props: Props) => {
  return (
    <div className="h-12 my-8 flex items-center justify-center text-5xl md:text-6xl ">
      <ContinuousPlayButton {...props} />
      <RewindButton {...props} />
      <PlayPauseButton {...props} />
      <FastForwardButton {...props} />
      <ShuffleButton {...props} />
    </div>
  );
};

const PlayPauseButton = ({
  playing,
  onPlayClick,
}: Pick<Props, "playing" | "onPlayClick">) => {
  const icon = playing ? (
    <Image src="/icons/pause.svg" alt="Pause" height={50} width={50} />
  ) : (
    <Image src="/icons/play.svg" alt="Play" height={50} width={50} />
  );
  const title = playing ? "Pause" : "Play";
  return (
    <button title={title} onClick={onPlayClick} className={baseBtnClassNames}>
      {icon}
    </button>
  );
};

const RewindButton = ({ onRewindClick }: Pick<Props, "onRewindClick">) => {
  return (
    <button
      className={baseBtnClassNames}
      onClick={onRewindClick}
      title="Back 30sec"
    >
      <Image src="/icons/rewind.svg" alt="Rewind" height={50} width={50} />
    </button>
  );
};
const FastForwardButton = ({
  onFastForwardClick,
}: Pick<Props, "onFastForwardClick">) => {
  return (
    <button
      className={baseBtnClassNames}
      onClick={onFastForwardClick}
      title="Forward 30sec"
    >
      <Image
        src="/icons/fast-forward.svg"
        alt="Fast Forward"
        height={50}
        width={50}
      />
    </button>
  );
};

const ShuffleButton = ({
  onShuffleClick,
  loading,
}: Pick<Props, "onShuffleClick" | "loading">) => {
  return (
    <button
      title="Shuffle"
      className={baseBtnClassNames}
      onClick={onShuffleClick}
      disabled={loading}
    >
      <Image src="/icons/shuffle.svg" alt="Shuffle" height={50} width={50} />
    </button>
  );
};

const ContinuousPlayButton = ({
  continuousPlaying,
  onContinuousPlayClick,
}: Pick<Props, "continuousPlaying" | "onContinuousPlayClick">) => {
  if (!onContinuousPlayClick) return null;

  const icon = continuousPlaying ? (
    <Image
      src="/icons/continuous-play-active.svg"
      alt="Continuous Play"
      height={50}
      width={50}
    />
  ) : (
    <Image
      src="/icons/continuous-play.svg"
      alt="Continuous Play"
      height={50}
      width={50}
    />
  );
  const title = continuousPlaying
    ? "Switch Off Continuous Play"
    : "Switch On Continuous Play";
  return (
    <button
      title={title}
      onClick={onContinuousPlayClick}
      className={baseBtnClassNames}
    >
      {icon}
    </button>
  );
};
