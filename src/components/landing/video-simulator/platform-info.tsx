"use client";

import React from "react";
import type { SocialPlatform, PlatformInfoData } from "./types";
import {
  Instagram,
  Monitor,
  Maximize2,
  FileText,
  HardDrive,
  Zap,
} from "lucide-react";
import { TiktokIcon } from "./icons/tiktok-icon";

const platformDetails: PlatformInfoData = {
  instagram: {
    name: "Instagram Reels",
    icon: <Instagram className="w-8 h-8" />,
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
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
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
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.065.033c6.259 0 6.386 6.218 6.386 6.218 0 2.096.881 3.325 2.237 3.325 1.356 0 2.236-1.229 2.236-3.325 0-6.342-5.045-9.251-10.859-9.251C5.045-2.44 0 .658 0 6.576c0 2.096.88 3.325 2.236 3.325 1.356 0 2.237-1.229 2.237-3.325 0 0 .127-6.218 6.386-6.218zm8.534 10.777h.005c.92 0 1.667.779 1.667 1.738 0 .958-.746 1.737-1.667 1.737-.92 0-1.667-.779-1.667-1.737 0-.959.746-1.738 1.667-1.738zM1.733 21.286c-.92 0-1.667-.779-1.667-1.737 0-.958.746-1.737 1.667-1.737.92 0 1.667.779 1.667 1.737 0 .958-.746 1.737-1.667 1.737z" />
      </svg>
    ),
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
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.627l-5.1-6.694-5.867 6.694h-3.306l7.73-8.835L2.564 2.25h6.794l4.6 6.088 5.313-6.088zM17.002 18.807h1.791L5.97 3.556H4.05l12.952 15.251z" />
      </svg>
    ),
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
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
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
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    ),
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
          icon={<Monitor className="w-5 h-5" />}
          title="Interface Type"
          value={details.interfaceType}
        />
        <DetailItem
          icon={<Maximize2 className="w-5 h-5" />}
          title="Typical Resolution"
          value={details.resolution}
        />
        <DetailItem
          icon={<Zap className="w-5 h-5" />}
          title="Aspect Ratio"
          value={details.aspectRatio}
        />
        <DetailItem
          icon={<FileText className="w-5 h-5" />}
          title="Formats"
          value={details.formats}
        />
        <DetailItem
          icon={<HardDrive className="w-5 h-5" />}
          title="Max Size / Length"
          value={details.maxSize}
        />
        <DetailItem
          icon={<Monitor className="w-5 h-5" />}
          title="Render Style"
          value={details.renderStyle}
        />
      </ul>
    </div>
  );
};
