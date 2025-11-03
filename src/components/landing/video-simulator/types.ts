export interface Video {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
}

export type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "twitter"
  | "facebook"
  | "linkedin"
  | "youtube"
  | "snapchat";

export interface PlatformDetails {
  name: string;
  icon: React.ReactNode;
  interfaceType: string;
  resolution: string;
  aspectRatio: string;
  formats: string;
  maxSize: string;
  renderStyle: string;
}

export type PlatformInfoData = {
  [key in SocialPlatform]?: PlatformDetails;
};
