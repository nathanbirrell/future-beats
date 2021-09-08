import { parseISO } from "date-fns";

/**
 * First episode is actually: "2011-01-25T00:00:00+00:00"
 * But I'm thinking let's play Soulection 137 and up
 *  it appears that's when they started adding Soundcloud links to their database :)
 */
export const FIRST_EPISODE_DATE = parseISO("2013-07-15T00:00:00+00:00");

export const RADIO_PLAYER_ID = "radio-player";

// export const TIME = {
//   ONE_SECOND: 1000,
//   ONE_MINUTE: 1000 * 60,
//   ONE_HOUR: 1000 * 60 * 60,
// };
