import React, { useEffect, useState } from "react";

import { definitions } from "./types-supabase";
import { imageLink } from "./helper";
import { supabase } from "./supabaseClient";

const useShows = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<definitions["shows"][]>([]);

  const fetchShows = async () => {
    const result = await supabase
      .from<definitions["shows"]>("shows")
      .select(
        "id,title,slug,artwork,content,tags,published_at,links,chapters(title,markers(id))"
      )
      .filter("profile", "eq", "QiEFFErt688")
      .filter("state", "eq", "published")
      .filter("tags", "ov", "{5,10,11,15}")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(50);

    setResult(result.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchShows();
  }, []);

  return {
    shows: result,
    loading,
  };
};

const App = () => {
  const { shows, loading } = useShows();

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
