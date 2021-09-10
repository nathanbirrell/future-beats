import { useEffect, useRef, useState } from "react";
import { useIntervalRunner } from "./useIntervalRunner";

interface Options {
  // ID of the iframe we want to control
  id: string;
}

const UPDATE_POSITION_FREQUENCY = 1000;

export const useSoundCloudPlayer = ({ id }: Options) => {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  let widget = useRef<SoundCloudWidget>(undefined);

  useEffect(() => {
    widget.current = window.SC.Widget(id);
  }, [id]);

  const updatePosition = () => {
    if (!widget || !widget.current) return;

    // Update position value
    widget.current.getPosition((newPosition: number) =>
      setPosition(newPosition)
    );

    // Update duration value
    // This doesn't need to be updated every second, but had issues with setting-on-mount
    widget.current.getDuration(
      (duration: number) => duration && setDuration(duration)
    );
  };

  useIntervalRunner(updatePosition, UPDATE_POSITION_FREQUENCY);

  const play = () =>
    widget.current && widget.current.play() && setPlaying(true);
  const pause = () =>
    widget.current && widget.current.pause() && setPlaying(false);

  const togglePlay = () => {
    try {
      if (!widget.current) throw new Error("No player!");

      playing ? pause() : play();
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = (options: {
    direction: "forward" | "backward";
    amountMs?: number;
  }) => {
    const { direction, amountMs = 30 * 1000 } = options;
    try {
      if (!widget.current) throw new Error("No player!");

      if (direction === "forward") {
        widget.current.seekTo(position + amountMs);
      } else if (direction === "backward") {
        widget.current.seekTo(position - amountMs);
      }

      updatePosition();
    } catch (error) {
      console.error(error);
    }
  };

  const skipForward = (amountMs = 30 * 1000) =>
    navigate({ direction: "forward", amountMs });
  const skipBack = (amountMs = 30 * 1000) =>
    navigate({ direction: "backward", amountMs });

  return {
    playerState: {
      playing,
      position,
      duration,
    },
    togglePlay,
    play,
    pause,
    navigate,
    skipBack,
    skipForward,
  };
};

const hideIframe: React.HTMLAttributes<HTMLIFrameElement>["style"] = {
  display: "none",
  cursor: "none",
  pointerEvents: "none",
  position: "absolute",
  bottom: "-100vh",
  left: "-100vh",
};

type Props = React.HTMLAttributes<HTMLIFrameElement> & {
  id: string;
  link: string;
  autoplay?: boolean;
};

export const HiddenSoundCloudPlayer = ({
  id,
  link,
  autoplay = false,
  ...props
}: Props) => {
  return (
    <iframe
      id={id}
      title="Soundcloud Player"
      width="300"
      height="300"
      scrolling="no"
      allow={(autoplay && "autoplay") || undefined}
      src={`${buildScSrc(link)}&auto_play=${autoplay}${extraScUrlConfig}`}
      style={hideIframe}
      {...props}
    ></iframe>
  );
};

const buildScSrc = (link: string) =>
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(link)}`;

const extraScUrlConfig =
  "&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false";
