import { definitions } from "./types-supabase";

declare global {
  interface Window {
    SC: any;
  }
  type SoundCloudWidget = any; // TODO: loosely type me

  type Chapter = definitions["chapters"] & {
    markers: definitions["markers"][];
  };

  type Show = definitions["shows"] & {
    chapters: Chapter[];
  };
}
