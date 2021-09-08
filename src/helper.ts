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
