import React from "react";
import { CommentIcon } from "../icons/CommentIcon";

export const SnapchatUI: React.FC = () => (
  <div className="absolute inset-0 text-white p-4 flex flex-col justify-between pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/40">
    {/* Top part: user info */}
    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm p-2 rounded-full">
      <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white flex-shrink-0"></div>
      <div>
        <span className="font-bold text-sm">snap_user</span>
        <p className="text-xs opacity-80">Today</p>
      </div>
    </div>

    {/* Bottom part: actions */}
    <div className="flex justify-between items-center">
      <div></div>
      <div className="flex flex-col items-center gap-1 pointer-events-auto">
        <CommentIcon className="w-7 h-7" />
        <span className="font-semibold text-xs">Chat</span>
      </div>
    </div>
  </div>
);
