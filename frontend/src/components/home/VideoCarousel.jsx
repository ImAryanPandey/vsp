import VideoCard from "../video/VideoCard";

const VideoCarousel = ({ title, videos = [] }) => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        {title}
      </h2>
      <div className="mt-6">
        <div className="no-scrollbar grid grid-flow-col auto-cols-[60%] gap-4 overflow-x-auto pb-4 sm:auto-cols-[40%] md:auto-cols-[28%] lg:auto-cols-[22%] xl:auto-cols-[18%]">
          {videos.length > 0 ? (
            videos.map((video) => <VideoCard key={video._id} video={video} />)
          ) : (
            <p>No videos to display.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoCarousel;