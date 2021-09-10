import React, { Fragment } from "react";
import { RadioPlayer } from "./components/RadioPlayer";

import { getShowLinks, imageLink } from "./helper";
import { useRandomShow } from "./hooks/useShows";

const App = () => {
  const query = useRandomShow();

  const loading = query.loading;
  const [show] = React.useMemo(() => query.data || [], [query]);

  console.log({ show });

  const imageSrc = show?.artwork
    ? imageLink(show.artwork)
    : // FIXME: find a nice fallback album art
      "https://placehold.it/400x400";

  const links = getShowLinks(show);

  return (
    <div className="container max-w-md mx-auto flex justify-center justify-items-center text-center">
      <div className="w-full">
        <header className="my-4 lg:my-12">Soulection 24/7</header>

        {!show && loading && "Loading..."}

        {show && (
          <Fragment>
            <div className="my-4 lg:my-12">
              {show?.artwork && (
                <img
                  className="inline-block"
                  src={imageSrc}
                  alt={show.title}
                  title={show.title}
                  width="320px"
                />
              )}
              <h1 className="mt-2 text-xs text-gray-700">{show.title}</h1>
            </div>

            <p>{show.published_at}</p>

            <div className="container mb-12">
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
              <span>Episode Links:</span>
              <div className="block">
                {links.map(({ link, label }, index) => (
                  <Fragment>
                    <a
                      href={link}
                      title={`View Episode on ${label}`}
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
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default App;
