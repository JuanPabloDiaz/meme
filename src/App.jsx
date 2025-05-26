// API Documentation: https://github.com/D3vd/Meme_Api

import { useEffect, useState } from "react";
import "./App.css";
import Layout from "./Components/Layout";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules (removed Lazy)
import { Navigation, Pagination, Keyboard, Autoplay } from 'swiper/modules';

const MEME_CACHE_KEY = 'memeApiCache';
const CACHE_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes

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
          console.log("Using cached memes");
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
          console.log("Cache expired");
          localStorage.removeItem(MEME_CACHE_KEY);
        }
      }
    } catch (e) {
      console.warn("Cache read error:", e);
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
      try {
        const cacheEntry = { timestamp: Date.now(), data: data };
        localStorage.setItem(MEME_CACHE_KEY, JSON.stringify(cacheEntry));
        console.log("Memes cached");
      } catch (e) {
        console.warn("Cache write error:", e);
      }

      const validMemes = validateMemesData(data);
      console.log("Filtered memes:", validMemes);
      setMeme(validMemes);

      if (validMemes.length === 0) {
        setError("No valid memes found from API. Please try again.");
      } else {
        setError(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
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
  const yearText =
    startYear === currentYear ? startYear : `${startYear} - ${currentYear}`;
  const developer = "Juan Díaz";

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">Meme API</h1>
          <p className="p-2 text-xl md:text-2xl">Fetching fresh memes...</p>
          <div className="w-full max-w-screen-lg mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" style={{ height: '200px', width: '100%' }}></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">Meme API</h1>
          <p className="p-2 text-xl md:text-2xl text-red-500">{error}</p>
          <button
            onClick={fetchMemes}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex min-h-screen flex-col items-center justify-center pb-2">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">Meme API</h1>
          <p className="p-2 text-xl md:text-2xl">Random meme generator</p>
        </div>
        <div className="w-full max-w-screen-lg relative my-8">
          {meme.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-500">No memes available at the moment. Please try again later!</p>
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Keyboard, Autoplay]}
              navigation={true}
              pagination={{ clickable: true }}
              keyboard={{ enabled: true }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              spaceBetween={20}
              loop={true}
              breakpoints={{
                320: { slidesPerView: 1.2, spaceBetween: 10, centeredSlides: true },
                480: { slidesPerView: 1.5, spaceBetween: 15, centeredSlides: true },
                768: { slidesPerView: 2.5, spaceBetween: 20, centeredSlides: false },
                1024: { slidesPerView: 3.5, spaceBetween: 20 },
                1280: { slidesPerView: 4, spaceBetween: 20 },
              }}
            >
              {meme.map((item) => (
                <SwiperSlide key={item.url} className="group">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="rounded-lg w-full h-64 md:h-80 object-cover shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        <div className="py-4 text-center">
          © {yearText}
          <span className="mx-1">•</span>
          Developed by
          <a
            href="http://jpdiaz.dev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Website developed by ${developer}`}
            className="pl-1 font-bold hover:underline hover:underline-offset-4"
          >
            {" "}
            {developer}
          </a>
        </div>
      </div>
    </Layout>
  );
}

export default App;