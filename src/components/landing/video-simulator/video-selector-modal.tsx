"use client";

import React from "react";
import Image from "next/image";
import { VIDEOS } from "./constants";
import type { Video } from "./types";
import { CloseIcon, PlayIcon } from "./icons";

interface VideoSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (video: Video) => void;
  currentVideoId: number;
}

export const VideoSelectorModal: React.FC<VideoSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentVideoId,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-gray-800/90 rounded-2xl w-[90%] max-w-sm p-4 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select a Video</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {VIDEOS.map((video) => (
            <button
              key={video.id}
              onClick={() => onSelect(video)}
              className={`w-full text-left p-2 rounded-lg flex items-center gap-4 transition-all duration-200 ${
                currentVideoId === video.id
                  ? "bg-indigo-600"
                  : "hover:bg-gray-700"
              }`}
            >
              <div className="relative w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
                {currentVideoId === video.id && (
                  <div className="absolute inset-0 bg-indigo-600/50 flex items-center justify-center">
                    <PlayIcon className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <span className="font-medium truncate">{video.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
