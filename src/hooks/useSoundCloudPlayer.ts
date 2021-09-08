import { useEffect, useRef, useState } from "react";

interface Options {
  // ID of the iframe we want to control
  id: string;
}

const UPDATE_POSITION_FREQUENCY = 1000;

export const useSoundCloudPlayer = ({ id }: Options) => {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  let widget: any = useRef(undefined);

  useEffect(() => {
    widget.current = window.SC.Widget(id);
  }, [id]);

  useEffect(() => {
    if (!widget.current) return;

    widget.current.getDuration((duration: number) => setDuration(duration));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widget.current]);

  const updatePosition = () => {
    if (!widget.current) return;

    widget.current.getPosition((newPosition: number) =>
      setPosition(newPosition)
    );
  };

  useEffect(() => {
    const interval = setInterval(updatePosition, UPDATE_POSITION_FREQUENCY);

    return () => {
      clearInterval(interval);
    };
  }, []);

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

      console.log({ position, amountMs });

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

  const skipForward = () => navigate({ direction: "forward" });
  const skipBack = () => navigate({ direction: "backward" });

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
