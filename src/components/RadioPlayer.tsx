import React, { Fragment, useEffect, useMemo, useState } from "react";
import { RADIO_PLAYER_ID } from "../constants";
import {
  durationStringToMilliseconds,
  millisecondsToDuration,
} from "../helper";
import {
  useSoundCloudPlayer,
  HiddenSoundCloudPlayer,
} from "../hooks/useSoundCloudPlayer";

interface Props {
  link: string;
  show: Show;
  shuffleEpisode?: () => Promise<void>;
  loading?: boolean;
}

export const RadioPlayer = (props: Props) => {
  const { link, shuffleEpisode, loading, show } = props;

  const {
    playerState: { playing, duration, position },
    skipBack,
    skipForward,
    togglePlay,
  } = useSoundCloudPlayer({ id: RADIO_PLAYER_ID });

  // const [currentTrack, setCurrentTrack] = useState(show.title || "Soulection Radio");
  const currentTrack = useMemo(() => {
    let result = show.title || "Soulection Radio";

    show.chapters.forEach((chapter) => {
      chapter.markers.some((marker, index, allMarkers) => {
        if (!marker.timestamp) return false;

        const nextMarker = allMarkers[index + 1];

        const markerPosition = durationStringToMilliseconds(marker.timestamp);
        const nextMarkerPosition =
          nextMarker && nextMarker.timestamp
            ? durationStringToMilliseconds(nextMarker.timestamp)
            : undefined;

        // NOTE: this relies on the markers being sorted by marker.timestamp ascending
        // this will break if not..
        if (
          position > markerPosition &&
          nextMarkerPosition &&
          position < nextMarkerPosition
        ) {
          if (marker.rawTrack) {
            result = marker.rawTrack;
          } else {
            result = show.title;
          }
          return true;
        }

        return false;
      });
    });
    return result;
  }, [show, position]);

  const [continuousPlay, setContinuousPlay] = useState(true);
  const toggleContinousPlay = () => setContinuousPlay(!continuousPlay);
  // Listen to position value and play next ep on completion
  useEffect(() => {
    if (!continuousPlay) return;
    if (!position || !duration) return;
    // if (position < duration) return;
    if (position >= duration - 2000) shuffleEpisode && shuffleEpisode();
  }, [continuousPlay, position, duration, shuffleEpisode]);

  return (
    <Fragment>
      {/* TODO: abstract into RadioControls component */}
      <div className="flex-initial text-4xl mb-6">
        <button
          className="rounded-sm  px-2"
          onClick={toggleContinousPlay}
          title={`${
            continuousPlay
              ? "Switch Off Continuous Play"
              : "Switch On Continuous Play"
          }`}
        >
          {continuousPlay ? "♾" : "OFF"}
        </button>
        <button
          className="rounded-sm  px-2"
          onClick={() => skipBack()}
          // Jump a bit quicker
          onDoubleClick={() => skipBack(60 * 1000)}
          title="Rewind 30sec"
        >
          {"⏪"}
        </button>
        <button
          className="px-2"
          onClick={togglePlay}
          title={playing ? "Pause" : "Play"}
        >
          {playing ? "⏸" : "▶️"}
        </button>
        <button
          className="rounded-sm  px-2"
          onClick={() => skipForward()}
          // Jump a bit quicker
          onDoubleClick={() => skipForward(60 * 1000)}
          title="Forward 30sec"
        >
          {"⏩"}
        </button>
        {shuffleEpisode && (
          <button
            className="rounded-sm  px-2"
            onClick={shuffleEpisode}
            disabled={loading}
          >
            {"🔀"}
          </button>
        )}
      </div>

      <div className="mb-6 text-sm">
        <p
          title={`${millisecondsToDuration(
            duration - position
          )} remaining (${Math.round((position / duration) * 100)}%)`}
        >
          {millisecondsToDuration(position)}
          {duration && ` of ${millisecondsToDuration(duration)}`}
        </p>
      </div>

      <div className="text-sm">
        <p className="text-xs uppercase tracking-wider opacity-70">
          Now Playing:
        </p>
        <p>{currentTrack}</p>
      </div>

      <HiddenSoundCloudPlayer
        id={RADIO_PLAYER_ID}
        link={link}
        // to keep it playing between skips, we leverage playerState.playing and feed it to `autoplay` prop below
        // TODO: look into using the widget.load() when skipping tracks instead of unmount/remount drama
        // https://developers.soundcloud.com/docs/api/html5-widget#methods
        autoplay={playing}
      />
    </Fragment>
  );
};
