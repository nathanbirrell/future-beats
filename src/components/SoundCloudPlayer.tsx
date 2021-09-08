import React, { Fragment } from "react";
import { RADIO_PLAYER_ID } from "../constants";
import { convertToDuration } from "../helper";
import { useSoundCloudPlayer } from "../hooks/useSoundCloudPlayer";

interface Props {
  link: string;
}

export const SoundCloudPlayer = (props: Props) => {
  const { link } = props;

  const {
    playerState: { playing, duration, position },
    skipBack,
    skipForward,
    togglePlay,
  } = useSoundCloudPlayer({ id: RADIO_PLAYER_ID });

  return (
    <Fragment>
      <div>
        {convertToDuration(position)} of {convertToDuration(duration)} (
        {Math.round((position / duration) * 100)}%)
      </div>

      <button onClick={skipBack}>Back 30sec</button>
      <button onClick={togglePlay}>{playing ? "Pause" : "Play"}</button>
      <button onClick={skipForward}>Forward 30sec</button>

      <iframe
        id={RADIO_PLAYER_ID}
        title="Soundcloud Player"
        width="100%"
        height="300"
        scrolling="no"
        // frameborder="no"
        // allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
          link
        )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
        style={{
          cursor: "none",
          pointerEvents: "none",
          position: "absolute",
          bottom: "-100vh",
          left: "-100vh",
          // @ts-ignore
          "--tw-scale-x": "0",
          "--tw-scale-y": "0",
          transform: "var(--tw-transform)",
        }}
      ></iframe>
    </Fragment>
  );
};
