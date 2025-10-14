const VideoCard = ({ video }) => {
  // Fallback for missing data
  const thumbnailUrl = video.thumbnailUrl || "https://placehold.co/1600x900?text=No+Image";
  const ownerAvatar = video.ownerDetails?.avatar || "https://placehold.co/40x40?text=A";
  const ownerName = video.ownerDetails?.username || "Unknown Channel";
  
  return (
    <div className="group flex flex-col gap-3">
      <div
        className="relative w-full overflow-hidden rounded-xl bg-gray-700 bg-center bg-no-repeat aspect-video bg-cover transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url("${thumbnailUrl}")` }}
      />
      <div className="flex items-start gap-3">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 shrink-0"
          style={{ backgroundImage: `url("${ownerAvatar}")`}}
        />
        <div className="flex flex-col">
          <p className="truncate text-base font-bold text-gray-900 dark:text-white leading-tight">
            {video.title}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {ownerName}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {video.views} views
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;