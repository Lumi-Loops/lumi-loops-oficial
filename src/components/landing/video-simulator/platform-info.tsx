"use client";

import React from "react";
import type { PlatformInfoData, SocialPlatform } from "./types";
import { FileText, HardDrive, Maximize2, Monitor } from "lucide-react";

const platformDetails: PlatformInfoData = {
  instagram: {
    name: "Instagram Reels",
    icon: null,
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
    icon: null,
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
    icon: null,
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
    icon: null,
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
    icon: null,
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
    icon: null,
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
    icon: null,
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
  color?: string;
}> = ({ icon, title, value }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 text-primary">
      {icon}
      <span className="text-xs font-semibold">{title}</span>
    </div>
    <p className="text-sm font-medium text-foreground">{value}</p>
  </div>
);

export const PlatformInfo: React.FC<{ platform: SocialPlatform }> = ({
  platform,
}) => {
  const details = platformDetails[platform];

  if (!details) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header with platform name */}
      <div className="pb-4 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground">{details.name}</h2>
      </div>

      {/* Title for specifications */}
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Video Specifications
      </h3>

      {/* Grid layout for details - 2 columns */}
      <div className="grid grid-cols-2 gap-8">
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
          icon={<FileText className="w-5 h-5" />}
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
      </div>
    </div>
  );
};
