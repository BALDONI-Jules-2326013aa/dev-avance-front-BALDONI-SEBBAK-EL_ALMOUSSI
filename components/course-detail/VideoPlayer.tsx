"use client";

import React from "react";
import { Video } from "@/lib/types";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  video: Video;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, className = "" }) => {
  const videoUrl = video.fileUrl || video.url || '';

  const getFullUrl = (url: string): string => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://127.0.0.1:8000';
    return `${baseUrl}${url}`;
  };

  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");

  const getYouTubeEmbedUrl = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Play className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{video.title}</h4>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <div className="relative aspect-video bg-gray-900 rounded-b-xl overflow-hidden">
          {isYouTube ? (
            <iframe
              src={getYouTubeEmbedUrl(videoUrl)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          ) : (
            <video src={getFullUrl(videoUrl)} className="w-full h-full" controls title={video.title} />
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default VideoPlayer;
