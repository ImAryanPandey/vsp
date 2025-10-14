import { useState, useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
import VideoCarousel from "../components/home/VideoCarousel";
import { getAllVideos } from "../api/videos";

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const videoData = await getAllVideos({ page: 1, limit: 12 }); // Fetch 12 videos
        setVideos(videoData.docs || []); // The backend paginates results in 'docs'
        setError(null);
      } catch (err) {
        setError("Failed to fetch videos. Is the backend running?");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <p className="text-center p-8">Loading videos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 p-8">{error}</p>;
  }

  return (
    <>
      <HeroSection />
      <div className="space-y-12 py-8 lg:py-12">
        <VideoCarousel title="Latest Uploads" videos={videos} />
        <VideoCarousel title="Recommended for You" videos={[...videos].reverse()} />
      </div>
    </>
  );
};

export default HomePage;