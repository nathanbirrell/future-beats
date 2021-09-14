import { useEffect, useRef, useState } from "react";
import { useIntervalRunner } from "./useIntervalRunner";

interface Options {
  // ID of the iframe we want to control
  id: string;
  url: string;
  onFinished?: () => void;
}

const UPDATE_POSITION_FREQUENCY = 1000;

/**
 * React Hook to interface with HiddenSoundCloudPlayer (SC Widget)
 */
export const useSoundCloudPlayer = ({ id, url, onFinished }: Options) => {
  // const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  let widget = useRef<SoundCloudWidget>(undefined);

  useEffect(() => {
    widget.current = window.SC.Widget(id);

    widget.current.bind(window.SC.Widget.Events.PLAY, () => setPlaying(true));
    widget.current.bind(window.SC.Widget.Events.PAUSE, () => setPlaying(false));
    widget.current.bind(window.SC.Widget.Events.FINISH, onFinished);
  }, [id, onFinished]);

  // useEffect(() => {
  //   if (!widget || !widget.current) return;

  //   widget.current.load(url, {
  //     autoplay: playing,
  //     callback: () => setLoading(false),
  //   });
  // }, [url, widget, setLoading, playing]);

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

export const hideIframe: React.HTMLAttributes<HTMLIFrameElement>["style"] = {
  display: "none",
  cursor: "none",
  pointerEvents: "none",
  position: "absolute",
  bottom: "-100vh",
  left: "-100vh",
  border: "0px",
};

// TODO: remove me, only here for testing
export const showIframe: React.HTMLAttributes<HTMLIFrameElement>["style"] = {
  display: "block",
  position: "absolute",
  left: "0",
  bottom: "0",
  width: "360px",
  height: "260px",
};

type Props = React.HTMLAttributes<HTMLIFrameElement> & {
  id: string;
  link: string;
};

export const HiddenSoundCloudPlayer = ({ id, link, ...props }: Props) => {
  // ie https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Fsoulection%2Fsoulection-radio-show-520-andres-javier-uribe-takeover&amp;auto_play=true&amp;buying=false&amp;download=false&amp;hide_related=true&amp;sharing=false&amp;show_artwork=false&amp;show_comments=false&amp;show_playcount=false&amp;show_reposts=false&amp;show_teaser=false&amp;show_user=true
  const widgetLink = link ? buildScWidgetSrc(link) : "";

  console.debug(widgetLink);

  console.debug({ id, link, widgetLink });

  if (!widgetLink) return null;

  return (
    <iframe
      id={id}
      title="Soundcloud Player"
      width="100"
      height="100"
      scrolling="no"
      allow="autoplay"
      src={widgetLink}
      style={hideIframe}
      // style={showIframe}
      {...props}
    ></iframe>
  );
};

const buildScWidgetSrc = (link: string) =>
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(link)}`;

// const extraScUrlConfig =
//   "&hide_related=true" +
//   "&show_user=true" +
//   "&show_comments=false" +
//   "&show_reposts=false" +
//   "&show_teaser=false" +
//   "&visual=false" +
//   "&show_artwork=false" +
//   "&download=false" +
//   "&sharing=false" +
// "&show_playcount=false";
