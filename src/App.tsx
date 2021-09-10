import React from "react";
import { RadioPlayer } from "./components/RadioPlayer";

import { imageLink } from "./helper";
import { useRandomShow } from "./hooks/useShows";

const App = () => {
  const query = useRandomShow();

  const loading = query.loading;
  const [show] = React.useMemo(() => query.data || [], [query]);

  console.log({ show });

  const imageSrc = show?.artwork && imageLink(show.artwork);

  return (
    <div className="App">
      <header className="App-header">Soulection 24/7</header>

      {!show && loading && "Loading..."}

      {show && (
        <div key={show.id}>
          {show?.artwork && (
            <img src={imageSrc} alt={show.title} width="320px" />
          )}
          <h4>{show.title}</h4>

          <p>{imageSrc}</p>

          <p>{show.links && show.links.appleMusic}</p>
          <p>{show.links && show.links.soundcloud}</p>
          <p>{show.published_at}</p>

          {show.links?.soundcloud && (
            <RadioPlayer
              link={show.links.soundcloud}
              shuffleEpisode={query.shuffleEpisode}
              loading={query.loading}
              show={show as Show}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
