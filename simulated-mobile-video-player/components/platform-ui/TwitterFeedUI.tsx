import React from "react";
import { HeartIcon } from "../icons/HeartIcon";
import { CommentIcon } from "../icons/CommentIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { RetweetIcon } from "../icons/RetweetIcon";
import { MoreIcon } from "../icons/MoreIcon";

export const TwitterFeedUI: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="h-full bg-[#000000] text-white overflow-y-auto">
    <div className="p-3 border-b border-gray-700">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-500 flex-shrink-0"></div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">X User</span>
              <span className="text-gray-500">@x_user · 1h</span>
            </div>
            <MoreIcon className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-sm mt-1 mb-3">
            Check out this awesome video! #dev #coolstuff
          </p>

          {children}

          <div className="flex justify-between items-center mt-3 text-gray-500 max-w-sm mx-auto">
            <button className="flex items-center gap-2 hover:text-blue-500">
              <CommentIcon className="w-5 h-5" />
              <span className="text-xs">123</span>
            </button>
            <button className="flex items-center gap-2 hover:text-green-500">
              <RetweetIcon className="w-5 h-5" />
              <span className="text-xs">45</span>
            </button>
            <button className="flex items-center gap-2 hover:text-pink-500">
              <HeartIcon className="w-5 h-5" />
              <span className="text-xs">678</span>
            </button>
            <button className="hover:text-blue-500">
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
    {/* You can add more mock tweets here to simulate a feed */}
  </div>
);
