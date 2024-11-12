import { useState, useEffect, useRef } from "react";
import spinner from "../assets/spinner.svg";
import usePhotos from "../hooks/usePhotos";

export default function List() {
  const [query, setQuery] = useState("random");
  const [pageNumber, setPageNumber] = useState(1);
  const lastPhotoRef = useRef();
  const searchRef = useRef();
  const photosApiData = usePhotos(query, pageNumber);

  useEffect(() => {
    if (lastPhotoRef.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && photosApiData.maxPages !== pageNumber) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);

          lastPhotoRef.current = null;
          observer.disconnect();
        }
      });
      observer.observe(lastPhotoRef.current);
    }
  }, [photosApiData]);

  function handleSubmit(e) {
    e.preventDefault();
    if (searchRef.current.value !== query) {
      setQuery(searchRef.current.value);
      setPageNumber(1);
    }
  }

  return (
    <>
      <h1 className="text-4xl">Unsplash Clone</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-4" htmlFor="search">
          Look for images...
        </label>
        <input
          placeholder="Look for something..."
          className="block w-full mb-14 text-slate-800 py-3 px-2 text-md outline-gray-500 rounded border border-slate-400"
          id="search"
          type="text"
          ref={searchRef}
        />
      </form>
      {/* Error display */}
      {photosApiData.error.state && (
        <p className="text-center text-red-600">{photosApiData.error.msg}</p>
      )}
      {/* No error but no results either display */}
      {photosApiData.photos.length === 0 &&
        !photosApiData.error.state &&
        !photosApiData.loading && (
          <p className="text-center text-slate-800">No results found</p>
        )}
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,_1fr))] auto-rows-[175px] gap-4 justify-center">
        {!undefined &&
          photosApiData.photos.length !== 0 &&
          photosApiData.photos.map((photo, index) => {
            if (photosApiData.photos.length === index + 1) {
              return (
                <li ref={lastPhotoRef} key={photo.id}>
                  <img
                    className="w-full h-full object-cover"
                    src={photo.urls.regular}
                    alt={photo.alt_description}
                  />
                </li>
              );
            } else {
              return (
                <li key={photo.id}>
                  <img
                    className="w-full h-full object-cover"
                    src={photo.urls.regular}
                    alt={photo.alt_description}
                  />
                </li>
              );
            }
          })}
      </ul>
      {/* Loader */}
      {photosApiData.loading && !photosApiData.error.state && (
        <img className="block mx-auto" src={spinner} alt="spinner" />
      )}
      {/* When reaching last result*/}
      {photosApiData.maxPages === pageNumber && (
        <p className="mt-10 text-center text-slate-800">No more results</p>
      )}
    </>
  );
}
