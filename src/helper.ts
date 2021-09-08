import { addHours, getMinutes, getHours, getSeconds } from "date-fns";

const BASE_URL = "https://soulection.com";
const EPISODE_LINK = "tracklists";
const IMAGES_BASE_URL = "https://dy2wnrva.twic.pics";

export const soulectionWebsiteLink = (relativeUrl: string) =>
  `${BASE_URL}/${relativeUrl}`;
export const soulectionEpisodeLink = (slug: string) =>
  `${BASE_URL}/${EPISODE_LINK}/${slug}`;
export const imageLink = (image: string) => `${IMAGES_BASE_URL}${image}`;

export function generateRandomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

export const convertToDuration = (milliseconds: number) => {
  const normalizeTime = (time: string): string =>
    time.length === 1 ? `0${time}` : time;

  const MINUTES_IN_HOUR = 60;

  const date = new Date(milliseconds);
  const timezoneDiff = date.getTimezoneOffset() / MINUTES_IN_HOUR;
  const dateWithoutTimezoneDiff = addHours(date, timezoneDiff);

  const hours = normalizeTime(String(getHours(dateWithoutTimezoneDiff)));
  const minutes = normalizeTime(String(getMinutes(dateWithoutTimezoneDiff)));
  const seconds = normalizeTime(String(getSeconds(dateWithoutTimezoneDiff)));

  const hoursOutput = hours !== "00" ? `${hours}:` : "";

  return `${hoursOutput}${minutes}:${seconds}`;
};
