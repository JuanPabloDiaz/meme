// API Documentation: https://github.com/D3vd/Meme_Api

import { useEffect, useState } from "react";
import Layout from "./Components/Layout";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import required modules
import { Navigation, Pagination, Keyboard, Autoplay } from 'swiper/modules';

const MEME_CACHE_KEY = 'memeApiCache';
const CACHE_EXPIRATION_MS = 5 * 60 * 1000;

const validateMemesData = (data) => {
  if (!data || !data.memes || !Array.isArray(data.memes)) {
    console.warn("Invalid meme data structure:", data);
    return [];
  }

  return data.memes.filter((meme) => {
    const hasUrl = typeof meme.url === 'string' && meme.url.length > 0;
    const hasTitle = typeof meme.title === 'string' && meme.title.length > 0;
    const hasPreview = Array.isArray(meme.preview) && meme.preview.length > 0 && meme.preview.every(p => typeof p === 'string');
    const isNotNsfw = meme.nsfw === false;
    return hasUrl && hasTitle && hasPreview && isNotNsfw;
  });
};

function App() {
  const [meme, setMeme] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMemes = async () => {
    try {
      const cached = localStorage.getItem(MEME_CACHE_KEY);
      if (cached) {
        const { timestamp, data: cachedData } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRATION_MS) {
          const validMemes = validateMemesData(cachedData);
          setMeme(validMemes);
          setLoading(false);
          if (validMemes.length === 0) {
            setError("No valid memes found in cache. Try fetching fresh ones.");
          } else {
            setError(null);
          }
          return;
        } else {
          localStorage.removeItem(MEME_CACHE_KEY);
        }
      }
    } catch (e) {
      localStorage.removeItem(MEME_CACHE_KEY);
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://meme-api.com/gimme/12");
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      localStorage.setItem(MEME_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
      const validMemes = validateMemesData(data);
      setMeme(validMemes);
      if (validMemes.length === 0) {
        setError("No valid memes found from API. Please try again.");
      } else {
        setError(null);
      }
    } catch (err) {
      setError(`Failed to fetch memes: ${err.message}. Please try again.`);
      setMeme([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  const startYear = 2023;
  const currentYear = new Date().getFullYear();
  const yearText = startYear === currentYear ? startYear : `${startYear} - ${currentYear}`;
  const developer = "Juan Díaz";

  if (loading) {
    return (
      <div>
        <Layout>
          <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
            <div className="mb-8">
              <h1 className="mb-6 text-5xl font-bold md:text-7xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Meme API
              </h1>
              <div className="flex items-center justify-center space-x-2 text-cyan-300">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <p className="ml-3 text-xl md:text-2xl font-medium">Loading fresh memes...</p>
              </div>
            </div>
            <div className="w-full max-w-6xl mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                    <div className="relative bg-slate-800 rounded-xl h-64 animate-pulse border border-slate-700"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Layout>
          <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-2xl">
              <h1 className="mb-6 text-4xl font-bold md:text-6xl bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                Oops! Something went wrong
              </h1>
              <p className="p-4 text-lg md:text-xl text-red-300 bg-red-900/20 rounded-lg border border-red-800 mb-6">
                {error}
              </p>
              <button
                onClick={fetchMemes}
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
              >
                <span className="relative z-10">Try Again</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  return (
    <div>
      <Layout>
        <div className="flex min-h-screen flex-col items-center justify-center pb-8 px-4">
          <div className="text-center mb-12">
            <h1 className="mb-6 text-5xl font-bold md:text-7xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Meme API
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-medium">
              Random meme generator
            </p>
            <div className="mt-4 h-1 w-32 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto"></div>
          </div>

          <div className="w-full max-w-7xl relative">
            {meme.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                  <div className="text-6xl mb-4">😴</div>
                  <p className="text-xl text-slate-300">No memes available at the moment</p>
                  <p className="text-slate-400 mt-2">Please try again later!</p>
                </div>
              </div>
            ) : (
              <Swiper
                modules={[Navigation, Pagination, Keyboard, Autoplay]}
                navigation={{
                  prevEl: ".custom-swiper-button-prev",
                  nextEl: ".custom-swiper-button-next",
                }}
                pagination={{ 
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet',
                  bulletActiveClass: 'swiper-pagination-bullet-active'
                }}
                keyboard={{ enabled: true }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={true}
                spaceBetween={24}
                breakpoints={{
                  320: { slidesPerView: 1.2, spaceBetween: 16, centeredSlides: true },
                  480: { slidesPerView: 1.5, spaceBetween: 20, centeredSlides: true },
                  768: { slidesPerView: 2.2, spaceBetween: 24, centeredSlides: false },
                  1024: { slidesPerView: 3.2, spaceBetween: 24 },
                  1280: { slidesPerView: 3.8, spaceBetween: 24 },
                }}
                className="pb-12"
              >
                {meme.map((item, index) => (
                  <SwiperSlide key={item.url} className="group">
                    <div className="relative">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
                      
                      {/* Main card */}
                      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10">
                        
                        {/* Image container */}
                        <div className="relative overflow-hidden rounded-xl bg-slate-900 aspect-square mb-4">
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
                            loading="lazy"
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Meme number badge */}
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            #{index + 1}
                          </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2 min-h-[58px]">
                          <h3 className="text-slate-200 font-semibold text-sm leading-tight line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300">
                            {item.title}
                          </h3>
                          
                          {/* Subreddit info */}
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                              r/{item.subreddit || 'memes'}
                            </span>
                            <div className="flex items-center space-x-1 text-slate-500">
                              <span>👍</span>
                              <span>{item.ups || '0'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Hover overlay with action */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl flex items-center justify-center">
                          <a
                            href={item.preview[item.preview.length - 1]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-md"
                          >
                            View Full Size
                          </a>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}

                {/* Custom Navigation Buttons */}
                <div className="custom-swiper-button-prev absolute top-1/2 left-4 -translate-y-1/2 z-10 w-12 h-12 bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 rounded-full border border-slate-600 hover:border-cyan-500/50 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/25">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                
                <div className="custom-swiper-button-next absolute top-1/2 right-4 -translate-y-1/2 z-10 w-12 h-12 bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 rounded-full border border-slate-600 hover:border-cyan-500/50 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/25">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  </div>
              </Swiper>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-full px-6 py-3 border border-slate-700">
              <span className="text-slate-400">© {yearText}</span>
              <span className="mx-3 text-slate-600">•</span>
              <span className="text-slate-400">Developed by</span>
              <a
                href="http://jpdiaz.dev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Website developed by ${developer}`}
                className="ml-2 font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent hover:from-cyan-300 hover:to-blue-300 transition-all duration-300"
              >
                {developer}
              </a>
            </div>
          </div>
        </div>
      </Layout>
      
      {/* Custom Swiper Pagination Styles */}
      <style jsx>{`
        .swiper-pagination-bullet {
          background: rgb(71 85 105 / 0.5) !important;
          border: 1px solid rgb(100 116 139) !important;
          opacity: 1 !important;
          width: 12px !important;
          height: 12px !important;
        }
        .swiper-pagination-bullet-active {
          background: linear-gradient(45deg, rgb(6 182 212), rgb(59 130 246)) !important;
          border-color: rgb(6 182 212) !important;
          box-shadow: 0 0 10px rgb(6 182 212 / 0.5) !important;
        }
      `}</style>
    </div>
  );
}

export default App;