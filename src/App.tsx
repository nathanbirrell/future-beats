import React from "react";

import { imageLink } from "./helper";
import { useRandomShow } from "./hooks/useShows";

const App = () => {
  const query = useRandomShow();

  const loading = query.loading;
  const shows = query.data || [];

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
        </div>
      ))}

      {/* <audio id="audio" preload="none" ref="audio" src={streamUrl} /> */}
    </div>
  );
};

export default App;

// .select(`
//       links,
//       title,
//       artwork,
//       slug,
//       duration,
//       chapters(
//         title,
//         artwork,
//         markers(
//           id,
//           timestamp,
//           rawTrack,
//           track(
//             id,
//             title,
//             path,
//             artwork,
//             artist(
//               id,
//               title
//             )
//           )
//         )
//       )
//     `)
