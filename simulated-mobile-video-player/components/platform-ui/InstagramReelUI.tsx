import React from "react";
import { HeartIcon } from "../icons/HeartIcon";
import { CommentIcon } from "../icons/CommentIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { MoreIcon } from "../icons/MoreIcon";
import { MusicNoteIcon } from "../icons/MusicNoteIcon";

export const InstagramReelUI: React.FC = () => (
  <div className="absolute inset-0 text-white p-4 flex flex-col justify-between pointer-events-none bg-gradient-to-t from-black/50 to-transparent">
    {/* Top part is usually empty in reels */}
    <div></div>

    {/* Bottom part */}
    <div className="flex items-end gap-2">
      {/* Left side: user info */}
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white flex-shrink-0"></div>
          <span className="font-bold text-sm">username</span>
          <button className="text-xs font-semibold border px-3 py-1 rounded-md pointer-events-auto hover:bg-white/20 transition-colors">
            Follow
          </button>
        </div>
        <p className="text-sm">This is a cool video caption #hashtag</p>
        <div className="flex items-center gap-2">
          <MusicNoteIcon className="w-4 h-4 flex-shrink-0" />
          <div className="text-sm truncate w-full relative h-5 overflow-hidden">
            <p className="absolute animate-[scroll-text_8s_linear_infinite]">
              Original audio - username - song name
            </p>
          </div>
        </div>
      </div>
      {/* Right side: action buttons */}
      <div className="flex flex-col items-center space-y-5">
        <button className="flex flex-col items-center pointer-events-auto">
          <HeartIcon className="w-7 h-7" />
          <span className="text-xs font-semibold">1.2M</span>
        </button>
        <button className="flex flex-col items-center pointer-events-auto">
          <CommentIcon className="w-7 h-7" />
          <span className="text-xs font-semibold">4,321</span>
        </button>
        <button className="pointer-events-auto">
          <ShareIcon className="w-7 h-7" />
        </button>
        <button className="pointer-events-auto">
          <MoreIcon className="w-7 h-7" />
        </button>
        <div className="w-8 h-8 rounded-md bg-gray-600 border-2 border-white mt-1"></div>
      </div>
    </div>
    <style>{`
      @keyframes scroll-text {
        from { transform: translateX(100%); }
        to { transform: translateX(-100%); }
      }
    `}</style>
  </div>
);
