import React, { Fragment, useEffect, useState } from "react";
import { ColourfulBackground } from "./components/ColourfulBackground";
import { Loading } from "./components/Loading";
import { RadioPlayer } from "./components/RadioPlayer";
import { Toggle } from "./components/Toggle";
import { RADIO_PLAYER_ID } from "./constants";

import { getShowLinks, imageLink, relativeDateIfRecent } from "./helper";
import { useShow } from "./hooks/useShows";
import { SoundCloudPlayerProvider } from "./hooks/useSoundCloudPlayer";
import { ReactComponent as Logo } from "./icons/logo.svg";
import fallbackArt from "./images/fallback-art.webp";

const BASE_TITLE = "Future Beats ~ Soulection Radio Player";

const App = () => {
  const showNumber = window.location.pathname.replace("/", "");
  const query = useShow({ show: showNumber || undefined });

  const loading = query.loading;
  const shows = React.useMemo(() => query.data?.slice() || [], [query]);
  const [show] = shows;
  console.log({ show });

  const [moodMode, setMoodMode] = useState(false);

  const imageSrc = show?.artwork ? imageLink(show.artwork) : fallbackArt;

  const links = getShowLinks(show);
  const soundcloudUrl = show?.links?.soundcloud || "";

  useEffect(() => {
    if (show) document.title = `${show.title} | ${BASE_TITLE}`;
  }, [show]);

  useEffect(() => {
    if (!show && !loading && showNumber) window.location.assign("/");
  }, [show, loading, showNumber]);

  // TODO: add ErrorBoundary
  return (
    <div id="future-beats-wrapper">
      <div className="container max-w-md mx-auto flex justify-center justify-items-center text-center">
        <div className="w-full flex flex-col justify-between xl:h-screen">
          <header className="my-4 lg:my-8 flex justify-center">
            {!loading && <Logo className="text-xl" />}

            {loading && <Loading className="text-xl" />}
          </header>

          <main className="mb-auto">
            {show && (
              <SoundCloudPlayerProvider
                id={RADIO_PLAYER_ID}
                url={soundcloudUrl}
                nextTrackCallback={query.shuffleEpisode}
              >
                <Fragment>
                  <div className="mb-4 ">
                    <div className="cover-art pointer-events-none">
                      {imageSrc && (
                        <img
                          className="w-full h-full object-cover rounded-md filter drop-shadow-md"
                          src={imageSrc}
                          alt={show.title}
                          title={show.title}
                          width="320px"
                        />
                      )}
                    </div>
                    <h1 className="mt-2 text-xs opacity-80">
                      {show.title} —{" "}
                      {show.published_at &&
                        relativeDateIfRecent(show.published_at)}
                    </h1>
                  </div>

                  <div className="container mb-6">
                    {show.links?.soundcloud && (
                      <RadioPlayer
                        link={show.links.soundcloud}
                        shuffleEpisode={query.shuffleEpisode}
                        loading={query.loading}
                        show={show as Show}
                      />
                    )}
                  </div>

                  <div className="flex flex-col text-sm">
                    <span>Show Links:</span>
                    <div className="block">
                      {links.map(({ link, label }, index) => (
                        <Fragment key={label}>
                          <a
                            href={link}
                            title={`View Show ${show.slug} on ${label}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {label}
                          </a>
                          {index + 1 < links.length && (
                            <span className="mx-1"> | </span>
                          )}
                        </Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center text-sm">
                    <Toggle
                      id="bling-mode"
                      checked={moodMode}
                      onClick={() => setMoodMode(moodMode ? false : true)}
                    >
                      Mood
                    </Toggle>
                  </div>
                </Fragment>
              </SoundCloudPlayerProvider>
            )}

            {!show && !loading && (
              <div className="my-4 lg:mt-12">Oh no, something went wrong.</div>
            )}
          </main>

          <footer className="pt-8 pb-4">
            <p className="text-xs opacity-90">
              <span>
                Made with ☕️ in Melbourne, Australia.{" "}
                <a
                  href={process.env.REACT_APP_SUPPORT_LINK}
                  title="Buy us a coffee"
                  target="_blank"
                  rel="noreferrer"
                >
                  Support this app
                </a>
                .{" "}
                <a
                  href={process.env.REACT_APP_GITHUB_PROJECT}
                  title="Future Beats Project on Github"
                  target="_blank"
                  rel="noreferrer"
                >
                  Contribute on Github
                </a>
              </span>
              . <br />
              This app is unofficial. All rights to Soulection LLC.
            </p>
          </footer>
        </div>
      </div>
      {moodMode && imageSrc && <ColourfulBackground src={imageSrc} />}
    </div>
  );
};

export default App;
