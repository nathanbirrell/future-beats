import { ReactComponent as ContinuousPlayIcon } from "../icons/continuous-play.svg";
import { ReactComponent as ContinuousPlayActiveIcon } from "../icons/continuous-play-active.svg";
import { ReactComponent as PlayIcon } from "../icons/play.svg";
import { ReactComponent as PauseIcon } from "../icons/pause.svg";
import { ReactComponent as RewindIcon } from "../icons/rewind.svg";
import { ReactComponent as FastForwardIcon } from "../icons/fast-forward.svg";
import { ReactComponent as ShuffleIcon } from "../icons/shuffle.svg";

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
    <div className="h-12 mt-8 flex items-center justify-center text-5xl md:text-6xl ">
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
  const icon = playing ? <PauseIcon /> : <PlayIcon />;
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
      <RewindIcon />
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
      <FastForwardIcon />
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
      <ShuffleIcon />
    </button>
  );
};

const ContinuousPlayButton = ({
  continuousPlaying,
  onContinuousPlayClick,
}: Pick<Props, "continuousPlaying" | "onContinuousPlayClick">) => {
  if (!onContinuousPlayClick) return null;

  const icon = continuousPlaying ? (
    <ContinuousPlayActiveIcon />
  ) : (
    <ContinuousPlayIcon />
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
