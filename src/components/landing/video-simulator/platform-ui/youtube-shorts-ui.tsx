"use client";

import React from "react";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Share2,
  ThumbsDown,
} from "lucide-react";

export const YoutubeShortsUI: React.FC = () => (
  <div className="absolute inset-0 text-white p-4 flex flex-col justify-between pointer-events-none bg-gradient-to-t from-black/60 to-transparent">
    {/* Top part is empty */}
    <div></div>

    <div className="flex items-end gap-3">
      {/* Left side: user info and caption */}
      <div className="flex-1 space-y-2 min-w-0">
        <p className="text-sm">
          This is an amazing short video! #shorts #youtube
        </p>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-500 flex-shrink-0"></div>
          <span className="font-semibold text-sm">@youtuber</span>
          <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full pointer-events-auto hover:bg-gray-200 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
      {/* Right side: action buttons */}
      <div className="flex flex-col items-center space-y-5">
        <button className="flex flex-col items-center pointer-events-auto">
          <Heart className="w-7 h-7" />
          <span className="text-xs font-semibold">1.5M</span>
        </button>
        <button className="flex flex-col items-center pointer-events-auto">
          <ThumbsDown className="w-7 h-7" />
          <span className="text-xs font-semibold">Dislike</span>
        </button>
        <button className="flex flex-col items-center pointer-events-auto">
          <MessageCircle className="w-7 h-7" />
          <span className="text-xs font-semibold">8,123</span>
        </button>
        <button className="flex flex-col items-center pointer-events-auto">
          <Share2 className="w-7 h-7" />
          <span className="text-xs font-semibold">Share</span>
        </button>
        <button className="pointer-events-auto">
          <MoreVertical className="w-7 h-7" />
        </button>
        <div className="w-8 h-8 rounded-md bg-gray-600 border-2 border-white mt-1 animate-pulse"></div>
      </div>
    </div>
  </div>
);
