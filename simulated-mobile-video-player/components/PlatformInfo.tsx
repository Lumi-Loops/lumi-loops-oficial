import React from "react";
import type { SocialPlatform, PlatformInfoData } from "../types";
import { InstagramIcon } from "./icons/InstagramIcon";
import { TiktokIcon } from "./icons/TiktokIcon";
import { TwitterIcon } from "./icons/TwitterIcon";
import { FacebookIcon } from "./icons/FacebookIcon";
import { LinkedInIcon } from "./icons/LinkedInIcon";
import { YoutubeIcon } from "./icons/YoutubeIcon";
import { SnapchatIcon } from "./icons/SnapchatIcon";
import { ResolutionIcon } from "./icons/ResolutionIcon";
import { AspectRatioIcon } from "./icons/AspectRatioIcon";
import { FileFormatIcon } from "./icons/FileFormatIcon";
import { FileSizeIcon } from "./icons/FileSizeIcon";
import { RenderIcon } from "./icons/RenderIcon";
import { CloseIcon } from "./icons/CloseIcon";

const platformDetails: PlatformInfoData = {
  instagram: {
    name: "Instagram Reels",
    icon: <InstagramIcon className="w-8 h-8" />,
    interfaceType: "Full-screen Reel",
    resolution: "1080 x 1920px",
    aspectRatio: "9:16",
    formats: "MP4, MOV",
    maxSize: "4GB / 90 seconds",
    renderStyle:
      "UI elements and text overlay the video content, with interactive icons on the side and bottom.",
  },
  tiktok: {
    name: "TikTok Video",
    icon: <TiktokIcon className="w-8 h-8" />,
    interfaceType: "Full-screen Video",
    resolution: "1080 x 1920px",
    aspectRatio: "9:16",
    formats: "MP4, MOV",
    maxSize: "287MB / 10 minutes",
    renderStyle:
      "Heavy UI overlay with creator info, sounds, and interactive icons dominating the screen edges.",
  },
  youtube: {
    name: "YouTube Shorts",
    icon: <YoutubeIcon className="w-8 h-8" />,
    interfaceType: "Full-screen Short",
    resolution: "1080 x 1920px",
    aspectRatio: "9:16",
    formats: "All standard video formats",
    maxSize: "128GB / 60 seconds",
    renderStyle:
      "Full-screen vertical video with a persistent right-aligned action icon column and bottom user info.",
  },
  snapchat: {
    name: "Snapchat Spotlight",
    icon: <SnapchatIcon className="w-8 h-8" />,
    interfaceType: "Full-screen Snap",
    resolution: "1080 x 1920px",
    aspectRatio: "9:16",
    formats: "MP4, MOV",
    maxSize: "1GB / 60 seconds",
    renderStyle:
      "Ephemeral, full-screen content with a minimalistic and temporary UI overlay for a clean view.",
  },
  twitter: {
    name: "X (Twitter) Video",
    icon: <TwitterIcon className="w-8 h-8" />,
    interfaceType: "Feed Post",
    resolution: "1200 x 1900px (max)",
    aspectRatio: "16:9 or 9:16",
    formats: "MP4, MOV",
    maxSize: "512MB / 140 seconds",
    renderStyle:
      "Video is embedded within a tweet card, maintaining the context of the post within a scrollable feed.",
  },
  facebook: {
    name: "Facebook Video",
    icon: <FacebookIcon className="w-8 h-8" />,
    interfaceType: "Feed Post / Reel",
    resolution: "1080 x 1920px (Reels)",
    aspectRatio: "9:16 (Reels), 4:5 (Feed)",
    formats: "MP4, MOV",
    maxSize: "4GB / 90 seconds (Reels)",
    renderStyle:
      "Can be a full-screen Reel or a video embedded in a post card, each with its own interaction patterns.",
  },
  linkedin: {
    name: "LinkedIn Video",
    icon: <LinkedInIcon className="w-8 h-8" />,
    interfaceType: "Feed Post",
    resolution: "Up to 4096 x 2304px",
    aspectRatio: "1:2.4 to 2.4:1",
    formats: "MP4, AVI, MOV",
    maxSize: "5GB / 10 minutes",
    renderStyle:
      "Video is a primary element within a professional feed post, often used for presentations or announcements.",
  },
};

const DetailItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
}> = ({ icon, title, value }) => (
  <li className="flex items-start gap-4">
    <div className="flex-shrink-0 w-6 h-6 text-primary">{icon}</div>
    <div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm">{value}</p>
    </div>
  </li>
);

export const PlatformInfo: React.FC<{ platform: SocialPlatform }> = ({
  platform,
}) => {
  const details = platformDetails[platform];

  if (!details) {
    return null;
  }

  return (
    <div className="bg-card/40 p-6 rounded-xl">
      <div className="flex items-center gap-4 pb-4 border-b border-border mb-6">
        <div className="text-foreground">{details.icon}</div>
        <h2 className="text-2xl font-bold text-foreground">{details.name}</h2>
      </div>

      <ul className="space-y-5">
        <DetailItem
          icon={<RenderIcon />}
          title="Interface Type"
          value={details.interfaceType}
        />
        <DetailItem
          icon={<ResolutionIcon />}
          title="Typical Resolution"
          value={details.resolution}
        />
        <DetailItem
          icon={<AspectRatioIcon />}
          title="Aspect Ratio"
          value={details.aspectRatio}
        />
        <DetailItem
          icon={<FileFormatIcon />}
          title="Formats"
          value={details.formats}
        />
        <DetailItem
          icon={<FileSizeIcon />}
          title="Max Size / Length"
          value={details.maxSize}
        />
        <DetailItem
          icon={<RenderIcon />}
          title="Render Style"
          value={details.renderStyle}
        />
      </ul>
    </div>
  );
};
