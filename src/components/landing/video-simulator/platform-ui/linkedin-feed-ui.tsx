"use client";

import React from "react";
import Image from "next/image";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";

export const LinkedInFeedUI: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="h-full bg-[#F3F2EF] text-[#000000D9] overflow-y-auto">
    <div className="bg-white m-2 rounded-lg border border-gray-300">
      <div className="p-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden relative">
            <Image
              src="/images/components/avatar-example-mobile-simulater.png"
              alt="User avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <span className="font-semibold text-sm">Professional User</span>
            <p className="text-xs text-gray-500">
              CTO at Tech Innovations Inc.
            </p>
            <p className="text-xs text-gray-500">1d · Edited · 🌍</p>
          </div>
        </div>
        <p className="text-sm my-2">
          Excited to share this insightful video on the future of frontend
          development. Continuous learning is key! #Tech #Innovation #React
        </p>
      </div>

      {children}

      <div className="px-3 mt-2">
        <div className="flex justify-between items-center text-gray-500 text-xs py-1">
          <span>💡❤️ 2,458 reactions</span>
          <span>157 comments · 89 reposts</span>
        </div>
        <div className="border-t border-gray-200 my-1"></div>
        <div className="flex justify-around items-center text-gray-600 font-semibold text-sm">
          <button className="flex items-center gap-1 flex-1 justify-center py-2 rounded-md hover:bg-gray-200">
            <Heart className="w-5 h-5" /> Like
          </button>
          <button className="flex items-center gap-1 flex-1 justify-center py-2 rounded-md hover:bg-gray-200">
            <MessageCircle className="w-5 h-5" /> Comment
          </button>
          <button className="flex items-center gap-1 flex-1 justify-center py-2 rounded-md hover:bg-gray-200">
            <Repeat2 className="w-5 h-5" /> Repost
          </button>
          <button className="flex items-center gap-1 flex-1 justify-center py-2 rounded-md hover:bg-gray-200">
            <Share className="w-5 h-5" /> Send
          </button>
        </div>
      </div>
    </div>
  </div>
);
