import React from "react";
import { HeartIcon } from "../icons/HeartIcon";
import { CommentIcon } from "../icons/CommentIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { MoreIcon } from "../icons/MoreIcon";

export const FacebookFeedUI: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="h-full bg-[#242526] text-[#E4E6EB] overflow-y-auto">
    <div className="bg-[#242526] py-3">
      <div className="px-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-500 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm">Facebook User</span>
                <p className="text-xs text-gray-400">Sponsored · 🌍</p>
              </div>
              <MoreIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
        <p className="text-sm my-2 px-1">
          Having a great time with this new app! It's so cool, you should
          definitely check it out.
        </p>
      </div>

      {children}

      <div className="px-3 mt-2">
        <div className="flex justify-between items-center text-gray-400 text-xs py-1">
          <span>👍❤️😂 1.2k</span>
          <span>345 Comments</span>
        </div>
        <div className="border-t border-gray-600 my-1"></div>
        <div className="flex justify-around items-center text-gray-400 font-semibold text-sm">
          <button className="flex-1 text-center py-1 rounded-md hover:bg-gray-700">
            👍 Like
          </button>
          <button className="flex-1 text-center py-1 rounded-md hover:bg-gray-700">
            💬 Comment
          </button>
          <button className="flex-1 text-center py-1 rounded-md hover:bg-gray-700">
            ➤ Share
          </button>
        </div>
      </div>
    </div>
  </div>
);
