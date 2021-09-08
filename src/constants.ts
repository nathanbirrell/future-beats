import { parseISO } from "date-fns";

/**
 * First episode is actually: "2011-01-25T00:00:00+00:00"
 * But I'm thinking let's play Soulection 137 and up
 *  it appears that's when they started adding Soundcloud links to their database :)
 */
export const FIRST_EPISODE_DATE = parseISO("2013-07-15T00:00:00+00:00");
