"use client";

import React from "react";
import type { PlatformInfoData, SocialPlatform } from "./types";
import { FileText, HardDrive, Maximize2, Monitor } from "lucide-react";

const platformColors: Record<SocialPlatform, string> = {
  youtube: "#FF0000",
  instagram: "#E4405F",
  tiktok: "#000000",
  linkedin: "#0077B5",
  facebook: "#1877F2",
  twitter: "#1DA1F2",
  snapchat: "#FFFC00",
};

const getPlatformIcon = (platform: SocialPlatform) => {
  const iconProps = {
    className: "w-6 h-6",
    viewBox: "0 0 24 24",
    fill: "currentColor",
  };

  const icons: Record<SocialPlatform, JSX.Element> = {
    youtube: (
      <svg {...iconProps}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    instagram: (
      <svg {...iconProps}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    tiktok: (
      <svg {...iconProps}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    linkedin: (
      <svg {...iconProps}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    ),
    facebook: (
      <svg {...iconProps}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    twitter: (
      <svg {...iconProps}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    snapchat: (
      <svg {...iconProps}>
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.219.082.336-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.013C24.007 5.367 18.641.001 12.017.001z" />
      </svg>
    ),
  };

  return icons[platform];
};

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
      {/* Header with platform name and icon */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div style={{ color: platformColors[platform] }}>
          {getPlatformIcon(platform)}
        </div>
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
