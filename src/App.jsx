// API Documentation: https://github.com/D3vd/Meme_Api

import { useEffect, useState } from "react";
import "./App.css";
import Layout from "./Components/Layout";

function App() {
  const [meme, setMeme] = useState([]); // Initialize as empty array

  useEffect(() => {
    fetch("https://meme-api.com/gimme/12")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.memes); // log the data
        setMeme(data.memes); // set data.memes to the meme state
      });
  }, []);

  return (
    <>
      <Layout>
        <div className="flex flex-col items-center justify-center  pb-2">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">Meme API</h1>
            <p className="p-2 text-xl md:text-2xl">Random meme generator</p>
          </div>
          <div className="grid-row grid w-full max-w-screen-sm justify-center gap-4 sm:grid-cols-2 md:max-w-screen-md md:grid-cols-3 lg:max-w-screen-lg xl:max-w-screen-xl">
            {meme.map((item) => (
              <img src={item.url} alt={item.title} className=" rounded-lg" />
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}

export default App;
