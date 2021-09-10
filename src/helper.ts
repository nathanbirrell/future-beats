import { addHours, getMinutes, getHours, getSeconds } from "date-fns";

const BASE_URL = "https://soulection.com";
const EPISODE_LINK = "tracklists";
const IMAGES_BASE_URL = "https://dy2wnrva.twic.pics";

export const soulectionWebsiteLink = (relativeUrl: string) =>
  `${BASE_URL}/${relativeUrl}`;
export const soulectionEpisodeLink = (slug: string) =>
  `${BASE_URL}/${EPISODE_LINK}/${slug}`;
export const imageLink = (image: string) =>
  // NOTE: some episodes have leading slash, others don't!
  `${IMAGES_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;

const linkLabels = {
  soundcloud: "Soundcloud",
  appleMusic: "Apple Music",
  soulection: "Soulection",
};
export const getShowLinks = (show: Omit<Show, "chapters"> | undefined) => {
  if (!show) return [];

  const showLink = {
    label: linkLabels["soulection"],
    link: soulectionEpisodeLink(show.slug),
  };

  if (!show.links) return [showLink];

  return [
    showLink,
    ...Object.entries(show.links).map(([key, link]) => {
      return {
        label: linkLabels[key as keyof Show["links"]],
        link,
      };
    }),
  ];
};

export function generateRandomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;
const MILLISECONDS_IN_SECOND = 1000;

/**
 * Milliseconds to duration string format "04:20:13"
 */
// Sauce: https://newbedev.com/format-a-duration-from-seconds-using-date-fns
export const millisecondsToDuration = (milliseconds: number) => {
  const normalizeTime = (time: string): string =>
    time.length === 1 ? `0${time}` : time;

  const date = new Date(milliseconds);
  const timezoneDiff = date.getTimezoneOffset() / MINUTES_IN_HOUR;
  const dateWithoutTimezoneDiff = addHours(date, timezoneDiff);

  const hours = normalizeTime(String(getHours(dateWithoutTimezoneDiff)));
  const minutes = normalizeTime(String(getMinutes(dateWithoutTimezoneDiff)));
  const seconds = normalizeTime(String(getSeconds(dateWithoutTimezoneDiff)));

  const hoursOutput = hours !== "00" ? `${hours}:` : "";

  return `${hoursOutput}${minutes}:${seconds}`;
};

/**
 * 04:20:13 to complete time in millsecs
 */
export const durationStringToMilliseconds = (durationString: string) => {
  const bits = durationString.split(":");

  if (bits.length === 2) bits.unshift("00"); // add zero hours if missing

  if (!durationString || bits.length < 3)
    throw new Error(
      `Invalid format: duration should look like "04:20:13", yours is ${durationString}`
    );

  const [hours, minutes, seconds] = bits.map((string) => parseInt(string));

  let duration = 0;

  duration =
    hours * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;
  duration += minutes * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;
  duration += seconds * MILLISECONDS_IN_SECOND;

  return duration;
};
