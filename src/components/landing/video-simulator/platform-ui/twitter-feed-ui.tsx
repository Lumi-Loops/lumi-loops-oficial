"use client";

import React from "react";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Repeat2,
  Share,
} from "lucide-react";

export const TwitterFeedUI: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="h-full bg-[#000000] text-white overflow-y-auto">
    <div className="p-3 border-b border-gray-700">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden relative">
          <Image
            src="/images/components/avatar-example-mobile-simulater.png"
            alt="User avatar"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">X User</span>
              <span className="text-gray-500">@x_user · 1h</span>
            </div>
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-sm mt-1 mb-3">
            Check out this awesome video! #dev #coolstuff
          </p>

          {children}

          <div className="flex justify-between items-center mt-3 text-gray-500 max-w-sm mx-auto">
            <button className="flex items-center gap-2 hover:text-blue-500">
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">123</span>
            </button>
            <button className="flex items-center gap-2 hover:text-green-500">
              <Repeat2 className="w-5 h-5" />
              <span className="text-xs">45</span>
            </button>
            <button className="flex items-center gap-2 hover:text-pink-500">
              <Heart className="w-5 h-5" />
              <span className="text-xs">678</span>
            </button>
            <button className="hover:text-blue-500">
              <Share className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
