import { useCallback, useEffect, useState } from "react";

import { definitions } from "../types-supabase";
import { supabase } from "../supabaseClient";
import { PostgrestResponse } from "@supabase/postgrest-js";
import { FIRST_EPISODE_DATE } from "../constants";
import { generateRandomDate } from "../helper";

type Options = {
  select?: string;
  limit?: number;
};

const defaultOptions = {
  select:
    "id,title,slug,artwork,content,tags,published_at,links,chapters(title,markers(id))",
  limit: 50,
};

type Result = {
  data: PostgrestResponse<definitions["shows"]>["data"] | undefined;
  error: PostgrestResponse<definitions["shows"]>["error"] | undefined;
};

type HookReturn = Result & {
  loading: boolean;
};

export const useShowsList = (options: Options = {}): HookReturn => {
  const { select, limit } = Object.assign(defaultOptions, options);
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<Result>({
    data: undefined,
    error: undefined,
  });

  const fetchShows = useCallback(async () => {
    const result = await supabase
      .from<definitions["shows"]>("shows")
      .select(select)
      .limit(limit)
      .filter("profile", "eq", "QiEFFErt688")
      .filter("state", "eq", "published")
      .filter("tags", "ov", "{5,10,11,15}")
      .order("published_at", { ascending: false, nullsFirst: false });

    setResult(result);

    setLoading(false);
  }, [limit, select]);

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  return {
    ...result,
    loading,
  };
};

export const useRandomShow = (options: Options = {}): HookReturn => {
  const { select } = Object.assign(defaultOptions, options);
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<Result>({
    data: undefined,
    error: undefined,
  });

  /**
   * To randomly select, all we do is, choose a random date between Episode 137 and now
   */
  const fetchShows = useCallback(async () => {
    const randomDate = generateRandomDate(FIRST_EPISODE_DATE, new Date());

    const baseQuery = () =>
      supabase
        .from<definitions["shows"]>("shows")
        .select(select)
        .limit(1)
        .filter("profile", "eq", "QiEFFErt688")
        .filter("state", "eq", "published")
        .filter("tags", "ov", "{5,10,11,15}");

    const result = await baseQuery()
      .order("published_at", {
        ascending: true,
        nullsFirst: false,
      })
      .filter("published_at", "gte", randomDate.toISOString());

    // Flip the logic if that fails
    if (!result.data || result.data?.length < 1)
      await baseQuery()
        .order("published_at", { ascending: false, nullsFirst: false })
        .filter("published_at", "lte", randomDate.toISOString());

    if (!result.data || result.data?.length < 1)
      throw new Error("Could not find an episode to play!");

    setResult(result);

    setLoading(false);
  }, [select]);

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  return {
    ...result,
    loading,
  };
};
