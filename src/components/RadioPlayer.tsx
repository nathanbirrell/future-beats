import React, { Fragment, useMemo, useState } from "react";
import { useKey, useKeyPressEvent } from "react-use";
import {
  durationStringToMilliseconds,
  millisecondsToDuration,
  preventScroll,
} from "../helper";
import { useSoundCloudPlayer } from "../hooks/useSoundCloudPlayer";
import { RadioPlayerControls } from "./RadioPlayerControls";

interface Props {
  link: string;
  show: Show;
  shuffleEpisode?: () => Promise<void>;
  loading?: boolean;
}

export const RadioPlayer = (props: Props) => {
  const { loading: showLoading, show } = props;

  const {
    playerState: { playing, duration, position, loading: playerloading },
    skipBack,
    skipForward,
    play,
    pause,
    nextTrack,
  } = useSoundCloudPlayer();

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

  const togglePlay = () => (playing ? pause() : play());

  useKeyPressEvent("ArrowRight", () => skipForward());
  useKeyPressEvent("ArrowLeft", () => skipBack());
  useKeyPressEvent("]", () => skipForward(10 * 60 * 1000));
  useKeyPressEvent("[", () => skipBack(10 * 60 * 1000));
  useKeyPressEvent("ArrowUp", nextTrack);
  useKeyPressEvent(" ", togglePlay);
  useKey(" ", preventScroll);

  const loading = playerloading || showLoading;

  return (
    <Fragment>
      {loading && "Loading..."}
      {!loading && (
        <Fragment>
          <RadioPlayerControls
            playing={playing}
            continuousPlaying={continuousPlay}
            onContinuousPlayClick={toggleContinousPlay}
            onPlayClick={togglePlay}
            onRewindClick={() => skipBack()}
            onFastForwardClick={() => skipForward()}
            onShuffleClick={nextTrack}
            loading={loading}
          />

          <div className="mb-6 text-sm">
            <p
              title={`${millisecondsToDuration(
                duration - position
              )} remaining (${Math.round((position / duration) * 100)}%)`}
            >
              {millisecondsToDuration(position)}
              {duration > 0 && ` of ${millisecondsToDuration(duration)}`}
            </p>
          </div>

          <div className="text-sm">
            <p className="text-xs uppercase tracking-wider opacity-70">
              Now Playing:
            </p>
            <p>{currentTrack}</p>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};
