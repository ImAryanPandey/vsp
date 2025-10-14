const HeroSection = () => {
  const PlayIcon = () => (
    <svg
      className="mr-2"
      fill="currentColor"
      height="1.2em"
      viewBox="0 0 256 256"
      width="1.2em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M240,128a15.87,15.87,0,0,1-7.74,13.78l-144,88A16,16,0,0,1,64,216V40a16,16,0,0,1,24.26-13.78l144,88A15.87,15.87,0,0,1,240,128Z"></path>
    </svg>
  );

  return (
    <div className="@container">
      <div
        className="relative flex min-h-[60vh] flex-col items-start justify-end bg-cover bg-center @[768px]:min-h-[80vh]"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(22, 16, 34, 0.8) 0%, rgba(22, 16, 34, 0) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBbFWPSy_9aGCIrXXCeMGf10S2Pk2ai8dkU-3WBq3Oi1AIffxjp-9cf6BTUglpvYJioUlrthf1a71Txekmo8ihgdW-AhcKLE9X9TwQlySKnydDpSbsSienT5bLmpkoKaI6aargEMKRM4v8iHFE-6La-VvlGifVWodWbHLqBwhoD-7oNffT8T9X2T8TqtPWa6a52w81GA59mtLHg6w7BHY_MvhFCVgvRjI1n3x62tGPTeNJQM0N2021yRsRmFeD0mt8ajZsQKjYi6Q")`,
        }}
      >
        <div className="w-full p-4 text-white sm:p-6 lg:p-12">
          <div className="max-w-xl space-y-4">
            <h1 className="text-4xl font-black tracking-tighter sm:text-5xl lg:text-6xl">
              The Last Frontier
            </h1>
            <p className="text-base font-medium text-gray-200 sm:text-lg">
              A gripping space opera about humanity's struggle for survival in a
              distant galaxy.
            </p>
            <button className="flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-100 sm:px-6 sm:py-3 sm:text-lg">
              <PlayIcon />
              <span>Watch Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;