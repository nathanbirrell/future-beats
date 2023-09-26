import {
  useCallback,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";

// TODO: handle SC.Widget.Events.ERROR

/**
 * React Hook to interface with PlayerIframe (SC Widget)
 */
export const useSoundCloudPlayer = () =>
  useContext(SoundCloudPlayerContext) as ContextShape;

interface Options {
  // ID of the iframe we want to control
  id: string;
  url?: string;
  nextTrackCallback?: () => Promise<void>;
  children: ReactNode;
}

type ContextShape = ReturnType<typeof useSoundCloudPlayerInternal>;

const SoundCloudPlayerContext = createContext<ContextShape | undefined>(
  undefined
);

export const SoundCloudPlayerProvider = ({
  children,
  id,
  url,
  nextTrackCallback,
}: Options) => {
  const playerState = useSoundCloudPlayerInternal({
    id,
    url,
    nextTrackCallback,
  });

  return (
    <SoundCloudPlayerContext.Provider value={playerState}>
      {children}

      {url && <PlayerIframe id={id} link={url} />}
    </SoundCloudPlayerContext.Provider>
  );
};

export const useSoundCloudPlayerInternal = ({
  id,
  nextTrackCallback,
}: Omit<Options, "children">) => {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  let widget = useRef<SoundCloudWidget>(undefined);

  console.log({ id });

  const play = useCallback(
    () => widget.current && widget.current.play(),
    [widget]
  );
  const pause = useCallback(
    () => widget.current && widget.current.pause(),
    [widget]
  );

  const togglePlay = useCallback(() => {
    try {
      if (!widget.current) throw new Error("No player!");

      playing ? pause() : play();
    } catch (error) {
      console.error(error);
    }
  }, [widget, playing, pause, play]);

  const nextTrack = useCallback(async () => {
    if (!nextTrackCallback) return;

    pause();
    await nextTrackCallback();
    play();
  }, [play, pause, nextTrackCallback]);

  useEffect(() => {
    widget.current = window.SC.Widget(id);
  }, [id]);

  useEffect(() => {
    if (!widget.current) return;

    widget.current.bind(window.SC.Widget.Events.READY, () => setLoading(false));
    widget.current.bind(window.SC.Widget.Events.PLAY, () => setPlaying(true));
    widget.current.bind(window.SC.Widget.Events.PAUSE, () => setPlaying(false));

    return () => {
      widget.current.unbind(window.SC.Widget.Events.READY);
      widget.current.unbind(window.SC.Widget.Events.PLAY);
      widget.current.unbind(window.SC.Widget.Events.PAUSE);
    };
  }, [widget]);

  useEffect(() => {
    if (!widget.current) return;

    widget.current.bind(window.SC.Widget.Events.FINISH, nextTrackCallback);

    return () => {
      widget.current.unbind(window.SC.Widget.Events.FINISH);
    };
  }, [widget, nextTrackCallback]);

  const updatePosition = useCallback(() => {
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
  }, [widget]);

  useEffect(() => {
    if (!widget.current) return;

    widget.current.bind(window.SC.Widget.Events.SEEK, updatePosition);
    widget.current.bind(window.SC.Widget.Events.PLAY_PROGRESS, updatePosition);

    return () => {
      widget.current.unbind(window.SC.Widget.Events.SEEK);
      widget.current.unbind(window.SC.Widget.Events.PLAY_PROGRESS);
    };
  }, [widget, updatePosition]);

  // useEffect(() => {
  //   if (loading) return;

  //   widget.current.bind(window.SC.Widget.Events.READY, () => {
  //     // After initial load...
  //     console.log("// After initial load...");
  //     play();
  //   });
  // }, [widget, loading, play]);

  // useIntervalRunner(updatePosition, UPDATE_POSITION_FREQUENCY);

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
      loading,
    },
    togglePlay,
    play,
    pause,
    navigate,
    skipBack,
    skipForward,
    nextTrack,
  };
};

export const hideIframe: React.HTMLAttributes<HTMLIFrameElement>["style"] = {
  visibility: "hidden",
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

type iFrameProps = React.HTMLAttributes<HTMLIFrameElement> & {
  id: string;
  link: string;
};

const PlayerIframe = ({ id, link, ...props }: iFrameProps) => {
  // ie https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Fsoulection%2Fsoulection-radio-show-520-andres-javier-uribe-takeover&amp;auto_play=true&amp;buying=false&amp;download=false&amp;hide_related=true&amp;sharing=false&amp;show_artwork=false&amp;show_comments=false&amp;show_playcount=false&amp;show_reposts=false&amp;show_teaser=false&amp;show_user=true
  const widgetLink = link ? buildScWidgetSrc(link) : "";

  console.log({ widgetLink });

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
      // style={hideIframe}
      // style={showIframe}
      {...props}
    ></iframe>
  );
};
const buildScWidgetSrc = (link: string) =>
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(link)}`;
