import React from "react";
import { SoundCloudPlayer } from "./components/SoundCloudPlayer";

import { imageLink } from "./helper";
import { useRandomShow } from "./hooks/useShows";

const App = () => {
  const query = useRandomShow();

  const loading = query.loading;
  const shows = React.useMemo(() => query.data || [], [query]);

  console.log({ shows });

  return (
    <div className="App">
      <header className="App-header">Soulection 24/7</header>

      {loading && "Loading..."}

      {shows.map((show) => (
        <div key={show.id}>
          {show.artwork && (
            <img
              src={imageLink(`/${show.artwork}`)}
              alt={show.title}
              width="320px"
            />
          )}
          <h4>{show.title}</h4>

          <p>{show.links && show.links.appleMusic}</p>
          <p>{show.links && show.links.soundcloud}</p>
          <p>{show.published_at}</p>

          {show.links?.soundcloud && (
            <SoundCloudPlayer link={show.links.soundcloud} />
          )}
        </div>
      ))}

      {/* <audio id="audio" preload="none" ref="audio" src={streamUrl} /> */}
    </div>
  );
};

export default App;
