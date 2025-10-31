import React from "react";
import { HeartIcon } from "../icons/HeartIcon";
import { CommentIcon } from "../icons/CommentIcon";
import { BookmarkIcon } from "../icons/BookmarkIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { MusicNoteIcon } from "../icons/MusicNoteIcon";

export const TiktokUI: React.FC = () => (
  <div className="absolute inset-0 text-white p-3 flex flex-col justify-between pointer-events-none bg-gradient-to-t from-black/50 to-transparent">
    <div></div>
    <div className="flex items-end gap-2">
      {/* Left side */}
      <div className="flex-1 space-y-2 min-w-0">
        <h3 className="font-bold text-base">@username</h3>
        <p className="text-sm">This is a viral video caption! #fyp #foryou</p>
        <div className="flex items-center gap-2">
          <MusicNoteIcon className="w-5 h-5" />
          <p className="text-sm truncate">trending_sound - Original Sound</p>
        </div>
      </div>
      {/* Right side */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gray-400 border-2 border-white"></div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs pointer-events-auto">
            +
          </div>
        </div>
        <button className="flex flex-col items-center pointer-events-auto">
          <HeartIcon className="w-9 h-9" />
          <span className="text-sm font-bold">2.1M</span>
        </button>
        <button className="flex flex-col items-center pointer-events-auto">
          <CommentIcon className="w-9 h-9" />
          <span className="text-sm font-bold">12.3K</span>
        </button>
        <button className="flex flex-col items-center pointer-events-auto">
          <BookmarkIcon className="w-9 h-9" />
          <span className="text-sm font-bold">234.5K</span>
        </button>
        <button className="flex flex-col items-center pointer-events-auto">
          <ShareIcon className="w-9 h-9" />
          <span className="text-sm font-bold">56.7K</span>
        </button>
        <div className="w-12 h-12 rounded-full bg-gray-800 border-4 border-gray-600 animate-spin-slow">
          <div className="w-full h-full rounded-full bg-gray-500"></div>
        </div>
      </div>
    </div>
    <style>{`
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spin-slow 8s linear infinite;
      }
    `}</style>
  </div>
);
