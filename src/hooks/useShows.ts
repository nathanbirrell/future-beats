import { useCallback, useEffect, useState } from "react";
import { PostgrestResponse } from "@supabase/postgrest-js";

import { definitions } from "../types-supabase";
import { supabase } from "../supabaseClient";
import { FIRST_EPISODE_DATE } from "../constants";
import { generateRandomDate } from "../helper";

type Options = {
  select?: string;
  limit?: number;
};

const SELECT_QUERY = `
  links,
  title,
  artwork,
  slug,
  duration,
  published_at,
  chapters(
    title,
    artwork,
    position,

    markers(
      id,
      timestamp,
      rawTrack,
      position,
      chapter,
      track(
        id,
        title,
        path,
        artwork,
        artist(
          id,
          title
        )
      )
    )
  )
`;
const defaultOptions = {
  select: SELECT_QUERY,
  limit: 1,
};

type Result = {
  data: PostgrestResponse<definitions["shows"]>["data"] | undefined;
  error: PostgrestResponse<definitions["shows"]>["error"] | undefined;
};

type HookReturn = Result & {
  loading: boolean;
  shuffleEpisode: () => Promise<void>;
};

export const useRandomShow = (): HookReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<Result>({
    data: undefined,
    error: undefined,
  });

  const fetchShow = async () => {
    setLoading(true);

    const result = await fetchRandomShow();

    setResult(result);

    setLoading(false);
  };

  useEffect(() => {
    fetchShow();
  }, []);

  return {
    ...result,
    loading,
    shuffleEpisode: fetchShow,
  };
};

/**
 * To randomly select, all we do is, choose a random date between Episode 137 and now
 */
const fetchRandomShow = async (options: Options = {}) => {
  const { select } = Object.assign(defaultOptions, options);

  const randomDate = generateRandomDate(FIRST_EPISODE_DATE, new Date());

  const baseQuery = () =>
    supabase
      // <"shows", definitions["shows"]>
      .from("shows")
      .select(select)
      .limit(1)
      // NOTE: using ep 339 from Melbourne For testing
      // .textSearch("title", "339")
      .filter("profile", "eq", "QiEFFErt688")
      .filter("state", "eq", "published")
      .filter("tags", "ov", "{5,10,11,15}") as unknown as any;

  let result: PostgrestResponse<definitions["shows"]> = await baseQuery()
    .order("published_at", {
      ascending: true,
      nullsFirst: false,
    })
    .filter("published_at", "gte", randomDate.toISOString());

  console.log({ asdf: !result.data || result.data?.length < 1, result });

  // Flip the logic if that fails
  if (!result.data || result.data?.length < 1)
    result = await baseQuery()
      .order("published_at", { ascending: false, nullsFirst: false })
      .filter("published_at", "lte", randomDate.toISOString());

  console.log({ result });

  if (!result.data || result.data?.length < 1) {
    console.error({ result });
    throw new Error("Could not find an episode to play!");
  }

  return result;
};
