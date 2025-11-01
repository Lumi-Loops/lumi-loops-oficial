"use client";

import React, { useEffect, useRef, useState } from "react";
import { VIDEOS } from "./constants";
import type { SocialPlatform, Video } from "./types";
import { PlayIcon, VideoIcon } from "./icons";
import { VideoSelectorModal } from "./video-selector-modal";
import { InstagramReelUI } from "./platform-ui/instagram-reel-ui";
import { TiktokUI } from "./platform-ui/tiktok-ui";
import { TwitterFeedUI } from "./platform-ui/twitter-feed-ui";
import { FacebookFeedUI } from "./platform-ui/facebook-feed-ui";
import { LinkedInFeedUI } from "./platform-ui/linkedin-feed-ui";
import { YoutubeShortsUI } from "./platform-ui/youtube-shorts-ui";
import { SnapchatUI } from "./platform-ui/snapchat-ui";

interface MobileSimulatorProps {
  platform: SocialPlatform;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  platform,
}) => {
  const [currentVideo, setCurrentVideo] = useState<Video>(VIDEOS[0]);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSelectVideo = (video: Video) => {
    setCurrentVideo(video);
    setIsSelectorOpen(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((error) => {
          console.error("Video play failed:", error);
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentVideo]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const renderScreenContent = () => {
    const videoPlayer = (
      <video
        ref={videoRef}
        key={currentVideo.id}
        src={currentVideo.url}
        loop
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        onClick={togglePlay}
      />
    );

    const playPauseOverlay = !isPlaying && (
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
        <PlayIcon className="w-16 h-16 text-white/80" />
      </div>
    );

    const isReelStyle = ["instagram", "tiktok", "youtube", "snapchat"].includes(
      platform
    );
    const isFeedStyle = ["twitter", "facebook", "linkedin"].includes(platform);

    if (isReelStyle) {
      let UILayer = null;
      switch (platform) {
        case "instagram":
          UILayer = <InstagramReelUI />;
          break;
        case "tiktok":
          UILayer = <TiktokUI />;
          break;
        case "youtube":
          UILayer = <YoutubeShortsUI />;
          break;
        case "snapchat":
          UILayer = <SnapchatUI />;
          break;
      }
      return (
        <div className="w-full h-full relative" onClick={togglePlay}>
          {videoPlayer}
          {UILayer}
          {playPauseOverlay}
        </div>
      );
    }

    if (isFeedStyle) {
      let FeedUIComponent: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => <>{children}</>;
      switch (platform) {
        case "twitter":
          FeedUIComponent = TwitterFeedUI;
          break;
        case "facebook":
          FeedUIComponent = FacebookFeedUI;
          break;
        case "linkedin":
          FeedUIComponent = LinkedInFeedUI;
          break;
      }
      const videoContainer = (
        <div
          className="relative rounded-lg overflow-hidden w-full aspect-[9/16] mx-auto"
          onClick={togglePlay}
        >
          {videoPlayer}
          {playPauseOverlay}
        </div>
      );
      return <FeedUIComponent>{videoContainer}</FeedUIComponent>;
    }

    // Generic view
    return (
      <div className="w-full h-full relative" onClick={togglePlay}>
        {videoPlayer}
        {playPauseOverlay}
      </div>
    );
  };

  return (
    <div className="group relative w-[340px] h-[700px] md:w-[360px] md:h-[740px] bg-black rounded-[50px] shadow-2xl p-3 border-4 border-gray-700">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-10">
        <div className="absolute left-1/2 -translate-x-1/2 top-2 w-12 h-1 bg-gray-600 rounded-full"></div>
      </div>

      <div className="w-full h-full bg-black rounded-[38px] overflow-hidden relative">
        {renderScreenContent()}

        <div className="absolute bottom-4 right-4 z-20">
          <button
            onClick={() => setIsSelectorOpen(true)}
            className="bg-black/50 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/20 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
            aria-label="Select video"
          >
            <VideoIcon className="w-6 h-6" />
          </button>
        </div>

        <VideoSelectorModal
          isOpen={isSelectorOpen}
          onClose={() => setIsSelectorOpen(false)}
          onSelect={handleSelectVideo}
          currentVideoId={currentVideo.id}
        />
      </div>

      {/* Side buttons for aesthetics */}
      <div className="absolute -left-[4px] top-20 w-1 h-8 bg-gray-700 rounded-l-md"></div>
      <div className="absolute -left-[4px] top-32 w-1 h-14 bg-gray-700 rounded-l-md"></div>
      <div className="absolute -right-[4px] top-24 w-1 h-16 bg-gray-700 rounded-r-md"></div>
    </div>
  );
};
