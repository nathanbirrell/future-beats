import React, { Fragment, useMemo } from "react";
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

  return (
    <Fragment>
      <div>
        Now Playing:
        {currentTrack}
      </div>
      <br />
      <div>
        {millisecondsToDuration(position)} of {millisecondsToDuration(duration)}{" "}
        (
        {duration && (
          <Fragment>{Math.round((position / duration) * 100)}%</Fragment>
        )}
        )
      </div>

      <button onClick={skipBack}>Back 30sec</button>
      <button onClick={togglePlay}>{playing ? "Pause" : "Play"}</button>
      <button onClick={skipForward}>Forward 30sec</button>
      {shuffleEpisode && (
        <button onClick={shuffleEpisode} disabled={loading}>
          Shuffle
        </button>
      )}

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
